import { useMemo } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { ProjectService } from "@/services/project.service";
import { UserService } from "@/services/user.service";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";

export const useProjects = () => {
  const session = AuthService.getSession();
  const userId = session?.user.id;
  const companyId = session?.companyId;
  const queryClient = useQueryClient();

  const projectsQuery = useQuery<Project[]>({
    queryKey: ["projects", userId, companyId],
    queryFn: async () => {
      if (!userId || !companyId) {
        throw new Error("Connecte-toi pour charger les projets.");
      }

      return ProjectService.listByUser(userId, userId, companyId);
    },
    enabled: !!userId && !!companyId,
    staleTime: 1000 * 60,
  });

  const companyQuery = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      if (!userId || !companyId) {
        throw new Error("Connecte-toi pour charger l'entreprise.");
      }

      return CompanyService.getById(companyId, userId);
    },
    enabled: !!userId && !!companyId,
    staleTime: 1000 * 60,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      if (!userId || !companyId) {
        throw new Error("Connecte-toi pour supprimer un projet.");
      }

      return ProjectService.delete(projectId, {
        requesterId: userId,
        requesterCompanyId: companyId,
      });
    },
    onSuccess: () => {
      if (userId && companyId) {
        queryClient.invalidateQueries({ queryKey: ["projects", userId, companyId] });
      }
    },
  });

  const memberIds = useMemo(() => {
    const projects = projectsQuery.data || [];
    return Array.from(
      new Set(
        projects.flatMap((project) => project.members?.map((member) => member.userId) ?? [])
      )
    );
  }, [projectsQuery.data]);

  const memberQueries = useQueries({
    queries: memberIds.map((memberId) => ({
      queryKey: ["user", memberId],
      queryFn: async () => UserService.getById(memberId),
      staleTime: 1000 * 60,
      enabled: !!memberId,
    })),
  });

  const memberMap = useMemo(() => {
    const map = new Map<string, User>();

    memberQueries.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });

    return map;
  }, [memberQueries]);

  const enrichedProjects = useMemo(() => {
    const projects = projectsQuery.data || [];

    return projects.map((project) => ({
      ...project,
      members: project.members?.map((member) => ({
        ...member,
        name:
          member.name ||
          member.role ||
          memberMap.get(member.userId)?.name ||
          "Membre",
        avatarUrl: member.avatarUrl || memberMap.get(member.userId)?.avatarUrl,
      })),
    }));
  }, [projectsQuery.data, memberMap]);

  return {
    projectsQuery,
    companyQuery,
    enrichedProjects,
    deleteProjectMutation,
    userId,
    companyId,
  };
};

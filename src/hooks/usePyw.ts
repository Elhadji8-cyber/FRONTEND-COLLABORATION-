import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { FileVersionService } from "@/services/file-version.service";
import { PywService } from "@/services/pyw.service";
import type { FileVersion, Pyw, PywStatus } from "@/types/pyw";
import type { PywDetailResponse } from "@/services/pyw.service";

const DEFAULT_STALE_TIME = 1000 * 60;

export const usePywList = (projectId: string) => {
  return useQuery<Pyw[]>({
    queryKey: ["pyw", "project", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Identifiant de projet manquant.");
      }
      return PywService.listByProject(projectId);
    },
    enabled: !!projectId,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useCompanyPywList = (companyId: string) => {
  return useQuery<Pyw[]>({
    queryKey: ["pyw", "company", companyId],
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Identifiant d'entreprise manquant.");
      }
      return PywService.listByCompany(companyId);
    },
    enabled: !!companyId,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const usePywDetail = (pywId: string) => {
  return useQuery<PywDetailResponse>({
    queryKey: ["pyw", pywId],
    queryFn: async () => {
      if (!pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      return PywService.getDetail(pywId, AuthService.getAccessToken());
    },
    enabled: !!pywId,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const usePywVersions = (pywId: string, token?: string) => {
  return useQuery<FileVersion[]>({
    queryKey: ["pyw", pywId, "versions"],
    queryFn: async () => {
      if (!pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      return FileVersionService.getVersionHistory(pywId, token);
    },
    enabled: !!pywId,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const usePywReview = (_projectId?: string) => {
  const queryClient = useQueryClient();
  void _projectId;

  return useMutation({
    mutationFn: async (payload: { pywId: string; status: Exclude<PywStatus, "pending">; ownerComment?: string }) => {
      if (!payload.pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      return PywService.review(payload.pywId, payload.status, payload.ownerComment || "");
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pyw", variables.pywId] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "project"] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "company"] });
    },
  });
};

export const usePywSubmit = (projectId?: string, companyId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { title: string; description?: string; filesUrl?: string }) => {
      if (!projectId && !companyId) {
        throw new Error("Identifiant de projet ou d'entreprise manquant.");
      }
      return PywService.create({
        projectId,
        companyId,
        title: payload.title,
        description: payload.description,
        filesUrl: payload.filesUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pyw", "project"] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "company"] });
    },
  });
};

export const useSubmitPywVersion = (pywId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { file: File; token?: string }) => {
      if (!pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      return PywService.submitVersionWithFile(
        pywId,
        payload.file,
        `Upload : ${payload.file.name}`,
        undefined,
        payload.token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pyw", pywId] });
      queryClient.invalidateQueries({ queryKey: ["pyw", pywId, "versions"] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "project"] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "company"] });
    },
  });
};

export const usePywDelete = (_projectId?: string) => {
  const queryClient = useQueryClient();
  void _projectId;

  return useMutation({
    mutationFn: async (pywId: string) => {
      if (!pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      const session = AuthService.getSession();
      return PywService.delete(pywId, session?.accessToken);
    },
    onSuccess: (_, pywId) => {
      queryClient.invalidateQueries({ queryKey: ["pyw", pywId] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "project"] });
      queryClient.invalidateQueries({ queryKey: ["pyw", "company"] });
    },
  });
};

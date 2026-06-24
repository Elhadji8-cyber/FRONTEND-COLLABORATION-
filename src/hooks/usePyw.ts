import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { FileVersionService } from "@/services/file-version.service";
import { PywService } from "@/services/pyw.service";
import type { FileVersion, Pyw, PywDetailResponse, PywStatus } from "@/types/pyw";

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

export const usePywDetail = (pywId: string) => {
  return useQuery<PywDetailResponse>({
    queryKey: ["pyw", pywId],
    queryFn: async () => {
      if (!pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      return PywService.getDetail(pywId);
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

export const usePywReview = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { pywId: string; status: Exclude<PywStatus, "pending">; ownerComment?: string }) => {
      if (!payload.pywId) {
        throw new Error("Identifiant PYW manquant.");
      }
      return PywService.review(payload.pywId, payload.status, payload.ownerComment || "");
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pyw", variables.pywId] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["pyw", "project", projectId] });
      }
    },
  });
};

export const usePywSubmit = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { title: string; description?: string; filesUrl?: string }) => {
      if (!projectId) {
        throw new Error("Identifiant de projet manquant.");
      }
      return PywService.create({
        projectId,
        title: payload.title,
        description: payload.description,
        filesUrl: payload.filesUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pyw", "project", projectId] });
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
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["pyw", pywId] });
      queryClient.invalidateQueries({ queryKey: ["pyw", pywId, "versions"] });
    },
  });
};

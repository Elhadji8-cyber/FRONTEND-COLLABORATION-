import { apiFetch, API_BASE_URL } from "@/lib/api";
import type { BackendFile, ProjectFile } from "@/types/file";

function mapBackendFile(file: BackendFile): ProjectFile {
  return {
    id: file._id || file.id || "",
    fileName: file.file_name,
    fileType: file.file_type,
    fileSize: file.file_size,
    storageKey: file.storage_key,
    downloadUrl: file.download_url,
    projectId: file.project_id,
    companyId: file.company_id,
    uploadedBy: file.uploaded_by,
    visibility: file.visibility,
    version: file.version,
    createdAt: file.created_at,
    updatedAt: file.updated_at,
  };
}

function toAbsoluteApiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalizedBase = (API_BASE_URL || "").replace(/\/+$|\/api\/v1\/?$/g, "");

  if (url.startsWith("/api/v1/")) {
    return `${normalizedBase}${url}`;
  }

  if (url.startsWith("/")) {
    return `${normalizedBase}/api/v1${url}`;
  }

  return `${API_BASE_URL.replace(/\/+$|\/api\/v1\/?$/g, "")}/${url}`;
}

function extractStorageKeyFromUrl(fileUrl?: string): string | undefined {
  if (!fileUrl) return undefined;

  try {
    const url = new URL(fileUrl);
    const parts = decodeURIComponent(url.pathname).split("/").filter(Boolean);

    if (url.hostname.includes("r2.cloudflarestorage.com") && parts.length > 1) {
      return parts.slice(1).join("/");
    }

    if (parts.length > 0) {
      return parts.join("/");
    }
  } catch {
    // ignore invalid URLs
  }

  return undefined;
}

async function fetchBlob(url: string, token?: string): Promise<Blob> {
  const absoluteUrl = toAbsoluteApiUrl(url);

  const res = await fetch(absoluteUrl, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");

    if (text.toLowerCase().includes("<html") || text.toLowerCase().includes("this page could not be found")) {
      throw new Error("La route de téléchargement est invalide. Le fichier n’a pas pu être récupéré depuis l’API.");
    }

    throw new Error(text || `Download failed with status ${res.status}`);
  }

  return res.blob();
}

export class FileService {
  static async listByProject(payload: {
    projectId: string;
    requesterId: string;
    requesterCompanyId: string;
    token?: string;
  }): Promise<ProjectFile[]> {
    const params = new URLSearchParams({
      requester_id: payload.requesterId,
      requester_company_id: payload.requesterCompanyId,
    });

    const files = await apiFetch<BackendFile[]>(
      `/projects/${payload.projectId}/files?${params.toString()}`,
      { token: payload.token }
    );

    return (files || []).map(mapBackendFile);
  }

  static async upload(payload: {
    file: File;
    projectId: string;
    companyId: string;
    uploadedBy: string;
    visibility?: string;
    token?: string;
  }): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("project_id", payload.projectId);
    formData.append("company_id", payload.companyId);
    formData.append("uploaded_by", payload.uploadedBy);

    if (payload.visibility) {
      formData.append("visibility", payload.visibility);
    }

    const file = await apiFetch<BackendFile>("/files/upload", {
      method: "POST",
      token: payload.token,
      body: formData,
    });

    return mapBackendFile(file);
  }

  static async downloadFile(fileId: string, companyId: string, token: string): Promise<Blob> {
    const params = new URLSearchParams({
      requester_company_id: companyId,
    });

    return fetchBlob(`${API_BASE_URL}/files/${fileId}/download?${params.toString()}`, token);
  }

  static async downloadFileByReference(
    storageKey?: string,
    fileUrl?: string,
    fileName?: string,
    companyId?: string,
    token?: string
  ): Promise<Blob> {
    const resolvedStorageKey = (storageKey || "").trim() || extractStorageKeyFromUrl(fileUrl);

    if (!resolvedStorageKey) {
      throw new Error("storageKey is required to download the file.");
    }

    const params = new URLSearchParams({
      storage_key: resolvedStorageKey,
      requester_company_id: companyId || "",
    });

    if (fileName) {
      params.set("file_name", fileName);
    }

    return fetchBlob(`${API_BASE_URL}/files/download?${params.toString()}`, token);
  }
}

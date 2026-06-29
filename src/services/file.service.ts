import { apiFetch, API_BASE_URL } from "@/lib/api";
import type { BackendFile, ProjectFile } from "@/types/file";

export type UploadProgressItem = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: "queued" | "uploading" | "completed" | "error";
  progress: number;
  previewUrl?: string;
  error?: string;
};

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

async function fetchBlob(url: string, token?: string, onProgress?: (progress: number) => void): Promise<Blob> {
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

  if (!onProgress || !res.body) {
    return res.blob();
  }

  const contentLength = Number(res.headers.get("content-length") || "0");
  const reader = res.body.getReader();
  const chunks: Array<Uint8Array> = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      chunks.push(value as Uint8Array);
      received += value.length;
      if (contentLength > 0) {
        onProgress(Math.round((received / contentLength) * 100));
      }
    }
  }

  return new Blob(chunks as BlobPart[]);
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
    onProgress?: (progress: number) => void;
  }): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("project_id", payload.projectId);
    formData.append("company_id", payload.companyId);
    formData.append("uploaded_by", payload.uploadedBy);

    if (payload.visibility) {
      formData.append("visibility", payload.visibility);
    }

    const xhr = new XMLHttpRequest();
    const file = await new Promise<BackendFile>((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && payload.onProgress) {
          payload.onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText) as { data?: BackendFile; error?: { message?: string } };
            if (response.data) {
              resolve(response.data);
              return;
            }
            reject(new Error(response.error?.message || "Upload failed"));
          } catch {
            reject(new Error("Upload response could not be parsed"));
          }
        } else {
          reject(new Error(xhr.responseText || `Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
      xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

      xhr.open("POST", `${API_BASE_URL}/files/upload`);
      if (payload.token) {
        xhr.setRequestHeader("Authorization", `Bearer ${payload.token}`);
      }
      xhr.send(formData);
    });

    return mapBackendFile(file);
  }

  static async uploadMultipart(payload: {
    file: File;
    projectId: string;
    companyId: string;
    uploadedBy: string;
    visibility?: string;
    token?: string;
    onProgress?: (progress: number) => void;
  }): Promise<ProjectFile> {
    const initResponse = await apiFetch<{ storage_key: string; upload_id: string; file_name: string; file_type: string; file_size: number }>(
      "/files/multipart/init",
      {
        method: "POST",
        token: payload.token,
        body: JSON.stringify({
          project_id: payload.projectId,
          company_id: payload.companyId,
          uploaded_by: payload.uploadedBy,
          file_name: payload.file.name,
          file_type: payload.file.type || "application/octet-stream",
          file_size: payload.file.size,
        }),
      }
    );

    const partSize = 5 * 1024 * 1024;
    const totalParts = Math.ceil(payload.file.size / partSize);
    const parts: Array<{ part_number: number; etag: string }> = [];

    for (let index = 0; index < totalParts; index += 1) {
      const start = index * partSize;
      const end = Math.min(start + partSize, payload.file.size);
      const blob = payload.file.slice(start, end);
      const partNumber = index + 1;

      const partUrlResponse = await apiFetch<{ url: string }>("/files/multipart/part-url", {
        method: "POST",
        token: payload.token,
        body: JSON.stringify({
          storage_key: initResponse.storage_key,
          upload_id: initResponse.upload_id,
          part_number: partNumber,
        }),
      });

      const uploadPartResponse = await fetch(partUrlResponse.url, {
        method: "PUT",
        body: blob,
      });

      if (!uploadPartResponse.ok) {
        throw new Error(`Échec de l’upload de la partie ${partNumber}`);
      }

      const etag = uploadPartResponse.headers.get("etag") || "";
      if (!etag) {
        throw new Error(`ETag manquant pour la partie ${partNumber}`);
      }
      parts.push({ part_number: partNumber, etag });

      const progress = Math.round(((index + 1) / totalParts) * 100);
      payload.onProgress?.(progress);
    }

    const completed = await apiFetch<BackendFile>("/files/multipart/complete", {
      method: "POST",
      token: payload.token,
      body: JSON.stringify({
        project_id: payload.projectId,
        company_id: payload.companyId,
        uploaded_by: payload.uploadedBy,
        file_name: payload.file.name,
        file_type: payload.file.type || "application/octet-stream",
        file_size: payload.file.size,
        storage_key: initResponse.storage_key,
        upload_id: initResponse.upload_id,
        visibility: payload.visibility || "PRIVATE",
        parts,
      }),
    });

    return mapBackendFile(completed);
  }

  static async getDownloadUrl(fileId: string, companyId?: string, token?: string): Promise<string> {
    const params = new URLSearchParams();
    if (companyId) {
      params.set("requester_company_id", companyId);
    }

    const response = await apiFetch<{ download_url: string }>(
      `/files/${fileId}/download?${params.toString()}`,
      {
        method: "GET",
        token,
      }
    );

    return response.download_url;
  }

  static async downloadFile(fileId: string, companyId?: string, token?: string): Promise<Blob> {
    const downloadUrl = await this.getDownloadUrl(fileId, companyId, token);
    return fetchBlob(downloadUrl);
  }

  static async getDownloadUrlByReference(
    storageKey?: string,
    fileUrl?: string,
    fileName?: string,
    companyId?: string,
    token?: string,
  ): Promise<string> {
    const resolvedStorageKey = (storageKey || "").trim() || extractStorageKeyFromUrl(fileUrl);

    if (!resolvedStorageKey) {
      throw new Error("storageKey is required to download the file.");
    }

    const params = new URLSearchParams({
      storage_key: resolvedStorageKey,
    });

    if (companyId) {
      params.set("requester_company_id", companyId);
    }

    if (fileName) {
      params.set("file_name", fileName);
    }

    const response = await apiFetch<{ download_url: string }>(
      `/files/download?${params.toString()}`,
      {
        method: "GET",
        token,
      }
    );

    return response.download_url;
  }

  static async downloadFileByReference(
    storageKey?: string,
    fileUrl?: string,
    fileName?: string,
    companyId?: string,
    token?: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const downloadUrl = await this.getDownloadUrlByReference(storageKey, fileUrl, fileName, companyId, token);
    return fetchBlob(downloadUrl, undefined, onProgress);
  }
}

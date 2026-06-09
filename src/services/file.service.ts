import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api";
import type { BackendFile, ProjectFile } from "@/types/file";

type UploadFilePayload = {
  file: File;
  projectId: string;
  companyId: string;
  uploadedBy: string;
  visibility?: string;
  token?: string;
};

type ListFilesByProjectParams = {
  projectId: string;
  requesterId: string;
  requesterCompanyId: string;
  token?: string;
};

type DownloadUrlResponse = {
  download_url: string;
};

export function mapBackendFile(file: BackendFile): ProjectFile {
  return {
    id: file._id || file.id || "",
    fileName: file.file_name,
    fileType: file.file_type,
    fileSize: file.file_size,
    storageKey: file.storage_key,
    downloadUrl: file.download_url || file.storage_key,
    projectId: file.project_id,
    companyId: file.company_id,
    uploadedBy: file.uploaded_by,
    visibility: file.visibility,
    version: file.version,
    createdAt: file.created_at,
    updatedAt: file.updated_at,
  };
}

export class FileService {
  // Télécharge un nouveau fichier
  static async upload(payload: UploadFilePayload): Promise<ProjectFile> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("project_id", payload.projectId);
    formData.append("company_id", payload.companyId);
    formData.append("uploaded_by", payload.uploadedBy);
    formData.append("visibility", payload.visibility || "PRIVATE");

    const file = await apiFetch<BackendFile>("/files/upload", {
      method: "POST",
      token: payload.token,
      body: formData,
    });

    return mapBackendFile(file);
  }

  static async getDownloadUrl(fileId: string, companyId: string): Promise<string> {
    const params = new URLSearchParams({ requester_company_id: companyId });
    return `/files/${fileId}/download?${params.toString()}`;
  }

  static async downloadFile(fileId: string, companyId: string, token?: string): Promise<Blob> {
    const params = new URLSearchParams({ requester_company_id: companyId });
    const url = `${API_BASE_URL}/files/${fileId}/download?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur lors du téléchargement : ${response.status} ${text}`);
    }

    return response.blob();
  }

  static async downloadFileByStorageKey(
    storageKey: string,
    fileName: string,
    companyId: string,
    token?: string,
  ): Promise<Blob> {
    const params = new URLSearchParams({
      storage_key: storageKey,
      requester_company_id: companyId,
      file_name: fileName,
    });
    const url = `${API_BASE_URL}/files/download?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur lors du téléchargement : ${response.status} ${text}`);
    }

    return response.blob();
  }

  // Récupère la liste des fichiers pour un projet donné
  // Cette méthode permet d'obtenir tous les fichiers associés à un projet spécifique.
  // Elle est utilisée pour afficher les documents, plans, etc., liés à un projet.
  static async listByProject({
    projectId,
    requesterId,
    requesterCompanyId,
    token,
  }: ListFilesByProjectParams): Promise<ProjectFile[]> {
    const params = new URLSearchParams({
      requester_id: requesterId,
      requester_company_id: requesterCompanyId,
    });

    const files = await apiFetch<BackendFile[]>(`/projects/${projectId}/files?${params.toString()}`, { token });
    return files.map(mapBackendFile);
  }
}

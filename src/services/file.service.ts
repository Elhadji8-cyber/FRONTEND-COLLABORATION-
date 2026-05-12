import { apiFetch } from "@/lib/api";
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

export function mapBackendFile(file: BackendFile): ProjectFile {
  return {
    id: file._id || file.id || "",
    fileName: file.file_name,
    fileType: file.file_type,
    fileSize: file.file_size,
    storageKey: file.storage_key,
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

import { apiFetch } from "@/lib/api";
import type {
  BackendFileVersion,
  BackendPyw,
  BackendPywStatus,
  FileVersion,
  Pyw,
  PywStatus,
} from "@/types/pyw";
import { mapBackendFileVersion as mapBackendFileVersionFromService } from "@/services/file-version.service";

const CARD_PALETTES = [
  { background: "#f5e8ff", color: "#5b21b6" },
  { background: "#ede9fe", color: "#4338ca" },
  { background: "#eff6ff", color: "#1d4ed8" },
  { background: "#fef9c3", color: "#92400e" },
  { background: "#f8fafc", color: "#334155" },
  { background: "#f9fafb", color: "#1f2937" },
];

export function mapBackendStatus(status: string): PywStatus {
  if (status === "modification_requested") return "modified";
  if (status === "approved" || status === "rejected" || status === "modified") {
    return status;
  }
  return "pending";
}

export function mapUiStatusToApi(status: Exclude<PywStatus, "pending">): BackendPywStatus {
  if (status === "modified") return "modification_requested";
  return status;
}

export function mapBackendPyw(pyw: BackendPyw, index = 0): Pyw {
  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  return {
    id: pyw._id || pyw.id || "",
    projectId: pyw.project_id,
    userId: pyw.user_id,
    title: pyw.title,
    description: pyw.description,
    filesUrl: pyw.files_url,
    status: mapBackendStatus(pyw.status),
    ownerComment: pyw.owner_comment,
    createdAt: pyw.created_at,
    updatedAt: pyw.updated_at,
    background: palette.background,
    color: palette.color,
  };
}

export function mapBackendFileVersion(version: BackendFileVersion): FileVersion {
  return mapBackendFileVersionFromService(version);
}

export type PywDetailResponse = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: string;
  owner_comment?: string;
  files?: Array<{
    fileId: string;
    fileName: string;
    fileURL: string;
    fileSize: number;
    currentVersion: number;
  }>;
};

export async function getPywDetail(pywId: string): Promise<PywDetailResponse> {
  const pyw = await apiFetch<BackendPyw>(`/pyw/${pywId}`);
  return {
    id: pyw._id || pyw.id || "",
    project_id: pyw.project_id,
    title: pyw.title,
    description: pyw.description,
    status: pyw.status,
    owner_comment: pyw.owner_comment,
    files: pyw.files?.map((file) => ({
      fileId: file.file_id,
      fileName: file.file_name,
      fileURL: file.file_url,
      fileSize: file.file_size,
      currentVersion: file.current_version,
    })) || [],
  };
}

export function formatPywDate(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export class PywService {
  static async listByProject(projectId: string): Promise<Pyw[]> {
    const works = await apiFetch<BackendPyw[]>(`/projects/${projectId}/pyw`);
    return (works || []).map((work, index) => mapBackendPyw(work, index));
  }

  static async getById(pywId: string): Promise<Pyw> {
    const work = await apiFetch<BackendPyw>(`/pyw/${pywId}`);
    return mapBackendPyw(work);
  }

  static async getDetail(pywId: string): Promise<PywDetailResponse> {
    const pyw = await apiFetch<BackendPyw>(`/pyw/${pywId}`);
    return {
      id: pyw._id || pyw.id || "",
      project_id: pyw.project_id,
      title: pyw.title,
      description: pyw.description,
      status: pyw.status,
      owner_comment: pyw.owner_comment,
      files: pyw.files?.map((file) => ({
        fileId: file.file_id,
        fileName: file.file_name,
        fileURL: file.file_url,
        fileSize: file.file_size,
        currentVersion: file.current_version,
      })) || [],
    };
  }

  static async create(payload: {
    projectId: string;
    title: string;
    description?: string;
    filesUrl?: string;
  }): Promise<string> {
    const response = await apiFetch<{ pyw_id?: string; message?: string }>("/pyw/", {
      method: "POST",
      body: JSON.stringify({
        project_id: payload.projectId,
        title: payload.title,
        description: payload.description,
        files_url: payload.filesUrl,
      }),
    });

    return response.pyw_id || "";
  }

  static async review(
    pywId: string,
    status: Exclude<PywStatus, "pending">,
    ownerComment = "",
  ): Promise<void> {
    await apiFetch<{ message?: string }>(`/pyw/${pywId}/review`, {
      method: "PATCH",
      body: JSON.stringify({
        status: mapUiStatusToApi(status),
        owner_comment: ownerComment,
      }),
    });
  }

  static async getVersionHistory(pywId: string): Promise<FileVersion[]> {
    const response = await apiFetch<BackendFileVersion[]>(`/pyw/${pywId}/versions`);
    return (response || []).map(mapBackendFileVersion);
  }

  static async submitVersion(
    pywId: string,
    fileUrl: string,
    message?: string,
    storageKey?: string,
  ): Promise<void> {
    await apiFetch<{ message?: string }>(`/pyw/${pywId}/versions`, {
      method: "POST",
      body: JSON.stringify({
        file_url: fileUrl,
        storage_key: storageKey || "",
        message,
      }),
    });
  }

  static async submitVersionWithFile(
    pywId: string,
    file: File,
    message?: string,
    storageKey?: string,
    token?: string,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    if (message) {
      formData.append("message", message);
    }
    if (storageKey) {
      formData.append("storage_key", storageKey);
    }

    await apiFetch<{ message?: string }>(`/pyw/${pywId}/versions`, {
      method: "POST",
      token,
      body: formData,
    });
  }

  static async delete(pywId: string, token?: string): Promise<void> {
    await apiFetch<void>(`/pyw/${pywId}`, {
      method: "DELETE",
      token,
    });
  }
}

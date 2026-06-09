import { apiFetch } from "@/lib/api";
import type { BackendFileVersion, FileVersion } from "@/types/pyw";

/**
 * Mappe une FileVersion du backend vers frontend
 */
export function mapBackendFileVersion(version: BackendFileVersion): FileVersion {
  return {
    id: version._id || version.id || "",
    pywId: version.pyw_id,
    userId: version.user_id,
    versionNumber: version.version,
    versionName: version.version_name,
    companyId: version.company_id,
    changeNote: version.change_note || version.message || "",
    fileType: version.file_type,
    fileSize: version.file_size,
    fileUrl: version.file_url,
    storageKey: version.storage_key,
    uploadedBy: version.uploaded_by,
    createdAt: version.created_at,
    updatedAt: version.updated_at,
    isDeleted: version.is_deleted || false,
    deletedAt: version.deleted_at || null,
  };
}

/**
 * Formate la date pour affichage lisible
 */
export function formatVersionDate(iso: string): string {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/**
 * Formate la taille de fichier en unité lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Compare deux versions pour détecter les changements
 */
export function compareVersions(v1: FileVersion, v2: FileVersion): {
  isNewer: boolean;
  changes: string[];
  sizeDiff: number;
} {
  const changes: string[] = [];
  const sizeDiff = v2.fileSize - v1.fileSize;

  if (v1.fileType !== v2.fileType) {
    changes.push(`Type: ${v1.fileType} → ${v2.fileType}`);
  }

  if (v1.fileSize !== v2.fileSize) {
    const sizeChange = sizeDiff > 0 ? "+" : "";
    changes.push(`Taille: ${sizeChange}${formatFileSize(sizeDiff)}`);
  }

  const date1 = new Date(v1.createdAt).getTime();
  const date2 = new Date(v2.createdAt).getTime();

  return {
    isNewer: date2 > date1,
    changes,
    sizeDiff,
  };
}

export class FileVersionService {
  /**
   * Récupère l'historique complet des versions d'un PYW
   */
  static async getVersionHistory(pywId: string, token?: string): Promise<FileVersion[]> {
    const versions = await apiFetch<BackendFileVersion[]>(
      `/pyw/${pywId}/versions`,
      { token }
    );
    return (versions || [])
      .map(mapBackendFileVersion)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Récupère les détails d'une version spécifique
   */
  static async getVersionDetail(
    pywId: string,
    versionId: string,
    token?: string
  ): Promise<FileVersion> {
    const version = await apiFetch<BackendFileVersion>(
      `/pyw/${pywId}/versions/${versionId}`,
      { token }
    );
    return mapBackendFileVersion(version);
  }

  /**
   * Soumet une nouvelle version
   */
  static async submitVersion(
    pywId: string,
    fileUrl: string,
    message: string = "",
    token?: string
  ): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/pyw/${pywId}/versions`, {
      method: "POST",
      token,
      body: JSON.stringify({
        file_url: fileUrl,
        message: message,
      }),
    });
  }

  /**
   * Récupère la liste des versions avec métadonnées enrichies
   */
  static async getVersionsWithComparison(
    pywId: string,
    token?: string
  ): Promise<
    Array<
      FileVersion & {
        displayDate: string;
        displaySize: string;
        changesSince?: { isNewer: boolean; changes: string[] };
      }
    >
  > {
    const versions = await this.getVersionHistory(pywId, token);

    return versions.map((version, index) => {
      const displayDate = formatVersionDate(version.createdAt);
      const displaySize = formatFileSize(version.fileSize);
      const changesSince =
        index < versions.length - 1 ? compareVersions(versions[index + 1], version) : undefined;

      return {
        ...version,
        displayDate,
        displaySize,
        changesSince,
      };
    });
  }

  /**
   * Retourne la dernière version (version courante)
   */
  static async getLatestVersion(pywId: string, token?: string): Promise<FileVersion | null> {
    const versions = await this.getVersionHistory(pywId, token);
    return versions.length > 0 ? versions[0] : null;
  }

  /**
   * Détecte si un fichier est téléchargeable
   */
  static canDownload(version: FileVersion): boolean {
    return !!version.fileUrl && !!version.storageKey && !version.isDeleted;
  }
}

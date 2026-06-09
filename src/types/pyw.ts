export type BackendPywStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "modification_requested";

export type PywStatus = "pending" | "approved" | "rejected" | "modified";

export interface BackendPyw {
  _id?: string;
  id?: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  files?: BackendWorkFile[];
  files_url?: string;
  status: BackendPywStatus | string;
  owner_comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackendWorkFile {
  file_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  status: string;
  current_version: number;
}

export interface Pyw {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  filesUrl?: string;
  status: PywStatus;
  ownerComment?: string;
  createdAt?: string;
  updatedAt?: string;
  background: string;
  color: string;
}

export interface BackendFileVersion {
  _id?: string;
  id?: string;
  pyw_id: string;
  user_id: string;
  version: number;
  version_name: string;
  company_id: string;
  change_note?: string;
  file_type: string;
  file_size: number;
  file_url: string;
  storage_key: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
  message?: string;
}

export interface FileVersion {
  id: string;
  pywId: string;
  userId: string;
  versionNumber: number;
  versionName: string;
  companyId: string;
  changeNote: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storageKey: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  message?: string;
}

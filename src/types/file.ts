export interface ProjectFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey?: string;
  downloadUrl?: string;
  projectId: string;
  companyId: string;
  uploadedBy: string;
  visibility?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendFile {
  _id?: string;
  id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_key?: string;
  download_url?: string;
  project_id: string;
  company_id: string;
  uploaded_by: string;
  visibility?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

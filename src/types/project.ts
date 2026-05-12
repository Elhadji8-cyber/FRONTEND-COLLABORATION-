export interface ProjectMember {
  userId: string;
  role: string;
  addedAt?: string;
  addedBy?: string;
}

export interface Project {
  id: string;
  projectName: string;
  companyId: string;
  description?: string;
  members?: ProjectMember[];
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendProjectMember {
  user_id: string;
  role: string;
  added_at?: string;
  added_by?: string;
}

export interface BackendProject {
  _id?: string;
  id?: string;
  project_name: string;
  company_id: string;
  description?: string;
  members?: BackendProjectMember[];
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

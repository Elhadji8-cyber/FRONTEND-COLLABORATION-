export interface CompanyMember {
  userId: string;
  role: string;
  addedAt?: string;
  addedBy?: string;
  isActive?: boolean;
}

export interface Company {
  id: string;
  companyName: string;
  description?: string;
  ownerId: string;
  members?: CompanyMember[];
  subscriptionPlan?: string;
  storageLimit?: number;
  storageUsed?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCompanyMember {
  user_id: string;
  role: string;
  added_at?: string;
  added_by?: string;
  is_active?: boolean;
}

export interface BackendCompany {
  _id?: string;
  id?: string;
  company_name: string;
  description?: string;
  owner_id: string;
  members?: BackendCompanyMember[];
  subscription_plan?: string;
  storage_limit?: number;
  storage_used?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationMember {
  userId: string;
  role: string;
  addedBy?: string;
  addedAt?: string;
  isActive?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  type: string;
  members: ConversationMember[];
  projectId?: string;
  companyId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendConversationMember {
  user_id: string;
  role: string;
  added_by?: string;
  added_at?: string;
  is_active?: boolean;
}

export interface BackendConversation {
  _id?: string;
  id?: string;
  title: string;
  type: string;
  members: BackendConversationMember[];
  project_id?: string;
  company_id: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

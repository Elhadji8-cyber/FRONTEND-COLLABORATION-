// src/types/message.ts

export interface BackendMessage {
  _id?: string;
  id?: string;
  conversation_id: string;
  sender_id: string;
  company_id: string;
  content: string;
  sender_name?: string; // Ajouté pour correspondre au backend Go
  sender_avatar?: string; // Ajouté pour correspondre au backend Go
  type: string;
  file_id?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  companyId: string;
  content: string;
  senderName?: string; // Ajouté pour le frontend
  senderAvatar?: string; // Ajouté pour le frontend
  type: string;
  fileId?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  senderCompanyId: string;
  content: string;
  fileId?: string;
}
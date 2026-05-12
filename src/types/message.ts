export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  companyId: string;
  content: string;
  senderName?: string;
  senderAvatar?: string;
  type?: string;
  fileId?: string | null;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface BackendMessage {
  _id?: string;
  id?: string;
  conversation_id: string;
  sender_id: string;
  company_id: string;
  content: string;
  sender_name?: string;
  sender_avatar?: string;
  type?: string;
  file_id?: string | null;
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  senderCompanyId: string;
  content: string;
  fileId?: string | null;
}

export interface SendMessageWithFilePayload {
  conversationId: string;
  senderId: string;
  senderCompanyId: string;
  content?: string;
  file: File;
}

export type MessageSocketEvent =
  | {
      type: "joined" | "left";
      conversation_id: string;
    }
  | {
      type: "message";
      conversation_id: string;
      data: BackendMessage;
    }
  | {
      type: "error";
      error: {
        code?: string;
        message: string;
      };
    };

import { apiFetch } from "@/lib/api";
import type {
  BackendMessage,
  Message,
  SendMessagePayload,
  SendMessageWithFilePayload,
} from "@/types/message";

type GetMessagesParams = {
  conversationId: string;
  requesterId: string;
  requesterCompanyId: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

// Le backend Go utilise des noms JSON en snake_case.
// Le frontend React utilise des noms plus naturels en camelCase.
// Cette fonction fait la traduction entre les deux mondes.
export function mapBackendMessage(message: BackendMessage): Message {
  return {
    id: message._id || message.id || "",
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    companyId: message.company_id,
    content: message.content,
    type: message.type,
    senderName: message.sender_name, // Mappage du nom de l'expéditeur
    senderAvatar: message.sender_avatar, // Mappage de l'avatar de l'expéditeur
    fileId: message.file_id,
    createdAt: message.created_at,
    updatedAt: message.updated_at,
    isDeleted: message.is_deleted,
  };
}

// Ce service contient seulement les appels HTTP lies aux messages.
// La page React n'a donc pas besoin de connaitre les routes exactes du backend.
export class MessageService {
  static async getByConversation({
    conversationId,
    requesterId,
    requesterCompanyId,
    page = 1,
    limit = 50,
    signal,
  }: GetMessagesParams): Promise<Message[]> {
    // Le controller Go attend requester_id et requester_company_id en query params.
    const params = new URLSearchParams({
      requester_id: requesterId,
      requester_company_id: requesterCompanyId,
      page: String(page),
      limit: String(limit),
    });

    // Route backend:
    // GET /api/v1/conversations/:conversation_id/messages
    const messages = await apiFetch<BackendMessage[]>(
      `/conversations/${conversationId}/messages?${params.toString()}`,
      { signal }
    );

    return messages.map(mapBackendMessage);
  }

  static async send(payload: SendMessagePayload, token?: string): Promise<Message> {
    // Route backend:
    // POST /api/v1/messages/
    // Le token est necessaire parce que cette route est protegee par RequireAuth().
    const message = await apiFetch<BackendMessage>("/messages/", {
      method: "POST",
      token,
      body: JSON.stringify({
        conversation_id: payload.conversationId,
        sender_id: payload.senderId,
        sender_company_id: payload.senderCompanyId,
        content: payload.content,
        file_id: payload.fileId || undefined,
      }),
    });

    return mapBackendMessage(message);
  }

  static async sendWithFile(payload: SendMessageWithFilePayload, token?: string): Promise<Message> {
    // Route backend:
    // POST /api/v1/messages/with-file
    // Nouveau endpoint qui accepte multipart/form-data pour envoyer message + fichier en une requête
    const formData = new FormData();
    formData.append("conversation_id", payload.conversationId);
    formData.append("sender_id", payload.senderId);
    formData.append("sender_company_id", payload.senderCompanyId);
    formData.append("content", payload.content || "");
    formData.append("file", payload.file);

    const message = await apiFetch<BackendMessage>("/messages/with-file", {
      method: "POST",
      token,
      body: formData,
    });

    return mapBackendMessage(message);
  }
}

import { apiFetch } from "@/lib/api";
import type {
  BackendConversation,
  Conversation,
} from "@/types/conversation";

type Requester = {
  requesterId: string;
  requesterCompanyId: string;
};

type CreateConversationPayload = {
  name: string;
  type: string;
  companyId: string;
  projectId: string;
  creatorId: string;
  creatorCompanyId: string;
  members: string[];
  token?: string;
};

export function mapBackendConversation(conversation: BackendConversation): Conversation {
  return {
    id: conversation._id || conversation.id || "",
    title: conversation.title,
    type: conversation.type,
    members: conversation.members.map((member) => ({
      userId: member.user_id,
      role: member.role,
      addedBy: member.added_by,
      addedAt: member.added_at,
      isActive: member.is_active,
    })),
    projectId: conversation.project_id,
    companyId: conversation.company_id,
    createdBy: conversation.created_by,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
}

export class ConversationService {
  static async listByUser(userId: string, requesterCompanyId: string) {
    const params = new URLSearchParams({
      requester_id: userId,
      requester_company_id: requesterCompanyId,
    });
    const conversations = await apiFetch<BackendConversation[]>(
      `/users/${userId}/conversations?${params.toString()}`
    );

    return (conversations || []).map(mapBackendConversation);
  }

  static async listByProject(projectId: string, requesterId: string, requesterCompanyId: string) {
    const params = new URLSearchParams({
      requester_id: requesterId,
      requester_company_id: requesterCompanyId,
    });
    const conversations = await apiFetch<BackendConversation[]>(
      `/projects/${projectId}/conversations?${params.toString()}`
    );

    return (conversations || []).map(mapBackendConversation);
  }

  static async getById(conversationId: string, requester: Requester) {
    const params = new URLSearchParams({
      requester_id: requester.requesterId,
      requester_company_id: requester.requesterCompanyId,
    });
    const conversation = await apiFetch<BackendConversation>(
      `/conversations/${conversationId}?${params.toString()}`
    );

    return mapBackendConversation(conversation);
  }

  static async create(payload: CreateConversationPayload) {
    const conversation = await apiFetch<BackendConversation>("/conversations/", {
      method: "POST",
      token: payload.token,
      body: JSON.stringify({
        name: payload.name,
        type: payload.type,
        company_id: payload.companyId,
        project_id: payload.projectId,
        creator_id: payload.creatorId,
        creator_company_id: payload.creatorCompanyId,
        members: payload.members,
      }),
    });

    return mapBackendConversation(conversation);
  }

  static async delete(conversationId: string, requesterId: string, requesterCompanyId: string, token?: string) {
    const params = new URLSearchParams({
      requester_id: requesterId,
      requester_company_id: requesterCompanyId,
    });
    
    await apiFetch(`/conversations/${conversationId}?${params.toString()}`, {
      method: "DELETE",
      token: token,
    });
  }
}

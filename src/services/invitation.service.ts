import { apiFetch } from "@/lib/api";
import { AuthService } from "@/services/auth.service";
import type { BackendCompany } from "@/types/company";
import type { BackendUser, User } from "@/types/user";

export type InvitationInfo = {
  email: string;
  role: string;
  company_id: string;
  company_name: string;
  expires_at: string;
  user_exists: boolean;
};

type InviteMemberResponse = {
  invitation: {
    _id: string;
    email: string;
    role: string;
    expires_at: string;
  };
  invite_link: string;
};

type SignupWithInvitationResponse = {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
  company_id: string;
};

function mapBackendUser(user: BackendUser): User {
  return {
    id: user._id || user.id || "",
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  };
}

export class InvitationService {
  static async inviteMember(
    companyId: string,
    email: string,
    requesterId: string,
    role = "MEMBER"
  ) {
    return apiFetch<InviteMemberResponse>(`/companies/${companyId}/invitations`, {
      method: "POST",
      body: JSON.stringify({
        email,
        role,
        requester_id: requesterId,
      }),
    });
  }

  static async getInvitation(token: string) {
    return apiFetch<InvitationInfo>(`/invitations/${token}`);
  }

  static async acceptInvitation(token: string, userId: string) {
    return apiFetch<BackendCompany>(`/invitations/${token}/accept`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  }

  static async signupWithInvitation(
    token: string,
    payload: {
      name: string;
      email: string;
      password: string;
      avatarUrl?: string;
    }
  ) {
    const response = await apiFetch<SignupWithInvitationResponse>(
      `/invitations/${token}/signup`,
      {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          avatar_url: payload.avatarUrl || "",
        }),
      }
    );

    AuthService.saveSession({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: mapBackendUser(response.user),
      companyId: response.company_id,
    });

    return response;
  }
}

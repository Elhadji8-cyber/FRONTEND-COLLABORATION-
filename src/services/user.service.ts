import { apiFetch } from "@/lib/api";
import { AuthService } from "@/services/auth.service";
import { mapBackendUser } from "@/services/auth.service";
import type { BackendUser, User } from "@/types/user";

type UpdateUserPayload = {
  name: string;
  email: string;
};

export class UserService {
  static async getById(userId: string): Promise<User> {
    const user = await apiFetch<BackendUser>(`/users/${userId}`, {
      token: AuthService.getAccessToken(),
    });
    return mapBackendUser(user);
  }

  static async updateProfile(userId: string, payload: UpdateUserPayload): Promise<User> {
    const user = await apiFetch<BackendUser>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
      }),
    });

    return mapBackendUser(user);
  }
}

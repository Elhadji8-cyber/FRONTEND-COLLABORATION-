import { apiFetch } from "@/lib/api";
import type {
  AuthSession,
  BackendAuthResponse,
  BackendUser,
  User,
} from "@/types/user";

const ACCESS_TOKEN_KEY = "planify_access_token";
const REFRESH_TOKEN_KEY = "planify_refresh_token";
const USER_KEY = "planify_user";
const COMPANY_ID_KEY = "planify_company_id";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: string;
  avatarUrl?: string;
};

export function mapBackendUser(user: BackendUser): User {
  return {
    id: user._id || user.id || "",
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  };
}

export class AuthService {
  static async login(payload: LoginPayload): Promise<AuthSession> {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const response = await apiFetch<BackendAuthResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        email: normalizedEmail,
      }),
    });

    const session = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: mapBackendUser(response.user),
      companyId: this.getCompanyId(),
    };

    this.saveSession(session);
    return session;
  }

  static async register(payload: RegisterPayload): Promise<User> {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const user = await apiFetch<BackendUser>("/users/signup", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        email: normalizedEmail,
        password: payload.password,
        avatar_url: payload.avatarUrl,
      }),
    });

    return mapBackendUser(user);
  }

  static async forgotPassword(email: string): Promise<void> {
    await apiFetch<void>("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  }

  static async resetPassword(token: string, newPassword: string): Promise<AuthSession> {
    const response = await apiFetch<BackendAuthResponse>("/users/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    });

    const session = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: mapBackendUser(response.user),
      companyId: this.getCompanyId(),
    };

    this.saveSession(session);
    return session;
  }

  static async refreshToken(): Promise<AuthSession | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const response = await apiFetch<BackendAuthResponse>("/users/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const session = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: mapBackendUser(response.user),
      companyId: this.getCompanyId(),
    };

    this.saveSession(session);
    return session;
  }

  static saveSession(session: AuthSession) {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));

    if (session.companyId) {
      localStorage.setItem(COMPANY_ID_KEY, session.companyId);
    }
  }

  static getSession(): AuthSession | null {
    if (typeof window === "undefined") {
      return null;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);

    if (!accessToken || !rawUser) {
      return null;
    }

    return {
      accessToken,
      refreshToken: refreshToken || "",
      user: JSON.parse(rawUser) as User,
      companyId: this.getCompanyId(),
    };
  }

  static getAccessToken() {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
  }

  static getRefreshToken() {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
  }

  static getCompanyId() {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(COMPANY_ID_KEY) || "";
  }

  static setCompanyId(companyId: string) {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(COMPANY_ID_KEY, companyId);
  }

  static logout() {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

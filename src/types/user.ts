export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface BackendUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
  companyId?: string;
}

export interface BackendAuthResponse {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

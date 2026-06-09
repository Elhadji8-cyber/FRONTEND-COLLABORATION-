import { env } from "@/config/env";
import type { ApiResponse } from "@/types/api";
import type { BackendAuthResponse, BackendUser, User } from "@/types/user";

export const API_BASE_URL = env.apiBaseUrl;

const ACCESS_TOKEN_KEY = "planify_access_token";
const REFRESH_TOKEN_KEY = "planify_refresh_token";
const USER_KEY = "planify_user";
const COMPANY_ID_KEY = "planify_company_id";

type ApiFetchOptions = RequestInit & {
  // Token JWT optionnel. Quand il est present, on l'envoie au backend Go.
  token?: string;
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

function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

function getStoredRefreshToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

function saveRefreshedSession(response: BackendAuthResponse) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(mapBackendUser(response.user)));
}

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    return "";
  }

  const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  const payload =
    (await res.json().catch(() => null)) as ApiResponse<BackendAuthResponse> | null;

  if (!res.ok || !payload || !("data" in payload)) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
    return "";
  }

  saveRefreshedSession(payload.data);
  return payload.data.access_token;
}

function shouldRefreshToken(status: number, payload: ApiResponse<unknown> | null) {
  const errorMessage =
    typeof payload?.error === "string"
      ? payload.error
      : payload?.error?.message || payload?.message || "";

  return status === 401 && errorMessage.toLowerCase().includes("token expir");
}

// Fonction centrale pour tous les appels REST vers le backend Go.
// Elle evite de repeter l'URL de base, les headers JSON et la gestion d'erreur.
export async function apiFetch<T>(
  path: string,
  options?: ApiFetchOptions
): Promise<T> {
  const { token, headers, ...fetchOptions } = options || {};
  const authToken = token || getStoredAccessToken();

  // Exemple final appele ici:
  // http://localhost:8080/api/v1 + /messages/
  const isFormData = fetchOptions.body instanceof FormData;

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in your environment.");
  }

  const request = async (bearerToken?: string) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...(headers || {}),
      },
      cache: "no-store",
    });

  let res;
  try {
    res = await request(authToken);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Network request failed to ${API_BASE_URL}${path}: ${message}`);
  }

  // Ton backend renvoie souvent { success, message, data, error }.
  // On lit ce format une seule fois ici pour simplifier les services.
  let payload = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (authToken && shouldRefreshToken(res.status, payload)) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      res = await request(refreshedToken);
      payload = (await res.json().catch(() => null)) as ApiResponse<T> | null;
    }
  }

  if (!res.ok) {
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : payload?.error?.message ||
          payload?.message ||
          `API error: ${res.status}`;
    throw new Error(message);
  }

  // Si le backend enveloppe la reponse dans "data", le frontend recupere
  // directement les donnees utiles.
  if (payload && "data" in payload) {
    return payload.data;
  }

  return payload as T;
}

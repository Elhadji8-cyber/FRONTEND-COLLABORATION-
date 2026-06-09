import { useEffect, useState } from "react";
import { authStore } from "@/store/authStore";
import type { AuthSession } from "@/types/user";

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(authStore.getSession());
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!session?.accessToken;

  return {
    session,
    isAuthenticated,
    isLoading,
    user: session?.user || null,
    userId: session?.user?.id || null,
    companyId: session?.companyId || null,
    token: session?.accessToken || null,
    logout: authStore.logout,
  };
};

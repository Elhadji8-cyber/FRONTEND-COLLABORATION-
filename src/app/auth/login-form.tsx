// src/components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { InvitationService } from "@/services/invitation.service";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // TODO: brancher ici ton backend Go
      // Endpoint conseillé :
      // POST /api/v1/users/login
      //
      // Exemple body:
      // {
      //   email,
      //   password
      // }
      //
      // Exemple:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Email ou mot de passe invalide");
      // }
      //
      // const data = await response.json();
      // localStorage.setItem("access_token", data.access_token);
      // localStorage.setItem("refresh_token", data.refresh_token);

      const session = await AuthService.login({ email, password });

      if (inviteToken) {
        const company = await InvitationService.acceptInvitation(inviteToken, session.user.id);
        const companyId = company._id || company.id || "";
        if (companyId) {
          AuthService.setCompanyId(companyId);
        }
      }

      router.push("/projects");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
        >
          Work Email
        </label>

        <div className="group relative">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@monolith.com"
            className="w-full rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 focus:bg-surface-container-highest focus:ring-0"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
          >
            Password
          </label>

          <button
            type="button"
            className="text-xs font-bold text-primary hover:underline"
            onClick={() => router.push('/auth/forgot-password')}
          >
            Forgot?
          </button>
        </div>

        <div className="group relative">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 focus:bg-surface-container-highest focus:ring-0"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-container px-6 py-4 font-bold text-on-primary shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing In..." : "Sign In to Workspace"}
        </button>
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-outline-variant opacity-30" />
        <span className="mx-4 flex-shrink text-xs font-bold uppercase tracking-widest text-outline">
          Or continue with
        </span>
        <div className="flex-grow border-t border-outline-variant opacity-30" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-surface-container-highest px-6 py-4 font-bold text-on-surface transition-colors hover:bg-surface-container-high"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
    </form>
  );
}

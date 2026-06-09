"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsLoading(true);

    try {
      await AuthService.forgotPassword(email);
      setMessage(
        "Si cet email est enregistré, un lien de réinitialisation vous a été envoyé.",
      );
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

      {message ? (
        <div className="rounded-lg border border-primary/20 bg-primary-container/10 px-4 py-3 text-sm text-on-surface">
          {message}
        </div>
      ) : null}

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
          {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </button>
      </div>

      <div className="pt-2">
        <button
          type="button"
          className="w-full rounded-lg border border-outline-container px-6 py-4 font-bold text-on-surface transition-all duration-200 hover:bg-surface-container-high"
          onClick={() => router.push("/auth/login")}
        >
          Retour à la connexion
        </button>
      </div>
    </form>
  );
}

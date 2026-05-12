// src/components/auth/register-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { InvitationService, type InvitationInfo } from "@/services/invitation.service";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!inviteToken) {
      return;
    }

    InvitationService.getInvitation(inviteToken)
      .then((info) => {
        setInvitation(info);
        setEmail(info.email);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Invitation invalide",
        );
      });
  }, [inviteToken]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: brancher ici ton backend Go
      // 1. POST /api/v1/users/signup
      // 2. Ensuite éventuellement POST /api/v1/companies
      //
      // Selon ton backend actuel, tu peux faire soit :
      // - créer l'utilisateur seulement ici
      // - puis créer la company dans une étape suivante
      //
      // Exemple body signup :
      // {
      //   full_name: fullName,
      //   email,
      //   password,
      //   avatar_url: avatarPreview,
      // }

      if (inviteToken) {
        await InvitationService.signupWithInvitation(inviteToken, {
          name: fullName,
          email,
          password,
          avatarUrl: avatarPreview,
        });

        router.push("/projects");
        return;
      }

      await AuthService.register({
        name: fullName,
        email,
        password,
        role: "OWNER",
        avatarUrl: avatarPreview,
      });

      // Connexion automatique après inscription
      await AuthService.login({
        email,
        password,
      });

      // Rediriger vers la page de création de la compagnie après inscription réussie
      router.push("/create-company");
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
      {invitation ? (
        <div className="rounded-lg border border-primary/20 bg-primary-container/10 px-4 py-3 text-sm text-on-surface">
          Invitation à rejoindre {invitation.company_name}. Ce compte sera rattaché à cette entreprise, sans création d&apos;entreprise.
        </div>
      ) : null}

      {invitation?.user_exists ? (
        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
          Un compte existe déjà pour cet email.{" "}
          <a className="font-bold text-primary hover:underline" href={`/auth/login?invite=${inviteToken}`}>
            Connectez-vous pour accepter l&apos;invitation.
          </a>
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
        >
          Full Name
        </label>
        <div className="group relative">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Carter"
            className="w-full rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 focus:bg-surface-container-highest focus:ring-0"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </div>
      </div>

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
            readOnly={Boolean(invitation)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="avatar"
          className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
        >
          Photo de profil
        </label>
        <label
          htmlFor="avatar"
          className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-outline px-4 py-6 text-center text-sm text-on-surface-variant transition-all duration-200 hover:border-primary hover:bg-surface-container-low"
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="h-28 w-28 rounded-full object-cover"
            />
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl text-primary">
                photo_camera
              </span>
              <span className="font-semibold text-on-surface">Télécharger une photo</span>
              <span className="text-xs text-on-surface-variant">
                JPG, PNG ou GIF — max 5 MB
              </span>
            </>
          )}
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setAvatarPreview("");
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>


      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
        >
          Password
        </label>
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

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
        >
          Confirm Password
        </label>
        <div className="group relative">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 focus:bg-surface-container-highest focus:ring-0"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {isLoading ? "Creating Workspace..." : "Create Account"}
        </button>
      </div>
    </form>
  );
}


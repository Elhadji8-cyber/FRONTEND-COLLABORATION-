"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const session = AuthService.getSession();
    if (!session || !session.user) {
      router.push("/auth/login");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const session = AuthService.getSession();
    if (!session || !session.user) {
      setErrorMessage("Vous devez être connecté pour créer une entreprise.");
      return;
    }

    setIsLoading(true);

    try {
      const company = await CompanyService.create({
        companyName,
        description,
        ownerId: session.user.id,
      });

      AuthService.setCompanyId(company.id);

      // Rediriger vers le dashboard (la page company)
      router.push("/company");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue lors de la création de l'entreprise"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-on-surface lg:flex-row lg:p-0">
      <div className="w-full max-w-md p-8 lg:p-12">
        <div className="mb-12">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary">
            <span className="material-symbols-outlined text-2xl">business</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Créez votre entreprise</h1>
          <p className="text-on-surface-variant">Configurez votre espace de travail pour commencer.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Nom de l&apos;entreprise
            </label>
            <div className="group relative">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Ex: Monolith Engineering"
                className="w-full rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 focus:bg-surface-container-highest focus:ring-0"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Description (Optionnel)
            </label>
            <div className="group relative">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
              <textarea
                id="description"
                name="description"
                placeholder="Description de votre entreprise..."
                className="w-full min-h-[100px] resize-none rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 focus:bg-surface-container-highest focus:ring-0"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
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
              {isLoading ? "Création..." : "Créer l'entreprise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

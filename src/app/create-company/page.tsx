"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
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
        logoUrl: logoUrl || undefined,
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

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setLogoUrl("");
      setLogoPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Veuillez sélectionner un fichier image valide.");
      return;
    }

    setErrorMessage("");
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

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

          <div className="space-y-2">
            <label
              htmlFor="logoFile"
              className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Logo de l&apos;entreprise (image)
            </label>
            <div className="group relative">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-transparent transition-all duration-200 group-focus-within:bg-primary" />
              <input
                id="logoFile"
                name="logoFile"
                type="file"
                accept="image/*"
                className="w-full rounded-none border-none bg-surface-container-low px-4 py-4 text-on-surface placeholder:text-outline transition-all duration-200 file:cursor-pointer file:rounded-none file:border-0 file:bg-surface-container-lowest file:px-3 file:py-2 file:text-sm file:text-on-surface"
                onChange={handleLogoChange}
              />
            </div>
            {logoPreview ? (
              <div className="mt-3 h-24 w-24 overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-lowest">
                <img src={logoPreview} alt="Aperçu du logo" className="h-full w-full object-cover" />
              </div>
            ) : null}
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

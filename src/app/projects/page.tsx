"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../component/layout/app-shell";
import { ProjectCard } from "../component/dashboard/project-card";
import { SectionTitle } from "../component/ui/section-title";
import { Button } from "../component/ui/button";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { CompanyService } from "@/services/company.service";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        async function loadProjects() {
            const session = AuthService.getSession();

            if (!session?.user.id || !session.companyId) {
                setIsLoading(false);
                setError("Connecte-toi et renseigne une company pour charger les projets.");
                return;
            }

            try {
                // On récupère en parallèle les projets et l'entreprise pour vérifier le rôle
                const [data, company] = await Promise.all([
                    ProjectService.listByUser(session.user.id, session.companyId),
                    CompanyService.getById(session.companyId, session.user.id)
                ]);
                
                setProjects(data);
                setIsOwner(company.ownerId === session.user.id);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Impossible de charger les projets."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadProjects();
    }, []);

    return (
        <AppShell>
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <SectionTitle
                    title="Projects"
                    subtitle="Pilotage de tous les projets actifs de l'entreprise."
                    action={
                        <Button onClick={() => window.dispatchEvent(new Event("openProjectModal"))}>
                            <span className="material-symbols-outlined text-base">add</span>
                            New Project
                        </Button>
                    }
                />

                {error ? (
                    <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="py-8 text-center text-sm text-on-surface-variant">
                        Chargement des projets...
                    </div>
                ) : null}

                {!isLoading && projects.length === 0 && !error ? (
                    <div className="py-8 text-center text-sm text-on-surface-variant">
                        Aucun projet trouve pour cet utilisateur.
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <button
                        onClick={() => window.dispatchEvent(new Event("openProjectModal"))}
                        className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant transition-all hover:border-primary hover:bg-surface-container-low hover:text-primary"
                    >
                        <span className="material-symbols-outlined mb-2 text-4xl">add_circle</span>
                        <span className="font-semibold">Créer un nouveau projet</span>
                    </button>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            title={project.projectName}
                            zone={project.status || "Projet"}
                            statusLabel={project.status}
                            progress={project.status === "completed" ? 100 : 0}
                            accent="primary"
                            isOwner={isOwner}
                            onOpen={(id) => {
                                window.location.href = `/projects/${id}/files`;
                            }}
                            onMessage={(id) => {
                                window.location.href = `/projects/${id}/messages`;
                            }}
                            onDelete={async (id) => {
                                if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
                                const session = AuthService.getSession();
                                if (!session || !session.companyId) return;
                                try {
                                    await ProjectService.delete(id, {
                                        requesterId: session.user.id,
                                        requesterCompanyId: session.companyId,
                                    });
                                    setProjects((prev) => prev.filter((p) => p.id !== id));
                                } catch (err) {
                                    alert("Erreur lors de la suppression: " + err);
                                }
                            }}
                            onUpload={async (id, files) => {
                                // Exemple de logique d'upload
                                // const formData = new FormData();
                                // Array.from(files).forEach((f) => formData.append("files", f));
                                // await apiFetch(`/projects/${id}/files`, { method: "POST", body: formData });
                                alert(`${files.length} fichier(s) sélectionné(s) pour le projet ${project.projectName}`);
                            }}
                        />
                    ))}
                </div>
            </div>
        </AppShell>
    );
}


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "../../component/layout/app-shell";
import { ProjectHeader } from "../../component/project/project-header";
import { ProjectOverview } from "../../component/project/project-overview";
import { ProjectSidebar } from "../../component/project/project-sidebar";
import { ProjectService } from "@/services/project.service";
import type { Project } from "@/types/project";

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<Project | null>(null);
    const [projectError, setProjectError] = useState<string>("");
    const [isOwner, setIsOwner] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load current user session from local storage.
    // Dans ce projet, la session est stockée côté client en localStorage.
    const sessionUser = typeof window !== "undefined" ? localStorage.getItem("planify_user") : null;
    const companyId = typeof window !== "undefined" ? localStorage.getItem("planify_company_id") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("planify_access_token") : null;
    const userId = sessionUser ? JSON.parse(sessionUser)?.id : null;

    useEffect(() => {
        async function loadProject() {
            if (!userId || !companyId) {
                setProjectError("Utilisateur ou entreprise non connecté.");
                return;
            }

            try {
                const loadedProject = await ProjectService.getById(projectId, {
                    requesterId: userId,
                    requesterCompanyId: companyId,
                    token: token || undefined,
                });

                setProject(loadedProject);

                // L'utilisateur est propriétaire si son rôle de projet est OWNER.
                setIsOwner(
                    loadedProject.members?.some(
                        (member) => member.userId === userId && member.role === "OWNER"
                    ) ?? false,
                );
            } catch (error) {
                setProjectError(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors du chargement du projet.",
                );
            }
        }

        loadProject();
    }, [projectId, userId, companyId, token]);

    const handleDeleteProject = async () => {
        if (!userId || !companyId) {
            setProjectError("Utilisateur ou entreprise non connecté.");
            return;
        }

        if (!confirm("Voulez-vous vraiment supprimer ce projet ? Cette action est définitive.")) {
            return;
        }

        setIsDeleting(true);
        try {
            await ProjectService.delete(projectId, {
                requesterId: userId,
                requesterCompanyId: companyId,
                token: token || undefined,
            });
            router.push("/projects");
        } catch (error) {
            setProjectError(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la suppression du projet.",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const headerData = {
        name: project?.projectName ?? "Chargement du projet...",
        status: project?.status ?? "In Progress",
        updatedAtLabel: project ? "Informations à jour" : "Chargement...",
        description:
            project?.description ||
            "Ce projet contient un grand nombre de fichiers. Utilisez les boutons ci-dessous pour naviguer vers les fichiers, les membres et les messages.",
        teamAvatars: [],
        teamCountLabel: project?.members ? `+${project.members.length}` : undefined,
    };

    const stats = [
        {
            label: "Files",
            value: project ? "Voir fichiers" : "---",
            accent: "primary" as const,
        },
        {
            label: "Members",
            value: project ? String(project.members?.length ?? 0) : "---",
            accent: "tertiary" as const,
        },
        {
            label: "Status",
            value: project?.status ?? "In Progress",
            accent: "secondary" as const,
        },
    ];

    return (
        <AppShell>
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <ProjectHeader
                    project={headerData}
                    onOpenFiles={() => router.push(`/projects/${projectId}/files`)}
                    onOpenMembers={() => router.push(`/projects/${projectId}/members`)}
                    onOpenMessages={() => router.push(`/projects/${projectId}/messages`)}
                />

                {projectError ? (
                    <div className="rounded-lg bg-error-container p-4 text-sm font-medium text-error">
                        {projectError}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <ProjectOverview
                        summary={
                            project?.description ??
                            "Chargement des informations du projet..."
                        }
                        stats={stats}
                        milestones={[]}
                    />

                    <ProjectSidebar
                        projectCode={project?.id ?? "N/A"}
                        companyName={project?.companyId ?? "Entreprise inconnue"}
                        visibility="COMPANY"
                        fileCountLabel={project ? "Voir fichiers" : "---"}
                        memberCountLabel={project ? String(project.members?.length ?? 0) : "---"}
                        members={
                            project?.members?.map((member) => ({
                                id: member.userId,
                                name: member.userId,
                                role: member.role,
                            })) ?? []
                        }
                        onOpenFiles={() => router.push(`/projects/${projectId}/files`)}
                        onOpenMembers={() => router.push(`/projects/${projectId}/members`)}
                        onManageMembers={() => router.push(`/projects/${projectId}/members`)}
                        onUploadFile={() => router.push(`/projects/${projectId}/files`)}
                        onDeleteProject={isOwner ? handleDeleteProject : undefined}
                    />
                </div>
            </div>
        </AppShell>
    );
}


"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { PywFilesSectionService } from "@/services/pyw-files-section.service";
import { FileService } from "@/services/file.service";
import { PywService } from "@/services/pyw.service";
import { UserService } from "@/services/user.service";
import { ConversationService } from "@/services/conversation.service";
import { useProjects } from "@/hooks/useProjects";
import { usePywList, usePywReview, usePywSubmit, usePywDelete } from "@/hooks/usePyw";
import { formatPywDate } from "@/services/pyw.service";
import type { Pyw, FileVersion } from "@/types/pyw";
import { PywCard, type PywCardData, type PywStatus } from "./pyw-card";
import { SubmitPywModal } from "./create_pyw";

function pywToCardData(pyw: Pyw, ownerLabel: string, ownerAvatar: string | undefined, projectName: string): PywCardData {
    return {
        id: pyw.id,
        title: pyw.title,
        owner: ownerLabel,
        avatarUrl: ownerAvatar,
        userId: pyw.userId,
        date: formatPywDate(pyw.createdAt),
        description: pyw.description || "",
        background: pyw.background,
        color: pyw.color,
        status: pyw.status,
        projectName,
    };
}

type PYWOverviewProps = {
    projectId: string;
    projectName: string;
    isOwner: boolean;
    searchTerm?: string;
};

export function PYWOverview({ projectId, projectName, isOwner, searchTerm = "" }: PYWOverviewProps) {
    const [cards, setCards] = useState<PywCardData[]>([]);
    const [openedCardId, setOpenedCardId] = useState<string | null>(null);
    const [versions, setVersions] = useState<FileVersion[]>([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [error, setError] = useState("");
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isDirectMessageSubmitting, setIsDirectMessageSubmitting] = useState(false);

    const { data, isLoading: isLoadingWorks, error: worksError } = usePywList(projectId);
    const works = useMemo(() => data ?? [], [data]);
    const reviewMutation = usePywReview(projectId);
    const deleteMutation = usePywDelete(projectId);
    const submitMutation = usePywSubmit(projectId);

    useEffect(() => {
        let active = true;

        const buildCards = async () => {
            if (!works.length) {
                setCards([]);
                return;
            }

            try {
                const mapped = await Promise.all(
                    works.map(async (work) => {
                        try {
                            const owner = await UserService.getById(work.userId);
                            return pywToCardData(
                                work,
                                owner.name || owner.email || "Membre",
                                owner.avatarUrl,
                                projectName,
                            );
                        } catch {
                            return pywToCardData(work, "Membre", undefined, projectName);
                        }
                    }),
                );

                if (active) {
                    setCards(mapped);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    setError(err instanceof Error ? err.message : "Impossible de charger les PYW.");
                    setCards([]);
                }
            }
        };

        buildCards();

        return () => {
            active = false;
        };
    }, [projectName, works]);

    const pendingCount = useMemo(() => works.filter((w) => w.status === "pending").length, [works]);
    const approvedCount = useMemo(() => works.filter((w) => w.status === "approved").length, [works]);
    const modifiedCount = useMemo(() => works.filter((w) => w.status === "modified").length, [works]);

    const isLoading = isLoadingWorks;
    const isSubmitting = submitMutation.status === "pending" || reviewMutation.status === "pending" || deleteMutation.status === "pending" || isDirectMessageSubmitting;
    const queryError = worksError ? (worksError instanceof Error ? worksError.message : String(worksError)) : "";

    useEffect(() => {
        if (worksError) {
            setError(queryError);
        }
    }, [worksError, queryError]);

    const handleStatusChange = async (id: string, status: Exclude<PywStatus, "pending">) => {
        setError("");
        try {
            await reviewMutation.mutateAsync({ pywId: id, status });

            if (status === "modified" || status === "rejected") {
                const card = cards.find((item) => item.id === id);
                if (card) {
                    PywFilesSectionService.addCard({
                        id: card.id,
                        title: card.title,
                        description: card.description,
                        projectName: card.projectName,
                        owner: card.owner,
                        updatedAt: card.date,
                        status,
                    });
                }
                router.push(`/files`);
                return;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de mettre à jour le statut.");
        }
    };

    const router = useRouter();

    const currentUserId = AuthService.getSession()?.user.id;

    const handleOpen = async (card: PywCardData) => {
        // Navigate to the dedicated PYW detail page so files and actions are handled there
        router.push(`/pyw/${card.id}`);
    };

    const handleDelete = async (cardId: string) => {
        setError("");

        try {
            await deleteMutation.mutateAsync(cardId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de supprimer ce travail.");
        }
    };

    const handleSendDirectMessage = async (card: PywCardData) => {
        const session = AuthService.getSession();
        if (!session?.user.id || !session.companyId || !session.accessToken) {
            setError("Session invalide pour ouvrir le chat.");
            return;
        }

        if (card.userId === session.user.id) {
            setError("Impossible de démarrer un message direct avec vous-même.");
            return;
        }

        setIsDirectMessageSubmitting(true);
        setError("");

        try {
            const conversations = await ConversationService.listByProject(
                projectId,
                session.user.id,
                session.companyId,
            );

            const directConversation = conversations.find((conversation) =>
                conversation.type === "DIRECT" &&
                conversation.members.length === 2 &&
                conversation.members.some((member) => member.userId === session.user.id) &&
                conversation.members.some((member) => member.userId === card.userId),
            );

            const directConversationId = directConversation
                ? directConversation.id
                : (
                    await ConversationService.createOrGetDirectMessage(
                        card.userId,
                        session.user.id,
                        session.companyId,
                        projectId,
                        session.accessToken,
                    )
                ).id;

            router.push(`/projects/${projectId}/messages?conversation_id=${directConversationId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible d'ouvrir le chat direct.");
        } finally {
            setIsDirectMessageSubmitting(false);
        }
    };

    const handleUpload = async (title: string, files: FileList) => {
        if (!projectId || !projectId.trim()) {
            throw new Error("Project inconnu");
        }

        setError("");

        try {
            const pywId = await submitMutation.mutateAsync({
                title,
                description: title,
            });

            const session = AuthService.getSession();
            if (!session?.user.id || !session.companyId) {
                throw new Error("Session manquante");
            }

            for (let i = 0; i < files.length; i++) {
                const uploadedFile = await FileService.upload({
                    file: files[i],
                    projectId,
                    companyId: session.companyId,
                    uploadedBy: session.user.id,
                });

                const fileUrl = uploadedFile.downloadUrl || uploadedFile.storageKey;
                const fileName = uploadedFile.fileName || files[i].name;
                const fileSize = typeof uploadedFile.fileSize === "number" && uploadedFile.fileSize > 0
                    ? uploadedFile.fileSize
                    : files[i].size;
                const fileType = uploadedFile.fileType || files[i].type || "application/octet-stream";

                if (!fileUrl) {
                    throw new Error("Impossible de récupérer l'URL du fichier uploadé.");
                }

                await PywService.submitVersion(
                    pywId,
                    fileUrl,
                    `Upload initial : ${fileName}`,
                    uploadedFile.storageKey,
                    fileName,
                    fileSize,
                    fileType,
                );
            }

            setShowSubmitModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de soumettre le travail.");
            throw err;
        }
    };


    const visibleCards = cards.filter((card) =>
        card.owner.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );

    return (
        <div className="flex flex-col h-full">
            <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-sm w-full flex-1 flex flex-col">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Soumettre votre travail</h2>
                    <p className="mt-2 text-sm text-on-surface-variant">
                        Cliquez sur le bouton pour ouvrir le formulaire et envoyer votre fichier PYW.
                    </p>
                </div>
                <div className="sm:flex sm:items-center sm:justify-end w-full">
                    <button
                        type="button"
                        onClick={() => setShowSubmitModal(true)}
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                        Soumettre un travail
                    </button>
                </div>
            </div>

            {error ? (
                <div className="mb-4 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                    {error}
                </div>
            ) : null}

            <SubmitPywModal
                visible={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onSubmit={handleUpload}
                isSubmitting={isSubmitting}
                error={error}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-blue-100 p-4 text-center text-blue-900 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">En attente</p>
                    <p className="mt-2 text-2xl font-bold">{pendingCount}</p>
                </div>

                <div className="rounded-2xl bg-emerald-100 p-4 text-center text-emerald-900 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">Approuver</p>
                    <p className="mt-2 text-2xl font-bold">{approvedCount}</p>
                </div>

                <div className="rounded-2xl bg-orange-100 p-4 text-center text-orange-900 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">Modifier</p>
                    <p className="mt-2 text-2xl font-bold">{modifiedCount}</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold text-on-surface">Vos soumissions</h3>
                
                {isLoading ? (
                    <p className="py-12 text-center text-sm text-on-surface-variant">Chargement des soumissions...</p>
                ) : cards.length === 0 ? (
                    <p className="py-12 text-center text-sm text-on-surface-variant">
                        Aucune soumission pour ce projet. Les membres peuvent uploader un travail avec le bouton ci-dessus.
                    </p>
                ) : visibleCards.length === 0 ? (
                    <p className="py-12 text-center text-sm text-on-surface-variant">
                        Aucun PYW trouvé pour l'utilisateur recherché.
                    </p>
                ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleCards.map((card) => (
                        <PywCard
                            key={card.id}
                            card={card}
                            isOwner={isOwner}
                            canDelete={isOwner || card.userId === currentUserId}
                            isSubmitting={isSubmitting}
                            isOpen={openedCardId === card.id}
                            versions={openedCardId === card.id ? versions : []}
                            onStatusChange={handleStatusChange}
                            onOpen={handleOpen}
                            onDelete={handleDelete}
                            onSendDirectMessage={handleSendDirectMessage}
                        />
                    ))}
                </div>
            )}
            </div>

            </section>
        </div>
    );
}

export function PYWOverviewWithProjectPicker({ searchTerm = "" }: { searchTerm?: string }) {
    const [isMounted, setIsMounted] = useState(false);
    const { enrichedProjects, projectsQuery, companyQuery } = useProjects();
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const projects = enrichedProjects || [];
    const isLoading = projectsQuery.isLoading || companyQuery.isLoading;
    const error = projectsQuery.error || companyQuery.error;
    const currentUserId = AuthService.getSession()?.user.id;

    const selectedProject = useMemo(
        () => projects.find((project) => project.id === projectId),
        [projectId, projects],
    );

    const isOwner = useMemo(() => {
        if (!currentUserId) return false;
        if (companyQuery.data?.ownerId === currentUserId) {
            return true;
        }
        return (
            selectedProject?.members?.some(
                (member) =>
                    member.userId === currentUserId &&
                    ["OWNER", "ADMIN"].includes(member.role?.toUpperCase() ?? ""),
            ) ?? false
        );
    }, [companyQuery.data?.ownerId, currentUserId, selectedProject]);

    useEffect(() => {
        if (!projects.length) {
            return;
        }

        if (!projectId) {
            setProjectId(projects[0].id);
            setProjectName(projects[0].projectName);
        }
    }, [projectId, projects]);

    if (!isMounted) {
        return <p className="text-sm text-on-surface-variant">Chargement...</p>;
    }

    if (isLoading) {
        return <p className="text-sm text-on-surface-variant">Chargement...</p>;
    }

    if (error) {
        const message = error instanceof Error ? error.message : String(error);
        return <p className="rounded-2xl bg-error-container px-4 py-3 text-sm text-error">{message}</p>;
    }

    if (projects.length === 0) {
        return (
            <p className="rounded-2xl bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
                Crée d&apos;abord un projet pour tester les PYW.
            </p>
        );
    }

    return projectId ? <PYWOverview projectId={projectId} projectName={projectName} isOwner={isOwner} searchTerm={searchTerm} /> : null;
}

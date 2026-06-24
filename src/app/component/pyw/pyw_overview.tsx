"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { ProjectService } from "@/services/project.service";
import { PywFilesSectionService } from "@/services/pyw-files-section.service";
import { PywService, formatPywDate } from "@/services/pyw.service";
import { FileService } from "@/services/file.service";
import { UserService } from "@/services/user.service";
import { ConversationService } from "@/services/conversation.service";
import type { Pyw, FileVersion } from "@/types/pyw";
import type { Project } from "@/types/project";
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
    const [pendingCount, setPendingCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [modifiedCount, setModifiedCount] = useState(0);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const loadWorks = useCallback(async () => {
        if (!projectId) {
            setCards([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const works = await PywService.listByProject(projectId);
            const pending = (works || []).filter((w) => w.status === "pending").length;
            const approved = (works || []).filter((w) => w.status === "approved").length;
            const modified = (works || []).filter((w) => w.status === "modified").length;
            const mapped = await Promise.all(
                works.map(async (work) => {
                    const owner = await UserService.getById(work.userId);
                    return pywToCardData(work, owner.name || owner.email || "Membre", owner.avatarUrl, projectName);
                }),
            );
            setCards(mapped);
            setPendingCount(pending);
            setApprovedCount(approved);
            setModifiedCount(modified);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de charger les PYW.");
            setCards([]);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadWorks();
    }, [loadWorks]);

    const handleStatusChange = async (id: string, status: Exclude<PywStatus, "pending">) => {
        setIsSubmitting(true);
        setError("");
        try {
            await PywService.review(id, status);

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
                setCards((prev) => prev.filter((card) => card.id !== id));
                router.push(`/files`);
                return;
            }

            setCards((prev) => prev.map((card) => (card.id === id ? { ...card, status } : card)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de mettre à jour le statut.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const router = useRouter();

    const handleOpen = async (card: PywCardData) => {
        // Navigate to the dedicated PYW detail page so files and actions are handled there
        router.push(`/pyw/${card.id}`);
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

        setIsSubmitting(true);
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
                    await ConversationService.create({
                        name: "",
                        type: "DIRECT",
                        companyId: session.companyId,
                        projectId,
                        creatorId: session.user.id,
                        creatorCompanyId: session.companyId,
                        members: [session.user.id, card.userId],
                        token: session.accessToken,
                    })
                ).id;

            router.push(`/projects/${projectId}/messages?conversation_id=${directConversationId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible d'ouvrir le chat direct.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpload = async (title: string, files: FileList) => {
        if (!projectId || !projectId.trim()) {
            throw new Error("Project inconnu");
        }

        setIsSubmitting(true);
        setError("");

        try {
            const pywId = await PywService.create({
                projectId,
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
                if (!fileUrl) {
                    throw new Error("Impossible de récupérer l'URL du fichier uploadé.");
                }

                await PywService.submitVersion(pywId, fileUrl, `Upload initial : ${uploadedFile.fileName}`);
            }

            setShowSubmitModal(false);
            await loadWorks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de soumettre le travail.");
            throw err;
        } finally {
            setIsSubmitting(false);
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
                            isSubmitting={isSubmitting}
                            isOpen={openedCardId === card.id}
                            versions={openedCardId === card.id ? versions : []}
                            onStatusChange={handleStatusChange}
                            onOpen={handleOpen}
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function init() {
            const session = AuthService.getSession();
            if (!session?.user.id || !session.companyId) {
                setError("Connecte-toi pour accéder aux PYW.");
                setIsLoading(false);
                return;
            }

            try {
                const [data, company] = await Promise.all([
                    ProjectService.listByUser(session.user.id, session.user.id, session.companyId),
                    CompanyService.getById(session.companyId, session.user.id),
                ]);
                setProjects(data);
                setIsOwner(company.ownerId === session.user.id);
                if (data.length > 0) {
                    setProjectId(data[0].id);
                    setProjectName(data[0].projectName);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Impossible de charger les projets.");
            } finally {
                setIsLoading(false);
            }
        }

        init();
    }, []);

    if (isLoading) {
        return <p className="text-sm text-on-surface-variant">Chargement...</p>;
    }

    if (error) {
        return <p className="rounded-2xl bg-error-container px-4 py-3 text-sm text-error">{error}</p>;
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

"use client";

import { useParams, useRouter } from "next/navigation";
import { useMessages } from "@/hooks/useMessages";
import { useState, useEffect } from "react";
import { CompanyService } from "@/services/company.service";
import { ProjectService } from "@/services/project.service";
import { ConversationService } from "@/services/conversation.service";
import { AppShell } from "../../../component/layout/app-shell";
import { MessageHeader } from "../../../component/messages/message-thread";
import { ChannelsSidebar } from "../../../component/messages/channels-sidebar";
import { MessageInput } from "../../../component/messages/mesage-input";
import { MessageBubble } from "./message-bubble";
import { CreateChannelModal } from "../../../component/messages/create-channel-modal";
import { ClientSideOnly } from "./ClientSideOnly";
import { AuthGuard } from "../../../component/auth-guard";
import { useAuth } from "@/hooks/useAuth";

function formatMessageTime(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function ProjectMessagesPage() {
    const params = useParams();
    const router = useRouter();
    const { userId, companyId, token, isAuthenticated } = useAuth();
    const projectId = params.projectId as string;

    const [projectName, setProjectName] = useState<string>("");
    const [isOwner, setIsOwner] = useState(false);
    const [canCreateChannel, setCanCreateChannel] = useState(false);
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
    const [noProjectError, setNoProjectError] = useState("");
    const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string>("");

    useEffect(() => {
        async function loadProjectData() {
            if (!userId || !companyId || projectId === "alpha") {
                return;
            }

            try {
                const project = await ProjectService.getById(projectId, {
                    requesterId: userId,
                    requesterCompanyId: companyId,
                    token: token || undefined,
                });

                setProjectName(project.projectName);
                const isProjectMember = project.members?.some(
                    (member) => member.userId === userId,
                );
                setCanCreateChannel(Boolean(isProjectMember));
                setIsOwner(
                    project.members?.some(
                        (member) => member.userId === userId && member.role === "OWNER",
                    ) ?? false,
                );
            } catch (error) {
                console.error("Erreur lors du chargement du projet pour messages:", error);
                setNoProjectError(
                    error instanceof Error ? error.message : "Impossible de charger les informations du projet.",
                );
            }
        }

        loadProjectData();
    }, [projectId, userId, companyId, token]);

    useEffect(() => {
        async function loadConversations() {
            if (userId && companyId && projectId !== "alpha") {
                try {
                    const convs = await ConversationService.listByProject(projectId, userId, companyId);
                    const mappedChannels = convs.map((c) => ({
                        id: c.id,
                        name: c.title || projectName || "general",
                    }));

                    setChannels(mappedChannels);
                    if (mappedChannels.length > 0 && !activeConversationId) {
                        setActiveConversationId(mappedChannels[0].id);
                    }
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
                    console.error("Erreur de chargement des conversations", errorMsg);
                    setNoProjectError(`Erreur lors du chargement des canaux: ${errorMsg}`);
                }
            }
        }

        loadConversations();
    }, [userId, companyId, projectId]);

    const {
        messages,
        isLoading,
        isSending,
        isRealtimeConnected,
        error,
        sendMessage,
    } = useMessages({
        conversationId: activeConversationId,
        userId: userId || "",
        companyId: companyId || "",
        token: token || "",
    });

    useEffect(() => {
        async function fetchFirstProject() {
            if (projectId === "alpha" && userId && companyId) {
                try {
                    const projs = await ProjectService.listByUser(userId, companyId);
                    if (projs.length > 0) {
                        router.push(`/projects/${projs[0].id}/messages`);
                    } else {
                        setNoProjectError("Vous devez d'abord créer un projet pour y ajouter des conversations.");
                    }
                } catch (err) {
                    console.error("Erreur récupération projet:", err);
                }
            }
        }
        fetchFirstProject();
    }, [projectId, userId, companyId, router]);

    const handleDeleteChannel = async (channelId: string) => {
        if (!userId || !companyId || !token) return;
        if (!confirm("Voulez-vous vraiment supprimer ce canal ?")) return;

        try {
            await ConversationService.delete(channelId, userId, companyId, token);
            setChannels((prev) => prev.filter((c) => c.id !== channelId));
            if (activeConversationId === channelId) {
                setActiveConversationId("");
            }
        } catch (err) {
            console.error("Erreur lors de la suppression du canal", err);
            setNoProjectError("Erreur lors de la suppression du canal");
        }
    };

    return (
        <AuthGuard>
            <AppShell active="messages">
                <div className="flex h-screen overflow-hidden">
                    <ChannelsSidebar
                        channels={channels.map((c) => ({
                            id: c.id,
                            name: c.name,
                            active: c.id === activeConversationId,
                            onClick: () => setActiveConversationId(c.id),
                            onDelete: isOwner ? () => handleDeleteChannel(c.id) : undefined,
                        }))}
                        directMessages={[]}
                        canCreate={canCreateChannel}
                        onAddChannel={() => setIsChannelModalOpen(true)}
                    />

                    <main className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-surface">
                        <MessageHeader
                            title={channels.find((c) => c.id === activeConversationId)?.name ? `# ${channels.find((c) => c.id === activeConversationId)?.name}` : "Aucun canal"}
                            subtitle={
                                isRealtimeConnected
                                    ? "Connecté au chat temps réel."
                                    : "Historique chargé via API REST."
                            }
                        />

                        <div className="m-4 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p>
                                    Projet actif : <span className="font-semibold">{projectName || "Chargement..."}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-outline-variant/10" />
                                <span className="mx-4 flex-shrink text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">
                                    Messages
                                </span>
                                <div className="flex-grow border-t border-outline-variant/10" />
                            </div>

                            {noProjectError ? (
                                <div className="mb-4 rounded-lg bg-error-container px-4 py-3 text-sm font-medium text-error">
                                    {noProjectError}
                                </div>
                            ) : null}

                            {error ? (
                                <div className="mb-4 rounded-lg bg-error-container px-4 py-3 text-sm font-medium text-error">
                                    {error}
                                </div>
                            ) : null}

                            {!activeConversationId && !isLoading ? (
                                <div className="py-8 text-center text-sm text-on-surface-variant">
                                    Créez un canal pour commencer à discuter.
                                </div>
                            ) : null}

                            {activeConversationId && isLoading ? (
                                <div className="py-8 text-center text-sm text-on-surface-variant">
                                    Chargement des messages...
                                </div>
                            ) : null}

                            {!isLoading && messages.length === 0 && activeConversationId ? (
                                <div className="py-8 text-center text-sm text-on-surface-variant">
                                    Aucun message pour cette conversation.
                                </div>
                            ) : null}

                            <div className="space-y-4 ">
                                {messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        id={message.id}
                                        senderName={message.senderName || (message.senderId === userId ? "Moi" : "Utilisateur")}
                                        avatarUrl={message.senderAvatar}
                                        sentAt={formatMessageTime(message.createdAt)}
                                        content={message.content}
                                        fileId={message.fileId}
                                        isOwn={message.senderId === userId}
                                    />
                                ))}
                            </div>
                        </div>
                        <MessageInput
                            isLoading={isSending}
                            onSend={async ({ content, fileId }) => {
                                await sendMessage(content, fileId as File | null | undefined);
                            }}
                        />
                    </main>
                    <CreateChannelModal
                        isOpen={isChannelModalOpen}
                        onClose={() => setIsChannelModalOpen(false)}
                        projectId={projectId}
                    />
                </div>
            </AppShell>
        </AuthGuard>
    );
}

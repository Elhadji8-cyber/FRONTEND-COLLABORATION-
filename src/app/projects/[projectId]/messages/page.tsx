"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMessages } from "@/hooks/useMessages";
import { useState, useEffect } from "react";
import { CompanyService } from "@/services/company.service";
import { ProjectService } from "@/services/project.service";
import { ConversationService } from "@/services/conversation.service";
import { UserService } from "@/services/user.service";
import { AppShell } from "../../../component/layout/app-shell";
import { MessageHeader } from "../../../component/messages/message-thread";
import { ChannelsSidebar } from "../../../component/messages/channels-sidebar";
import { MessageInput } from "../../../component/messages/mesage-input";
import { MessageBubble } from "./message-bubble";
import { CreateChannelModal } from "../../../component/messages/create-channel-modal";
import { ChannelMembersModal } from "../../../component/messages/channel-members-modal";
import { ClientSideOnly } from "./ClientSideOnly";
import { AuthGuard } from "../../../component/auth-guard";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";

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
    const [channels, setChannels] = useState<{
        id: string;
        name: string;
        projectId: string;
        isOwner: boolean;
    }[]>([]);
    const [directMessages, setDirectMessages] = useState<{
        id: string;
        name: string;
        otherUserId?: string;
        avatarUrl?: string;
    }[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string>("");
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [currentChannelMembers, setCurrentChannelMembers] = useState<
        Array<{ id: string; name: string; avatarUrl?: string }>
    >([]);
    const [isCurrentChannelOwner, setIsCurrentChannelOwner] = useState(false);

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

    const searchParams = useSearchParams();

    useEffect(() => {
        async function loadConversations() {
            if (userId && companyId && projectId !== "alpha") {
                try {
                    const userConvs = await ConversationService.listByUser(userId, companyId);

                    const projectChannels = userConvs
                        .filter(
                            (c) =>
                                String(c.type).toUpperCase() !== "DIRECT" &&
                                c.projectId === projectId
                        )
                        .map((c) => ({
                            id: c.id,
                            name: c.title || "Canal de projet",
                            projectId: c.projectId || projectId,
                            isOwner: c.members.some(
                                (member) =>
                                    member.userId === userId &&
                                    String(member.role).toUpperCase() === "OWNER"
                            ),
                        }))
                        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

                    const projectDirects = userConvs
                        .filter((c) => c.projectId === projectId && String(c.type).toUpperCase() === "DIRECT")
                        .map((c) => ({
                            id: c.id,
                            name: c.title || "Message direct",
                            otherUserId: c.members.find((member) => member.userId !== userId)?.userId,
                        }));

                    const directPartnerIds = projectDirects
                        .filter((dm) => dm.otherUserId)
                        .map((dm) => dm.otherUserId as string);

                    const uniquePartnerIds = Array.from(new Set(directPartnerIds));
                    const partnerNames = await Promise.all(
                        uniquePartnerIds.map(async (partnerId) => {
                            try {
                                const user = await UserService.getById(partnerId);
                                return { partnerId, name: user.name, avatarUrl: user.avatarUrl };
                            } catch {
                                return { partnerId, name: "Message direct", avatarUrl: undefined };
                            }
                        }),
                    );

                    const updatedDirectMessages = projectDirects.map((dm) => {
                        if (!dm.otherUserId) {
                            return dm;
                        }
                        const partner = partnerNames.find((item) => item.partnerId === dm.otherUserId);
                        return partner ? { ...dm, name: partner.name, avatarUrl: partner.avatarUrl } : dm;
                    });

                    // Éviter l'affichage en doublon du même utilisateur en direct.
                    const uniqueDirectMessagesMap = updatedDirectMessages.reduce(
                        (map, dm) => {
                            const key = dm.otherUserId || dm.id;
                            if (!map.has(key)) {
                                map.set(key, dm);
                            }
                            return map;
                        },
                        new Map<string, typeof updatedDirectMessages[number]>()
                    );

                    const uniqueDirectMessages = Array.from(uniqueDirectMessagesMap.values());

                    setChannels(projectChannels);
                    setDirectMessages(uniqueDirectMessages);

                    const requestedConversationId = searchParams.get("conversation_id");
                    const hasRequestedInChannels = projectChannels.some((c) => c.id === requestedConversationId);
                    const hasRequestedInDirects = updatedDirectMessages.some((c) => c.id === requestedConversationId);

                    if (requestedConversationId && (hasRequestedInChannels || hasRequestedInDirects)) {
                        setActiveConversationId(requestedConversationId);
                    } else if (!activeConversationId) {
                        if (projectChannels.length > 0) {
                            setActiveConversationId(projectChannels[0].id);
                        } else if (updatedDirectMessages.length > 0) {
                            setActiveConversationId(updatedDirectMessages[0].id);
                        }
                    }
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
                    console.error("Erreur de chargement des conversations", errorMsg);
                    setNoProjectError(`Erreur lors du chargement des canaux: ${errorMsg}`);
                }
            }
        }

        loadConversations();
    }, [userId, companyId, projectId, projectName, searchParams, activeConversationId]);

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
        async function loadChannelMembers() {
            if (!activeConversationId || !userId || !companyId) {
                setCurrentChannelMembers([]);
                return;
            }

            // Vérifier si c'est un message direct (pas besoin de charger les membres)
            const isDirectMessage = directMessages.some(
                (dm) => dm.id === activeConversationId
            );

            if (isDirectMessage) {
                setCurrentChannelMembers([]);
                return;
            }

            try {
                const conversation = await ConversationService.getById(activeConversationId, {
                    requesterId: userId,
                    requesterCompanyId: companyId,
                });

                // Charger les détails des membres
                const memberDetails = await Promise.all(
                    conversation.members.map(async (member) => {
                        try {
                            const user = await UserService.getById(member.userId);
                            return {
                                id: user.id,
                                name: user.name,
                                avatarUrl: user.avatarUrl,
                            };
                        } catch (err) {
                            console.error(`Erreur lors du chargement de l'utilisateur ${member.userId}:`, err);
                            return {
                                id: member.userId,
                                name: "Utilisateur inconnu",
                                avatarUrl: undefined,
                            };
                        }
                    })
                );

                setCurrentChannelMembers(memberDetails);

                // Vérifier si l'utilisateur actuel est propriétaire du canal
                const isOwner = conversation.members.some(
                    (member) => member.userId === userId && member.role === "OWNER"
                );
                setIsCurrentChannelOwner(isOwner);
            } catch (err) {
                console.error("Erreur lors du chargement des membres du canal:", err);
                setCurrentChannelMembers([]);
            }
        }

        loadChannelMembers();
    }, [activeConversationId, userId, companyId, directMessages]);

    useEffect(() => {
        async function fetchFirstProject() {
            if (projectId === "alpha" && userId && companyId) {
                try {
                    const projs = await ProjectService.listByUser(userId, userId, companyId);
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

    const handleDirectMessageWithMember = async (
        otherMemberId: string,
        memberName: string,
        memberAvatarUrl?: string
    ) => {
        if (!userId || !companyId || !projectId) return;

        // Si la conversation directe existe déjà dans la liste, on la réutilise.
        const existingDirectConversation = directMessages.find(
            (dm) => dm.otherUserId === otherMemberId
        );
        if (existingDirectConversation) {
            setActiveConversationId(existingDirectConversation.id);
            return;
        }

        try {
            const directConversation = await ConversationService.createOrGetDirectMessage(
                otherMemberId,
                userId,
                companyId,
                projectId,
                token || undefined
            );

            const existingDM = directMessages.find((dm) => dm.id === directConversation.id);

            if (!existingDM) {
                const newDirectMessage = {
                    id: directConversation.id,
                    name: memberName,
                    otherUserId: otherMemberId,
                    avatarUrl: memberAvatarUrl,
                };
                setDirectMessages((prev) => [newDirectMessage, ...prev]);
            }

            setActiveConversationId(directConversation.id);
        } catch (err) {
            console.error("Erreur lors de la création du message direct:", err);
            setNoProjectError("Erreur lors de l'ouverture de la conversation directe");
        }
    };

    return (
        <AuthGuard>
            <AppShell active="messages">
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                    <ChannelsSidebar
                        channels={channels.map((c) => ({
                            id: c.id,
                            name: c.name,
                            active: c.id === activeConversationId,
                            onClick: () => setActiveConversationId(c.id),
                            onDelete: c.isOwner ? () => handleDeleteChannel(c.id) : undefined,
                        }))}
                        directMessages={directMessages.map((dm) => ({
                            id: dm.id,
                            name: dm.name,
                            active: dm.id === activeConversationId,
                            onClick: () => setActiveConversationId(dm.id),
                            online: true,
                            avatarUrl: dm.avatarUrl,
                        }))}
                        canCreate={canCreateChannel}
                        onAddChannel={() => setIsChannelModalOpen(true)}
                    />

                    <main className="flex flex-1 flex-col bg-surface overflow-hidden">
                        <MessageHeader
                            title={
                                directMessages.some((dm) => dm.id === activeConversationId)
                                    ? `@ ${directMessages.find((dm) => dm.id === activeConversationId)?.name || "Direct"}`
                                    : `# ${channels.find((c) => c.id === activeConversationId)?.name || "Aucun canal"}`
                            }
                            subtitle={
                                isRealtimeConnected
                                    ? "Connecté au chat temps réel."
                                    : "Historique chargé via API REST."
                            }
                            memberAvatars={currentChannelMembers}
                            totalMembersCount={currentChannelMembers.length}
                            onMembersClick={() => {
                                // Afficher la modal seulement si c'est un canal (pas un message direct)
                                if (
                                    !directMessages.some(
                                        (dm) => dm.id === activeConversationId
                                    )
                                ) {
                                    setIsMembersModalOpen(true);
                                }
                            }}
                        />

                        <div className="m-4 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p>
                                    Projet actif : <span className="font-semibold">{projectName || "Chargement..."}</span>
                                </p>
                            </div>
                        </div>

                        <div className="mx-4 mb-4 flex flex-1 flex-col overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container shadow-sm">
                            <div className="border-b border-outline-variant/10 px-6 py-4">
                                <div className="relative flex items-center">
                                    <div className="flex-grow border-t border-outline-variant/10" />
                                    <span className="mx-4 flex-shrink text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">
                                        Messages
                                    </span>
                                    <div className="flex-grow border-t border-outline-variant/10" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pb-4 pt-6 chat-scrollbar">
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

                                <div className="flex flex-col gap-4">
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

                            <div className="border-t border-outline-variant/10 bg-surface px-6 py-4">
                                <MessageInput
                                    isLoading={isSending}
                                    onSend={async ({ content, fileId }) => {
                                        await sendMessage(content, fileId as File | null | undefined);
                                    }}
                                />
                            </div>
                        </div>
                    </main>
                    <CreateChannelModal
                        isOpen={isChannelModalOpen}
                        onClose={() => setIsChannelModalOpen(false)}
                        projectId={projectId}
                    />
                    <ChannelMembersModal
                        isOpen={isMembersModalOpen}
                        onClose={() => setIsMembersModalOpen(false)}
                        conversationId={activeConversationId}
                        currentUserId={userId || ""}
                        companyId={companyId || ""}
                        projectId={projectId}
                        isUserOwner={isCurrentChannelOwner}
                        token={token || undefined}
                        onMemberRemoved={(memberId) => {
                            // Mettre à jour la liste des membres après suppression
                            setCurrentChannelMembers((prev) =>
                                prev.filter((member) => member.id !== memberId)
                            );
                        }}
                        onDirectMessage={(directConversationId, memberId, memberName, memberAvatarUrl) => {
                            // Utiliser la fonction pour gérer correctement la conversation directe
                            handleDirectMessageWithMember(memberId, memberName, memberAvatarUrl);
                        }}
                    />
                </div>
            </AppShell>
        </AuthGuard>
    );
}

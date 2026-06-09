"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/user.service";
import { ConversationService } from "@/services/conversation.service";
import type { User } from "@/types/user";
import type { Conversation } from "@/types/conversation";

interface MemberWithDetails extends User {
  role: string;
  isOwner: boolean;
}

interface ChannelMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  currentUserId: string;
  companyId: string;
  projectId?: string;
  isUserOwner: boolean;
  token?: string;
  onMemberRemoved?: (memberId: string) => void;
  onDirectMessage?: (conversationId: string, userId: string, userName: string, avatarUrl?: string) => void;
}

export function ChannelMembersModal({
  isOpen,
  onClose,
  conversationId,
  currentUserId,
  companyId,
  projectId,
  isUserOwner,
  token,
  onMemberRemoved,
  onDirectMessage,
}: ChannelMembersModalProps) {
  const [members, setMembers] = useState<MemberWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      if (!isOpen || !conversationId) return;

      setIsLoading(true);
      setError("");

      try {
        const conversation = await ConversationService.getById(conversationId, {
          requesterId: currentUserId,
          requesterCompanyId: companyId,
        });

        const memberDetails = await Promise.all(
          conversation.members.map(async (member) => {
            try {
              const user = await UserService.getById(member.userId);
              return {
                ...user,
                role: member.role,
                isOwner: member.role === "OWNER",
              };
            } catch (err) {
              console.error(`Erreur lors du chargement de l'utilisateur ${member.userId}:`, err);
              return {
                id: member.userId,
                name: "Utilisateur inconnu",
                email: "",
                role: member.role,
                isOwner: member.role === "OWNER",
                avatarUrl: undefined,
              } as MemberWithDetails;
            }
          })
        );

        setMembers(memberDetails);
      } catch (err) {
        console.error("Erreur lors du chargement des membres:", err);
        setError(
          err instanceof Error ? err.message : "Impossible de charger les membres du channel"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMembers();
  }, [isOpen, conversationId, currentUserId, companyId]);

  const handleRemoveMember = async (memberId: string) => {
    if (!isUserOwner) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre du channel ?")) return;

    try {
      await ConversationService.removeMember(
        conversationId,
        memberId,
        currentUserId,
        companyId,
        token
      );
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      onMemberRemoved?.(memberId);
    } catch (err) {
      console.error("Erreur lors de la suppression du membre:", err);
      setError("Erreur lors de la suppression du membre");
    }
  };

  const handleDirectMessage = async (member: MemberWithDetails) => {
    if (!projectId) return;
    
    setIsSendingMessage(true);
    try {
      const directConversation = await ConversationService.createOrGetDirectMessage(
        member.id,
        currentUserId,
        companyId,
        projectId,
        token
      );
      
      onDirectMessage?.(directConversation.id, member.id, member.name, member.avatarUrl);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du message direct:", err);
      setError("Impossible de créer la conversation directe");
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-outline-variant/20 bg-surface shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-outline-variant/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-surface">
              Membres du canal ({members.length})
            </h2>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-on-surface-variant">Chargement...</div>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-error-container px-3 py-2 text-sm text-error">
              {error}
            </div>
          ) : members.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-on-surface-variant">Aucun membre</div>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-surface-container-low p-3 hover:bg-surface-container transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar */}
                    <div className="relative h-10 w-10 flex-shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {member.isOwner && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border border-surface">
                          <span className="material-symbols-outlined text-[10px] text-surface">
                            verified
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {member.name}
                        {currentUserId === member.id && " (Vous)"}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {member.role === "OWNER" ? "Propriétaire" : "Membre"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {currentUserId !== member.id && (
                      <button
                        onClick={() => handleDirectMessage(member)}
                        disabled={isSendingMessage}
                        className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Envoyer un message privé"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {isSendingMessage ? "hourglass_empty" : "message"}
                        </span>
                      </button>
                    )}

                    {isUserOwner && currentUserId !== member.id && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 rounded-full hover:bg-error/20 text-on-surface-variant hover:text-error transition"
                        title="Supprimer du canal"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

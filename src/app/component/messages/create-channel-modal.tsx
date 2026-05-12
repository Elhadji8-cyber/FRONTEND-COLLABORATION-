"use client";

import { useState, useEffect } from "react";
import { ConversationService } from "@/services/conversation.service";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { UserService } from "@/services/user.service";

type CreateChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
};

// Interface pour stocker les membres avec leurs noms
type MemberItem = {
  id: string;
  name: string;
};

export function CreateChannelModal({ isOpen, onClose, projectId }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [error, setError] = useState("");

  // Charge la liste des membres de l'entreprise quand la modale s'ouvre
  useEffect(() => {
    async function loadMembers() {
      if (!isOpen) return;
      
      setIsFetchingMembers(true);
      try {
        const session = AuthService.getSession();
        if (!session || !session.companyId) return;

        const project = await ProjectService.getById(projectId, {
          requesterId: session.user.id,
          requesterCompanyId: session.companyId,
          token: session.accessToken,
        });

        // On récupère le détail de chaque membre du projet
        if (project.members) {
          const membersData = await Promise.all(
            project.members.map(async (m) => {
              try {
                const u = await UserService.getById(m.userId);
                return { id: m.userId, name: u.name };
              } catch {
                return { id: m.userId, name: "Utilisateur inconnu" };
              }
            })
          );
          
          const validMembers = membersData.filter((m): m is MemberItem => m !== null);
          const projectMembers = validMembers.filter((m) => m.id !== session.user.id);
          setMembers(projectMembers);
          setSelectedMembers(new Set(projectMembers.map((m) => m.id)));
        }
      } catch (err) {
        console.error("Failed to load project members", err);
      } finally {
        setIsFetchingMembers(false);
      }
    }

    loadMembers();
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const session = AuthService.getSession();
      if (!session || !session.companyId) throw new Error("Session invalide");

      // Le créateur fait obligatoirement partie des membres
      const membersToInclude = [session.user.id, ...Array.from(selectedMembers)];

      // Création de la conversation
      await ConversationService.create({
        name: channelName,
        type: "GROUP", // On force le type GROUP pour un channel
        companyId: session.companyId,
        projectId: projectId,
        creatorId: session.user.id,
        creatorCompanyId: session.companyId,
        members: membersToInclude,
        token: session.accessToken,
      });

      // Réinitialisation
      setChannelName("");
      setSelectedMembers(new Set());
      onClose();
      
      // Recharge la page pour afficher le nouveau channel
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du channel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Créer un Channel</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Un nouveau canal de discussion pour l&apos;équipe du projet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Nom du Channel
            </label>
            <input
              type="text"
              required
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: general, urgences, architecture"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Membres ({selectedMembers.size} sélectionné{selectedMembers.size > 1 ? 's' : ''})
            </label>
            
            <div className="max-h-40 overflow-y-auto rounded-lg bg-surface-container-lowest p-3 border border-outline-variant/20">
              {isFetchingMembers ? (
                <p className="text-xs text-center text-on-surface-variant py-4">Chargement des membres...</p>
              ) : members.length === 0 ? (
                <p className="text-xs text-center text-on-surface-variant py-4">Aucun autre membre dans l&apos;entreprise.</p>
              ) : (
                <ul className="space-y-2">
                  {members.map((member) => (
                    <li key={member.id}>
                      <label className="flex items-center cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          className="rounded border-outline-variant text-primary focus:ring-primary"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => toggleMember(member.id)}
                        />
                        <span className="text-sm text-on-surface">{member.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded border border-error/20 bg-error-container p-3 text-xs text-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !channelName.trim()}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Création..." : "Créer le Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}

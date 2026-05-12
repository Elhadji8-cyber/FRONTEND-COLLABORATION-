"use client";

import { useState, useEffect } from "react";
import { ProjectService } from "@/services/project.service";
import { FileService } from "@/services/file.service";
import { ConversationService } from "@/services/conversation.service";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { UserService } from "@/services/user.service";

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Interface pour stocker les membres avec leurs noms
type MemberItem = {
  id: string;
  name: string;
};

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
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

        const company = await CompanyService.getById(session.companyId, session.user.id);
        
        // On récupère le détail de chaque membre
        if (company.members) {
          const membersData = await Promise.all(
            company.members.map(async (m) => {
              try {
                const u = await UserService.getById(m.userId);
                return { id: m.userId, name: u.name };
              } catch {
                return { id: m.userId, name: "Utilisateur inconnu" };
              }
            })
          );
          
          // Exclure le créateur de la liste (il sera ajouté automatiquement)
          const others = membersData.filter((m) => m.id !== session.user.id);
          setMembers(others);
        }
      } catch (err) {
        console.error("Failed to load company members", err);
      } finally {
        setIsFetchingMembers(false);
      }
    }

    loadMembers();
  }, [isOpen]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!isOpen) return null;

  // Gère la soumission du formulaire de création de projet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const session = AuthService.getSession();
      if (!session || !session.companyId || !session.user?.id || !session.accessToken) {
        throw new Error("Session invalide, utilisateur, entreprise ou token non trouvé.");
      }

      const currentCompanyId = session.companyId;
      const currentUserId = session.user.id;
      const currentToken = session.accessToken;

      // ÉTAPE 1: Création du projet
      // Appel au service pour insérer le nouveau projet en base de données.
      const newProject = await ProjectService.create({
        name: projectName,
        description: description,
        companyId: currentCompanyId,
        requesterId: currentUserId,
        requesterCompanyId: currentCompanyId, // Nécessaire pour la vérification backend
        members: Array.from(selectedMembers), // Membres sélectionnés
        token: currentToken,
      });

      // ÉTAPE 1.5: Création d'une conversation par défaut pour le projet
      await ConversationService.create({
        name: projectName,
        type: "GROUP",
        companyId: currentCompanyId,
        projectId: newProject.id,
        creatorId: currentUserId,
        creatorCompanyId: currentCompanyId,
        members: [currentUserId, ...Array.from(selectedMembers)],
        token: currentToken,
      });

      // ÉTAPE 2: Upload des fichiers sélectionnés
      // Si des fichiers ont été sélectionnés, on boucle pour les envoyer un par un.
      if (files.length > 0) {
        // L'utilisation de Promise.allSettled permet de ne pas tout bloquer si un seul fichier échoue
        const uploadPromises = files.map((file) =>
          FileService.upload({
            file,
            projectId: newProject.id,
            companyId: currentCompanyId,
            uploadedBy: currentUserId,
            visibility: "PRIVATE",
            token: currentToken,
          })
        );
        await Promise.allSettled(uploadPromises);
      }

      // Réinitialisation de l'état local et fermeture de la modale
      setProjectName("");
      setDescription("");
      setFiles([]);
      setSelectedMembers(new Set());
      onClose();
      
      // Recharge la page entière pour voir le nouveau projet apparaitre
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la création.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ajoute de nouveaux fichiers à la liste de l'état
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Nouveau Projet</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Définissez les informations de base et ajoutez les fichiers du projet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Nom du projet
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Construction Alpha"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] resize-none rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
              placeholder="Détails techniques, localisation..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Membres du projet ({selectedMembers.size} sélectionnés)
            </label>
            {isFetchingMembers ? (
              <div className="text-sm text-on-surface-variant">Chargement des membres...</div>
            ) : (
              <div className="max-h-32 overflow-y-auto bg-surface-container-low rounded-lg p-2">
                {members.map((member) => (
                  <label key={member.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedMembers.has(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Fichiers attachés ({files.length})
            </label>
            <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-lowest py-6 hover:border-primary hover:bg-surface-container-low transition">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">upload_file</span>
              <span className="text-sm font-medium">Cliquer pour sélectionner des fichiers</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            
            {/* Affichage de la liste des fichiers sélectionnés */}
            {files.length > 0 && (
              <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {files.map((f, i) => (
                  <li key={i} className="flex justify-between items-center bg-surface-container-low px-3 py-2 rounded text-xs">
                    <span className="truncate max-w-[80%]">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="text-error hover:underline"
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <div className="rounded border border-error/20 bg-error-container p-3 text-xs text-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Création en cours..." : "Créer le projet"}
          </button>
        </form>
      </div>
    </div>
  );
}

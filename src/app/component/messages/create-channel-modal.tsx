"use client";

import { useState, useEffect } from "react";
import { ConversationService } from "@/services/conversation.service";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import type { Project } from "@/types/project";

type CreateChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
};

export function CreateChannelModal({ isOpen, onClose, projectId }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(projectId);
  const [projectMemberIds, setProjectMemberIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      if (!isOpen) return;

      setIsFetchingProjects(true);
      try {
        const session = AuthService.getSession();
        if (!session?.user.id || !session.companyId) return;

        const userProjects = await ProjectService.listByUser(session.user.id, session.user.id, session.companyId);
        setProjects(userProjects);

        const defaultProjectId = projectId || userProjects[0]?.id;
        setSelectedProjectId(defaultProjectId);
      } catch (err) {
        console.error("Failed to load projects for channel creation", err);
      } finally {
        setIsFetchingProjects(false);
      }
    }

    loadProjects();
  }, [isOpen, projectId]);

  useEffect(() => {
    async function loadProjectMembers() {
      if (!selectedProjectId || !isOpen) {
        setProjectMemberIds([]);
        return;
      }

      setIsFetchingMembers(true);
      try {
        const session = AuthService.getSession();
        if (!session?.user.id || !session.companyId) {
          setProjectMemberIds([]);
          return;
        }

        const project = await ProjectService.getById(selectedProjectId, {
          requesterId: session.user.id,
          requesterCompanyId: session.companyId,
          token: session.accessToken,
        });

        const memberIds = project.members?.map((member) => member.userId) ?? [];
        const uniqueMemberIds = Array.from(new Set(memberIds));
        setProjectMemberIds(uniqueMemberIds);
      } catch (err) {
        console.error("Failed to load project members", err);
        setProjectMemberIds([]);
      } finally {
        setIsFetchingMembers(false);
      }
    }

    loadProjectMembers();
  }, [selectedProjectId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setChannelName("");
      setProjects([]);
      setProjectMemberIds([]);
      setError("");
      return;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const currentProjectName = selectedProject?.projectName || "Projet inconnu";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const session = AuthService.getSession();
      if (!session?.user.id || !session.companyId || !session.accessToken) {
        throw new Error("Session invalide");
      }
      if (!selectedProjectId) {
        throw new Error("Veuillez sélectionner un projet.");
      }
      if (projectMemberIds.length === 0) {
        throw new Error("Impossible de récupérer les membres du projet.");
      }

      const membersToInclude = Array.from(new Set([...projectMemberIds, session.user.id]));

      const conversation = await ConversationService.create({
        name: channelName,
        type: "GROUP",
        companyId: session.companyId,
        projectId: selectedProjectId,
        creatorId: session.user.id,
        creatorCompanyId: session.companyId,
        members: membersToInclude,
        token: session.accessToken,
      });

      setChannelName("");
      onClose();

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

        <h2 className="text-2xl font-bold mb-2">Créer un Channel de projet</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Sélectionnez le projet lié au channel et tous ses membres seront automatiquement ajoutés.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Projet lié
            </label>
            <div className="relative">
              <select
                value={selectedProjectId ?? ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
              >
                {isFetchingProjects ? (
                  <option value="">Chargement des projets...</option>
                ) : projects.length === 0 ? (
                  <option value="">Aucun projet disponible</option>
                ) : (
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

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

          <div className="rounded-lg bg-surface-container-lowest p-4 text-sm text-on-surface-variant border border-outline-variant/20">
            {isFetchingMembers ? (
              <p>Chargement des membres du projet...</p>
            ) : selectedProject ? (
              <>
                <p className="font-medium text-on-surface">Projet sélectionné :</p>
                <p className="text-sm text-on-surface">{currentProjectName}</p>
                <p className="mt-2">
                  Ce channel sera automatiquement partagé avec <span className="font-semibold">{projectMemberIds.length}</span> membre{projectMemberIds.length > 1 ? "s" : ""} du projet.
                </p>
              </>
            ) : (
              <p>Choisissez un projet pour que ses membres aient accès au channel.</p>
            )}
          </div>

          {error && (
            <div className="rounded border border-error/20 bg-error-container p-3 text-xs text-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !channelName.trim() || !selectedProjectId}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Création..." : "Créer le Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { AppShell } from "../component/layout/app-shell";
import { ProjectCard } from "../component/dashboard/project-card";
import { SectionTitle } from "../component/ui/section-title";
import { Button } from "../component/ui/button";
import { AuthService } from "@/services/auth.service";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { projectsQuery, enrichedProjects, companyQuery, deleteProjectMutation } = useProjects();
  const session = AuthService.getSession();
  const isOwner = !!companyQuery.data && companyQuery.data.ownerId === session?.user.id;

  const projectCount = enrichedProjects.length;

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

        {projectsQuery.isError ? (
          <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
            {projectsQuery.error instanceof Error
              ? projectsQuery.error.message
              : "Impossible de charger les projets."}
          </div>
        ) : null}

        {projectsQuery.isLoading ? (
          <div className="py-8 text-center text-sm text-on-surface-variant">
            Chargement des projets...
          </div>
        ) : null}

        {!projectsQuery.isLoading && projectCount === 0 && !projectsQuery.isError ? (
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
          {enrichedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.projectName}
              description={project.description || "Aucune description disponible"}
              zone={project.status || "Projet"}
              date={project.createdAt || project.updatedAt}
              statusLabel={project.status}
              progress={project.status === "completed" ? 100 : 0}
              accent="primary"
              isOwner={isOwner}
              members={project.members?.map((member) => ({
                id: member.userId,
                name: member.name || member.role || "Membre",
                avatarUrl: member.avatarUrl,
              }))}
              onOpen={(id) => {
                window.location.href = `/projects/${id}/files`;
              }}
              onMessage={(id) => {
                window.location.href = `/projects/${id}/messages`;
              }}
              onDelete={async (id) => {
                if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
                deleteProjectMutation.mutate(id);
              }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}


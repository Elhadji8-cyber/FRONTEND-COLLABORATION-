// src/components/project/project-sidebar.tsx
export type ProjectSidebarMember = {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
};

type ProjectSidebarProps = {
    projectCode: string;
    companyName: string;
    visibility: string;
    fileCountLabel: string;
    memberCountLabel: string;
    members: ProjectSidebarMember[];
    onOpenFiles?: () => void;
    onOpenMembers?: () => void;
    onManageMembers?: () => void;
    onUploadFile?: () => void;
    onDeleteProject?: () => void;
};

export function ProjectSidebar({
    projectCode,
    companyName,
    visibility,
    fileCountLabel,
    memberCountLabel,
    members,
    onOpenFiles,
    onOpenMembers,
    onManageMembers,
    onUploadFile,
    onDeleteProject,
}: ProjectSidebarProps) {
    return (
        <aside className="space-y-6">
            <section className="rounded-2xl bg-surface-container-low p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Project Meta
                </h3>

                <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-on-surface-variant">Project Code</span>
                        <span className="font-semibold text-on-surface">{projectCode}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-on-surface-variant">Company</span>
                        <span className="font-semibold text-on-surface">{companyName}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-on-surface-variant">Visibility</span>
                        <span className="font-semibold text-on-surface">{visibility}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-on-surface-variant">Files</span>
                        <span className="font-semibold text-on-surface">{fileCountLabel}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-on-surface-variant">Members</span>
                        <span className="font-semibold text-on-surface">
                            {memberCountLabel}
                        </span>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                        Team Members
                    </h3>

                    <button
                        type="button"
                        onClick={onManageMembers}
                        className="text-xs font-semibold text-primary hover:underline"
                    >
                        Manage
                    </button>
                </div>

                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-sm font-bold text-primary">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-on-surface">
                                    {member.name}
                                </p>
                                <p className="text-xs text-on-surface-variant">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                    Quick Actions
                </h3>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={onOpenFiles}
                        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                        Open Files
                    </button>

                    <button
                        type="button"
                        onClick={onOpenMembers}
                        className="w-full rounded-lg bg-surface-container-highest px-4 py-3 text-sm font-semibold text-on-secondary-container transition hover:bg-surface-container"
                    >
                        Open Members
                    </button>

                    <button
                        type="button"
                        onClick={onUploadFile}
                        className="w-full rounded-lg border border-outline-variant/30 px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                    >
                        Add File
                    </button>

                    {onDeleteProject && (
                        <button
                            type="button"
                            onClick={onDeleteProject}
                            className="w-full rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm font-semibold text-error transition hover:bg-error/90"
                        >
                            Delete Project
                        </button>
                    )}
                </div>
            </section>

            {/* TODO: brancher ici ton backend Go
          GET /api/v1/projects/:id
          GET /api/v1/projects/:id/members
          GET /api/v1/projects/:id/files

          Ici tu peux afficher :
          - code projet
          - entreprise liée
          - visibilité
          - nombre de fichiers
          - liste des membres
      */}
        </aside>
    );
}

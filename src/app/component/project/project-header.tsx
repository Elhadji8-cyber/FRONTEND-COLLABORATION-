// src/components/project/project-header.tsx
export type ProjectHeaderData = {
    name: string;
    status: string;
    updatedAtLabel: string;
    description: string;
    teamAvatars?: string[];
    teamCountLabel?: string;
};

type ProjectHeaderProps = {
    project: ProjectHeaderData;
    onOpenFiles?: () => void;
    onOpenMessages?: () => void;
    onOpenMembers?: () => void;
};

export function ProjectHeader({
    project,
    onOpenFiles,
    onOpenMessages,
    onOpenMembers,
}: ProjectHeaderProps) {
    return (
        <section className="rounded-2xl bg-surface-container-low px-6 py-8 shadow-sm lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-tertiary-container px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">
                            {project.status}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            Last updated {project.updatedAtLabel}
                        </span>
                    </div>

                    <h1 className="mb-4 text-4xl font-black tracking-tighter text-on-surface sm:text-5xl">
                        {project.name}
                    </h1>

                    <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                        {project.description}
                    </p>
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                    <div className="flex -space-x-3">
                        {(project.teamAvatars ?? []).slice(0, 3).map((avatar, index) => (
                            <img
                                key={`${avatar}-${index}`}
                                src={avatar}
                                alt="Team member"
                                className="h-10 w-10 rounded-full border-2 border-surface object-cover"
                            />
                        ))}

                        {project.teamCountLabel ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-surface-container-highest text-xs font-bold text-primary">
                                {project.teamCountLabel}
                            </div>
                        ) : null}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Active Project Team
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={onOpenFiles}
                            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                        >
                            Open Files
                        </button>

                        <button
                            type="button"
                            onClick={onOpenMembers}
                            className="rounded-lg bg-surface-container-highest px-5 py-2.5 text-sm font-semibold text-on-secondary-container transition hover:brightness-95"
                        >
                            Open Members
                        </button>

                        <button
                            type="button"
                            onClick={onOpenMessages}
                            className="rounded-lg bg-surface-container-highest px-5 py-2.5 text-sm font-semibold text-on-secondary-container transition hover:brightness-95"
                        >
                            Open Messages
                        </button>
                    </div>
                </div>
            </div>

            {/* TODO: brancher ici ton backend Go
          GET /api/v1/projects/:id
          Tu peux mapper la réponse backend vers :
          {
            name,
            status,
            updatedAtLabel,
            description,
            teamAvatars,
            teamCountLabel
          }
      */}
        </section>
    );
}

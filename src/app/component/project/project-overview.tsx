// src/components/project/project-overview.tsx
export type ProjectOverviewStat = {
    label: string;
    value: string;
    accent?: "primary" | "tertiary" | "secondary";
};

type ProjectOverviewProps = {
    title?: string;
    summary: string;
    stats: ProjectOverviewStat[];
    milestones: Array<{
        id: string;
        title: string;
        description: string;
        dateLabel: string;
    }>;
};

export function ProjectOverview({
    title = "Project Overview",
    summary,
    stats,
    milestones,
}: ProjectOverviewProps) {
    const getAccentClass = (accent?: ProjectOverviewStat["accent"]) => {
        switch (accent) {
            case "tertiary":
                return "border-tertiary";
            case "secondary":
                return "border-secondary";
            case "primary":
            default:
                return "border-primary";
        }
    };

    return (
        <section className="space-y-6">
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-bold tracking-tight text-on-surface">
                    {title}
                </h2>

                <p className="leading-relaxed text-on-surface-variant">{summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => (
                    <article
                        key={`${stat.label}-${index}`}
                        className={`rounded-xl border-l-4 bg-surface-container-lowest p-5 shadow-sm ${getAccentClass(
                            stat.accent,
                        )}`}
                    >
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                    </article>
                ))}
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-bold tracking-tight text-on-surface">
                    Key Milestones
                </h3>

                <div className="space-y-4">
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.id}
                            className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
                        >
                            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="font-semibold text-on-surface">
                                    {milestone.title}
                                </p>
                                <span className="text-xs font-medium text-on-surface-variant">
                                    {milestone.dateLabel}
                                </span>
                            </div>

                            <p className="text-sm leading-relaxed text-on-surface-variant">
                                {milestone.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TODO: brancher ici ton backend Go
          Exemple de sources backend :
          GET /api/v1/projects/:id
          GET /api/v1/projects/:id/milestones (si tu ajoutes ça plus tard)
          GET /api/v1/projects/:id/files
          GET /api/v1/projects/:id/members

          Tu pourras calculer certaines stats côté frontend
          ou les faire retourner déjà prêtes par le backend.
      */}
        </section>
    );
}

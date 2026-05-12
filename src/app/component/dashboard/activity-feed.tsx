export type ActivityItem = {
    id: string;
    title: string;
    description: string;
    time: string;
    icon: string;
    accent?: "primary" | "tertiary" | "default";
};

type ActivityFeedProps = {
    title?: string;
    items: ActivityItem[];
    onLoadMore?: () => void;
};

function getActivityAccent(accent: ActivityItem["accent"]) {
    switch (accent) {
        case "primary":
            return {
                wrapper: "bg-primary-container text-on-primary",
            };
        case "tertiary":
            return {
                wrapper: "bg-tertiary-container text-on-tertiary",
            };
        default:
            return {
                wrapper: "bg-surface-container-highest text-on-surface",
            };
    }
}

export function ActivityFeed({
    title = "Site Activity",
    items,
    onLoadMore,
}: ActivityFeedProps) {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-on-surface">{title}</h2>

            <div className="rounded-2xl bg-surface-container p-6">
                <div className="space-y-8">
                    {items.map((item) => {
                        const accent = getActivityAccent(item.accent);

                        return (
                            <div key={item.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${accent.wrapper}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {item.icon}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-full w-0.5 bg-outline-variant/30" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-on-surface">{item.title}</p>
                                    <p className="mt-1 text-[11px] text-on-surface-variant">
                                        {item.description}
                                    </p>
                                    <span className="mt-2 block text-[10px] font-medium uppercase text-on-surface-variant/60">
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={onLoadMore}
                    className="mt-6 w-full rounded-lg border border-outline-variant/30 py-2 text-[11px] font-bold text-on-surface transition-colors hover:bg-surface-container-low"
                >
                    Load Full History
                </button>

                {/*
          TODO: brancher ici ton backend Go.
          Idéalement, crée un endpoint d'activité projet, par exemple :
          GET /api/v1/projects/:id/activity

          Sinon tu peux agréger :
          - derniers fichiers
          - derniers messages
          - derniers événements projet
        */}
            </div>
        </section>
    );
}

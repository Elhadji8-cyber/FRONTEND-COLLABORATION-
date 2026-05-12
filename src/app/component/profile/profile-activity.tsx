// src/components/profile/profile-activity.tsx
type ProfileActivityItem = {
    id: string;
    title: string;
    description: string;
    dateLabel: string;
    color?: "primary" | "tertiary" | "muted";
};

type ProfileActivityProps = {
    activities: ProfileActivityItem[];
};

export function ProfileActivity({ activities }: ProfileActivityProps) {
    const getDotColor = (color?: ProfileActivityItem["color"]) => {
        switch (color) {
            case "primary":
                return "bg-primary";
            case "tertiary":
                return "bg-tertiary";
            case "muted":
            default:
                return "bg-on-surface-variant";
        }
    };

    return (
        <section className="rounded-2xl bg-surface-container-low p-6">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Recent Activity
            </h3>

            <div className="relative space-y-8 border-l-2 border-outline-variant pl-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="relative">
                        <div
                            className={`absolute -left-[1.625rem] top-1 h-3 w-3 rounded-full ring-4 ring-background ${getDotColor(
                                activity.color,
                            )}`}
                        />

                        <p className="mb-1 text-[10px] font-bold uppercase tracking-tight text-outline">
                            {activity.dateLabel}
                        </p>

                        <p className="text-sm font-bold text-on-surface">{activity.title}</p>

                        <p className="mt-1 text-xs text-on-surface-variant">
                            {activity.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* TODO: brancher ici ton backend Go
          Exemple futur:
          GET /api/v1/users/:id/activity
          Cette section affichera l'activité réelle de l'utilisateur :
          fichiers uploadés, projets rejoints, messages envoyés, versions créées, etc.
      */}
        </section>
    );
}

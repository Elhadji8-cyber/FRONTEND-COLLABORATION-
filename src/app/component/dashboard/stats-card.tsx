type StatsCardProps = {
    label: string;
    value: string;
    icon?: string;
    accent?: "primary" | "tertiary" | "error" | "default";
    subtitle?: string;
};

function getAccentClasses(accent: StatsCardProps["accent"]) {
    switch (accent) {
        case "primary":
            return "text-primary";
        case "tertiary":
            return "text-tertiary";
        case "error":
            return "text-error";
        default:
            return "text-on-surface";
    }
}

export function StatsCard({
    label,
    value,
    icon,
    accent = "default",
    subtitle,
}: StatsCardProps) {
    return (
        <div className="rounded-xl bg-surface-container-lowest px-6 py-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                {label}
            </p>

            <div className="mt-2 flex items-center gap-2">
                {icon ? (
                    <span
                        className={`material-symbols-outlined ${getAccentClasses(accent)}`}
                    >
                        {icon}
                    </span>
                ) : null}

                <p className={`text-2xl font-black ${getAccentClasses(accent)}`}>
                    {value}
                </p>
            </div>

            {subtitle ? (
                <p className="mt-2 text-xs text-on-surface-variant">{subtitle}</p>
            ) : null}

            {/*
        TODO: ce composant est purement visuel.
        Le parent devra lui passer les vraies valeurs venant du backend Go.
      */}
        </div>
    );
}

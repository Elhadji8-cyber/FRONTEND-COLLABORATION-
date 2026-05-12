import { ActivityFeed, type ActivityItem } from "./activity-feed";
import { ProjectCard } from "./project-card";
import { StatsCard } from "./stats-card";

export type DashboardRecentFile = {
    id: string;
    fileName: string;
    status: string;
    owner: string;
    date: string;
    icon: string;
    statusColor?: "approved" | "reviewing" | "rejected";
};

type DashboardHomeProps = {
    title?: string;
    subtitle?: string;
    activePersonnel: string;
    weather: string;
    recentProjects: Array<{
        id: string;
        zone: string;
        title: string;
        progress: number;
        statusLabel?: string;
        accent?: "primary" | "tertiary";
    }>;
    recentFiles: DashboardRecentFile[];
    activityItems: ActivityItem[];
};

function getFileStatusClasses(statusColor?: DashboardRecentFile["statusColor"]) {
    switch (statusColor) {
        case "approved":
            return "bg-[#e6f4ea] text-[#1e7e34]";
        case "rejected":
            return "bg-error-container text-error";
        case "reviewing":
        default:
            return "bg-surface-container-highest text-on-surface-variant";
    }
}

export function DashboardHome({
    title = "Welcome back, Chief.",
    subtitle = "Project Alpha is currently running 4 days ahead of schedule. Site metrics look optimal across all 3 active zones.",
    activePersonnel,
    weather,
    recentProjects,
    recentFiles,
    activityItems,
}: DashboardHomeProps) {
    return (
        <div className="space-y-10 px-4 py-8 sm:px-6 lg:px-12">
            <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface sm:text-4xl">
                        {title}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant sm:text-base">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatsCard
                        label="Active Personnel"
                        value={activePersonnel}
                        accent="primary"
                    />
                    <StatsCard
                        label="Weather Status"
                        value={weather}
                        icon="wb_sunny"
                        accent="tertiary"
                    />
                </div>
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-on-surface">
                            Recent Projects
                        </h2>
                        <button className="text-xs font-semibold text-primary hover:underline">
                            View Portfolio
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {recentProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                zone={project.zone}
                                title={project.title}
                                progress={project.progress}
                                statusLabel={project.statusLabel}
                                accent={project.accent}
                                onOpen={(id) => {
                                    window.location.href = `/projects/${id}/files`;
                                }}
                                onMessage={(id) => {
                                    window.location.href = `/projects/${id}/messages`;
                                }}
                            />
                        ))}
                    </div>

                    <div className="rounded-2xl bg-surface-container-low p-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight text-on-surface">
                                Technical Documents
                            </h2>
                            <button className="rounded-lg bg-surface-container-lowest p-2 text-primary transition-colors hover:bg-surface-variant">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                        <th className="pb-4 pl-2">Filename</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Owner</th>
                                        <th className="pb-4 pr-2 text-right">Date</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm">
                                    {recentFiles.map((file) => (
                                        <tr
                                            key={file.id}
                                            className="transition-colors hover:bg-surface-container"
                                        >
                                            <td className="flex items-center gap-3 py-4 pl-2 font-medium">
                                                <span className={`material-symbols-outlined ${file.statusColor === "approved"
                                                    ? "text-primary-container"
                                                    : file.statusColor === "rejected"
                                                        ? "text-error"
                                                        : "text-tertiary"
                                                    }`}>
                                                    {file.icon}
                                                </span>
                                                {file.fileName}
                                            </td>

                                            <td className="py-4">
                                                <span
                                                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${getFileStatusClasses(
                                                        file.statusColor
                                                    )}`}
                                                >
                                                    {file.status}
                                                </span>
                                            </td>

                                            <td className="py-4 text-on-surface-variant">{file.owner}</td>
                                            <td className="py-4 pr-2 text-right text-on-surface-variant">
                                                {file.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/*
              TODO: brancher ici les vrais fichiers récents depuis ton backend Go
              Exemple :
              GET /api/v1/projects/:id/files
            */}
                    </div>
                </div>

                <div className="xl:col-span-4">
                    <ActivityFeed items={activityItems} />
                </div>
            </section>

            {/*
        TODO: ce composant "dashboard-home" doit recevoir ses données
        depuis la page parent `src/app/projects/[projectId]/page.tsx`.

        Le parent peut faire :
        - GET /api/v1/projects/:id
        - GET /api/v1/projects/:id/files
        - GET /api/v1/projects/:id/activity (plus tard)
      */}
        </div>
    );
}

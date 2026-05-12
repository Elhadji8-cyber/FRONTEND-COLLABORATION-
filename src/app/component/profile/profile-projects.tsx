// src/components/profile/profile-projects.tsx
import Image from "next/image";

type ProfileProjectItem = {
    id: string;
    name: string;
    category: string;
    description: string;
    status: "active" | "completed";
    imageUrl: string;
    accentColor?: "primary" | "tertiary";
};

type ProfileProjectsProps = {
    projects: ProfileProjectItem[];
};

export function ProfileProjects({ projects }: ProfileProjectsProps) {
    return (
        <section>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-primary">
                    architecture
                </span>
                Projects Worked On
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {projects.map((project) => {
                    const accentClass =
                        project.accentColor === "tertiary"
                            ? "border-tertiary"
                            : "border-primary";

                    const badgeClass =
                        project.status === "completed"
                            ? "bg-tertiary-container/10 text-tertiary"
                            : "bg-primary-container/10 text-primary";

                    const statusLabel =
                        project.status === "completed" ? "Completed" : "Active";

                    return (
                        <article
                            key={project.id}
                            className="group overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="relative h-36 overflow-hidden bg-slate-200">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                <div className="absolute bottom-3 left-4 text-white">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                        {project.category}
                                    </p>
                                    <p className="font-bold">{project.name}</p>
                                </div>
                            </div>

                            <div className={`border-l-4 p-5 ${accentClass}`}>
                                <p className="mb-4 line-clamp-2 text-xs text-on-surface-variant">
                                    {project.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span
                                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}
                                    >
                                        {statusLabel}
                                    </span>

                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-xs font-bold text-on-surface transition hover:text-primary"
                                    >
                                        Details
                                        <span className="material-symbols-outlined text-sm">
                                            arrow_forward
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* TODO: brancher ici ton backend Go
          Exemple futur:
          GET /api/v1/users/:id/projects
          ou
          GET /api/v1/projects?user_id=:id
          Cette liste devra afficher les vrais projets de l'utilisateur connecté.
      */}
        </section>
    );
}

import { useRef } from "react";

type ProjectCardProps = {
    id?: string;
    zone: string;
    title: string;
    progress: number;
    statusLabel?: string;
    accent?: "primary" | "tertiary";
    isOwner?: boolean;
    onOpen?: (id: string) => void;
    onMessage?: (id: string) => void;
    onDelete?: (id: string) => void;
    onUpload?: (id: string, files: FileList) => void;
};

function getProjectAccent(accent: ProjectCardProps["accent"]) {
    if (accent === "tertiary") {
        return {
            bar: "bg-tertiary",
            text: "text-tertiary",
        };
    }

    return {
        bar: "bg-primary",
        text: "text-primary",
    };
}

export function ProjectCard({
    id,
    zone,
    title,
    progress,
    statusLabel,
    accent = "primary",
    isOwner = false,
    onOpen,
    onMessage,
    onDelete,
    onUpload,
}: ProjectCardProps) {
    const accentClasses = getProjectAccent(accent);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm transition-all hover:shadow-md h-full">
            <div className="h-32 bg-surface-container-high" />

            <div className="relative p-6 flex-1 flex flex-col">
                <div className={`absolute left-0 top-4 h-12 w-1 ${accentClasses.bar}`} />

                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${accentClasses.text}`}>
                    {zone}
                </p>

                <h3 className="mt-1 text-lg font-bold text-on-surface">{title}</h3>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">{progress}% Complete</span>
                    {statusLabel ? (
                        <span className={`text-xs font-medium ${accentClasses.text}`}>
                            {statusLabel}
                        </span>
                    ) : null}
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-container-low mb-6">
                    <div
                        className={`h-full ${accentClasses.bar}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="mt-auto pt-4 border-t border-outline-variant/10 flex flex-col gap-3">
                    <div className="flex justify-between items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (id && onOpen) onOpen(id); }}
                            className="flex-1 rounded-md bg-primary-container px-3 py-2 text-xs font-semibold text-on-primary-container transition hover:bg-primary/20"
                        >
                            Ouvrir
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (id && onMessage) onMessage(id); }}
                            className="flex-1 rounded-md bg-surface-container-high px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-surface-variant"
                        >
                            Message
                        </button>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="flex-1 flex justify-center items-center gap-1 rounded-md border border-outline-variant/30 px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-surface-container"
                        >
                            <span className="material-symbols-outlined text-[14px]">upload</span>
                            Upload
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0 && id && onUpload) {
                                    onUpload(id, e.target.files);
                                }
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                        />

                        {isOwner && (
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (id && onDelete) onDelete(id); }}
                                className="flex justify-center items-center rounded-md bg-error-container px-3 py-2 text-xs font-semibold text-error transition hover:bg-error/20"
                                title="Supprimer le projet"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/*
        TODO: le parent peut mapper ici les projets venant du backend Go.

        Exemple backend :
        GET /api/v1/users/:id/projects
        ou GET /api/v1/companies/:id/projects

        Exemple mapping :
        zone -> projet.section / projet.zone
        title -> projet.name
        progress -> projet.progress_percent
      */}
        </article>
    );
}

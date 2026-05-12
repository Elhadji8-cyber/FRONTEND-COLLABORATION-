export type VersionTimelineItem = {
    id: string;
    versionLabel: string;
    title: string;
    author: string;
    createdAtLabel: string;
    note?: string;
    isActive?: boolean;
};

type VersionTimelineProps = {
    title?: string;
    versions: VersionTimelineItem[];
    onRestore?: (versionId: string) => void;
    onDownload?: (versionId: string) => void;
};

export function VersionTimeline({
    title = "Version History",
    versions,
    onRestore,
    onDownload,
}: VersionTimelineProps) {
    return (
        <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-on-surface">{title}</h2>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                    Filter by User
                </div>
            </div>

            <div className="space-y-8">
                {versions.map((version) => (
                    <div
                        key={version.id}
                        className="relative flex gap-6 border-l-2 border-outline-variant/20 pl-6"
                    >
                        <div
                            className={`absolute -left-[11px] top-2 flex h-5 w-5 items-center justify-center rounded-full ${version.isActive
                                    ? "bg-primary text-white ring-8 ring-primary/10"
                                    : "bg-surface-container-highest text-primary-fixed-variant"
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm">
                                {version.isActive ? "check_circle" : "history"}
                            </span>
                        </div>

                        <div
                            className={`flex-1 rounded-xl p-6 transition ${version.isActive
                                    ? "border-l-4 border-primary bg-surface-container"
                                    : "hover:bg-surface-container-low"
                                }`}
                        >
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    {version.isActive ? (
                                        <span className="mb-2 inline-block rounded-sm bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-tight text-white">
                                            Active
                                        </span>
                                    ) : null}

                                    <h3 className="text-lg font-bold text-on-surface">
                                        {version.versionLabel} - {version.title}
                                    </h3>

                                    <p className="mt-1 flex items-center gap-2 text-sm text-on-surface-variant">
                                        <span className="font-semibold text-on-surface">{version.author}</span>
                                        {version.createdAtLabel}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!version.isActive ? (
                                        <button
                                            type="button"
                                            onClick={() => onRestore?.(version.id)}
                                            className="rounded border border-outline-variant/20 bg-white px-3 py-1.5 text-xs font-bold uppercase text-primary transition hover:bg-primary hover:text-white"
                                        >
                                            Restore
                                        </button>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={() => onDownload?.(version.id)}
                                        className="rounded border border-outline-variant/20 bg-white p-2 transition hover:shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                                            download
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {version.note ? (
                                <div className="rounded border border-outline-variant/10 bg-surface-container-lowest p-4 text-sm leading-relaxed text-on-surface-variant">
                                    {version.note}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>

            {/*
        TODO: brancher ici ton backend Go depuis la page parent.

        Endpoints utiles côté Go :
        - GET /api/v1/files/:id
        - GET /api/v1/files/:id/versions (si tu l'ajoutes)
        - POST /api/v1/files/:id/version
        - GET téléchargement via URL signée
        - éventuellement delete version si tu l'exposes

        Le parent peut mapper :
        version.number -> versionLabel
        change_note -> note
        uploaded_by -> author
        created_at -> createdAtLabel
      */}
        </section>
    );
}

import Link from "next/link";

export type FilePreviewData = {
    id: string;
    version: string;
    status: string;
    fileFormat: string;
    checksum?: string;
    revisionNote?: string;
    downloadUrl?: string;
};

type FilePreviewPanelProps = {
    file: FilePreviewData;
    onDownloadClick?: () => void;
};

export function FilePreviewPanel({
    file,
    onDownloadClick,
}: FilePreviewPanelProps) {
    return (
        <aside className="w-full border-t border-outline-variant/10 bg-surface-container-low p-6 lg:w-96 lg:border-l lg:border-t-0 lg:p-8">
            <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold tracking-tight text-on-surface">
                    File Preview
                </h2>

                <div className="relative aspect-video overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-highest">
                    <div className="h-full w-full bg-surface-variant" />
                    <button className="absolute bottom-3 right-3 rounded-lg bg-white/90 p-2 text-primary shadow-sm">
                        <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Basic Metadata
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-3">
                            <div className="text-[10px] text-on-surface-variant">Version</div>
                            <div className="text-sm font-bold text-on-surface">{file.version}</div>
                        </div>

                        <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-3">
                            <div className="text-[10px] text-on-surface-variant">Status</div>
                            <div className="text-sm font-bold text-tertiary">{file.status}</div>
                        </div>

                        <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-3">
                            <div className="text-[10px] text-on-surface-variant">File Format</div>
                            <div className="text-sm font-bold text-on-surface">{file.fileFormat}</div>
                        </div>

                        <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-3">
                            <div className="text-[10px] text-on-surface-variant">CRC32</div>
                            <div className="text-sm font-mono text-on-surface">
                                {file.checksum || "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Quick Actions
                    </h3>

                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={onDownloadClick}
                            className="flex w-full items-center justify-between rounded-xl bg-surface-container-highest px-4 py-3 font-semibold text-on-secondary-fixed"
                        >
                            <span className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Download
                            </span>
                            <span className="text-xs opacity-50">latest</span>
                        </button>

                        <Link
                            href={`/files/${file.id}/versions`}
                            className="flex w-full items-center gap-3 rounded-xl border border-outline-variant/30 px-4 py-3 font-semibold text-on-surface-variant transition hover:bg-surface-container"
                        >
                            <span className="material-symbols-outlined text-lg">history</span>
                            View History
                        </Link>

                        <button className="flex w-full items-center gap-3 rounded-xl border border-outline-variant/30 px-4 py-3 font-semibold text-on-surface-variant transition hover:bg-surface-container">
                            <span className="material-symbols-outlined text-lg">update</span>
                            Update (New Version)
                        </button>
                    </div>
                </div>

                {file.revisionNote ? (
                    <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-4">
                        <div className="flex gap-3">
                            <span
                                className="material-symbols-outlined text-primary"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                info
                            </span>
                            <div>
                                <div className="text-sm font-bold text-primary">Revision Note</div>
                                <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                                    {file.revisionNote}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/*
          TODO: brancher ici ton backend Go pour :
          - GET /api/v1/files/:id
          - GET /api/v1/files/:id/versions
          - POST /api/v1/files/:id/version
          - DELETE /api/v1/files/:id
          - téléchargement : utiliser l'URL signée renvoyée par le backend Go

          Le parent peut passer :
          - version
          - status
          - fileFormat
          - checksum
          - revisionNote
          - downloadUrl
        */}
            </div>
        </aside>
    );
}

import Link from "next/link";
import { AppShell } from "../../component/layout/app-shell";
import { FilePreviewPanel } from "../../component/files/file-preview-panel";

type FileDetailsPageProps = {
    params: Promise<{ fileId: string }>;
};

export default async function FileDetailsPage({
    params,
}: FileDetailsPageProps) {
    const { fileId } = await params;

    // TODO: brancher ici ton backend Golang
    //
    // Endpoint principal :
    // GET /api/v1/files/:id
    //
    // Exemple futur :
    // const file = await apiFetch(`/files/${fileId}?requester_id=...&requester_company_id=...`);
    //
    // La réponse du backend Go devrait idéalement contenir :
    // - file.id
    // - file.file_name
    // - file.file_type
    // - file.file_size
    // - file.version
    // - file.visibility
    // - file.project_id
    // - file.company_id
    // - file.uploaded_by
    // - file.created_at
    // - file.updated_at
    // - last_version
    // - download_url

    const file = {
        id: fileId,
        fileName: "blueprint_v4_main_structural.dwg",
        fileType: "DWG (AutoCAD)",
        fileSize: "42.8 MB",
        version: "4.2.0",
        status: "Reviewing",
        uploadedBy: "Elena Vance",
        uploadedAt: "2h ago",
        checksum: "8A2F99B",
        revisionNote:
            "Structural load calculations for the North foundation were updated to meet the new seismic code V.12. Please verify all joist placements.",
        downloadUrl: "#",
    };

    return (
        <AppShell active="files">
            <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
                <section className="flex-1 p-4 sm:p-6 lg:p-12">
                    <div className="mb-8">
                        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                            <Link href="/projects/demo-project" className="transition-colors hover:text-primary">
                                Projects
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link
                                href="/projects/demo-project/files"
                                className="transition-colors hover:text-primary"
                            >
                                Files
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="font-semibold text-on-surface">File Details</span>
                        </nav>

                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-on-surface sm:text-4xl">
                                    {file.fileName}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                                    Detailed view of the selected technical document. Review metadata,
                                    download the current version, and access the complete revision history.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Delete File
                                </button>

                                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
                                    <span className="material-symbols-outlined text-lg">upload_file</span>
                                    Upload New Version
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                        <div className="space-y-8 xl:col-span-8">
                            <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(19,27,46,0.04)]">
                                <div className="border-b border-outline-variant/10 p-6">
                                    <h2 className="text-lg font-bold tracking-tight text-on-surface">
                                        Document Overview
                                    </h2>
                                    <p className="mt-1 text-xs text-on-surface-variant">
                                        Current version metadata and technical ownership.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                            File Type
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{file.fileType}</p>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                            File Size
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{file.fileSize}</p>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                            Current Version
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-primary">{file.version}</p>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                            Uploaded By
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{file.uploadedBy}</p>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                            Last Updated
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-on-surface">{file.uploadedAt}</p>
                                    </div>

                                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                            Status
                                        </p>
                                        <p className="mt-2 text-sm font-bold text-tertiary">{file.status}</p>
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(19,27,46,0.04)]">
                                <div className="border-b border-outline-variant/10 p-6">
                                    <h2 className="text-lg font-bold tracking-tight text-on-surface">
                                        Revision Note
                                    </h2>
                                    <p className="mt-1 text-xs text-on-surface-variant">
                                        Summary of the latest important modification.
                                    </p>
                                </div>

                                <div className="p-6">
                                    <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-4">
                                        <div className="flex gap-3">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                info
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-primary">Latest Revision</p>
                                                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                                                    {file.revisionNote}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-xl bg-surface-container-low p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-on-surface">
                                            Version Actions
                                        </h2>
                                        <p className="mt-1 text-xs text-on-surface-variant">
                                            Access the version timeline or upload a fresh revision.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            href={`/files/${file.id}/versions`}
                                            className="flex items-center gap-2 rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
                                        >
                                            <span className="material-symbols-outlined text-lg">history</span>
                                            View History
                                        </Link>

                                        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
                                            <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                            Upload Version
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/*
                TODO: ici tu peux plus tard ajouter :
                - FileUploader pour nouvelle version
                - table de versions récentes
                - preview plus riche
              */}
                        </div>

                        <div className="xl:col-span-4">
                            <FilePreviewPanel
                                file={{
                                    id: file.id,
                                    version: file.version,
                                    status: file.status,
                                    fileFormat: file.fileType,
                                    checksum: file.checksum,
                                    revisionNote: file.revisionNote,
                                    downloadUrl: file.downloadUrl,
                                }}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}

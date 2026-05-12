import Link from "next/link";

export type FileRow = {
    id: string;
    name: string;
    type: string;
    sizeLabel: string;
    uploadedBy: string;
    uploadedAt: string;
    icon?: string;
    highlighted?: boolean;
};

type FilesTableProps = {
    files: FileRow[];
    title?: string;
    onUploadClick?: () => void;
    onFilterClick?: () => void;
};

export function FilesTable({
    files,
    title = "Project Documents",
    onUploadClick,
    onFilterClick,
}: FilesTableProps) {
    return (
        <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(19,27,46,0.04)]">
            <div className="flex flex-col gap-4 border-b border-outline-variant/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold tracking-tight text-on-surface">{title}</h3>
                    <p className="text-xs text-on-surface-variant">
                        Manage technical specifications and CAD exports
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onFilterClick}
                        className="flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high"
                    >
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>

                    <button
                        type="button"
                        onClick={onUploadClick}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                    >
                        <span className="material-symbols-outlined text-lg">upload</span>
                        Upload
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-surface-container-low">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Name
                            </th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Type
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Size
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Uploaded By
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-surface-container">
                        {files.map((file) => (
                            <tr
                                key={file.id}
                                className={`transition-colors hover:bg-surface-container ${file.highlighted ? "bg-surface-container" : ""
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <Link href={`/files/${file.id}/versions`} className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${file.highlighted ? "bg-tertiary" : "bg-transparent"}`} />
                                        <span className="font-semibold text-on-surface">{file.name}</span>
                                    </Link>
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <span className="material-symbols-outlined text-on-surface-variant">
                                        {file.icon || "description"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-on-surface-variant">{file.sizeLabel}</td>
                                <td className="px-6 py-4 text-sm font-medium text-on-surface">{file.uploadedBy}</td>
                                <td className="px-6 py-4 text-right text-sm text-on-surface-variant">
                                    {file.uploadedAt}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 
        TODO: brancher ici les vraies données de ton backend Go.
        Exemple de source :
        GET /api/v1/projects/:id/files

        Le parent page.tsx peut faire :
        const files = await apiFetch(...)

        Puis mapper vers FileRow[] :
        {
          id: file.id,
          name: file.file_name,
          type: file.file_type,
          sizeLabel: formatBytes(file.file_size),
          uploadedBy: file.uploaded_by,
          uploadedAt: formatDate(file.created_at),
        }
      */}
        </section>
    );
}

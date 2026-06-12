"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CiSaveDown1 } from "react-icons/ci";
import { IoCloudUploadOutline, IoFilter } from "react-icons/io5";
import { Button } from "../ui/button";

export type FileRow = {
    id: string;
    name: string;
    type: string;
    sizeLabel: string;
    uploadedByName?: string;
    uploadedByAvatarUrl?: string;
    uploadedAt: string;
    icon?: string;
    highlighted?: boolean;
    downloadUrl?: string;
};

type FilesTableProps = {
    files: FileRow[];
    title?: string;
    onUploadClick?: () => void;
    onFilterClick?: () => void;
    onDownload?: (fileId: string, fileName: string) => void;
};

export function FilesTable({
    files,
    title = "Project Documents",
    onUploadClick,
    onFilterClick,
    onDownload,
}: FilesTableProps) {
    return (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(19,27,46,0.04)]">
            <div className="flex flex-col gap-4 border-b border-outline-variant/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold tracking-tight text-on-surface">{title}</h3>
                    <p className="text-xs text-on-surface-variant">
                        Manage technical specifications and CAD exports
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* NOTE: les boutons shadcn conservent le style actuel tout en offrant une meilleure cohérence d’interface. */}
                    <Button variant="secondary" onClick={onFilterClick} className="rounded-xl">
                        <IoFilter className="text-lg" />
                        Filter
                    </Button>

                    <Button onClick={onUploadClick} className="rounded-xl">
                        <IoCloudUploadOutline className="text-lg" />
                        Upload
                    </Button>
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
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                Action
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
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {file.uploadedByAvatarUrl ? (
                                            <img
                                                src={file.uploadedByAvatarUrl}
                                                alt={file.uploadedByName ?? "Uploader"}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-sm font-semibold text-on-surface-variant">
                                                <span className="material-symbols-outlined">person</span>
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-on-surface">
                                            {file.uploadedByName ?? "Utilisateur inconnu"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-on-surface-variant">
                                    {file.uploadedAt}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {onDownload ? (
                                        <button
                                            type="button"
                                            onClick={() => onDownload(file.id, file.name)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                                        >
                                            <CiSaveDown1 className="text-base" />
                                            Télécharger
                                        </button>
                                    ) : file.downloadUrl ? (
                                        <a
                                            href={file.downloadUrl}
                                            download
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                                        >
                                            <CiSaveDown1 className="text-base" />
                                            Télécharger
                                        </a>
                                    ) : (
                                        <span className="text-sm text-on-surface-variant">Indisponible</span>
                                    )}
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
        </motion.section>
    );
}

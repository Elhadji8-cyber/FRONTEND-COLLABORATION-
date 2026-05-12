// src/app/projects/[projectId]/files/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "../../../component/layout/app-shell";
import { FilesTable, type FileRow } from "../../../component/files/files.table";
import { SectionTitle } from "../../../component/ui/section-title";
import { Button } from "../../../component/ui/button";
import { FileService } from "@/services/file.service";
import { AuthService } from "@/services/auth.service";
import type { ProjectFile } from "@/types/file";

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function formatDate(dateString: string) {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(d);
}

export default function ProjectFilesPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadFiles = async () => {
        setIsLoading(true);
        const session = AuthService.getSession();
        if (!session?.user.id || !session.companyId) {
            setError("Session invalide.");
            setIsLoading(false);
            return;
        }

        try {
            const data = await FileService.listByProject({
                projectId,
                requesterId: session.user.id,
                requesterCompanyId: session.companyId,
            });
            setFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du chargement des fichiers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, [projectId]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;
        
        const session = AuthService.getSession();
        if (!session?.user.id || !session.companyId) return;

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                await FileService.upload({
                    file: selectedFiles[i],
                    projectId,
                    companyId: session.companyId,
                    uploadedBy: session.user.id,
                });
            }
            alert(`${selectedFiles.length} fichier(s) uploadé(s) avec succès.`);
            loadFiles(); // Recharger la liste après l'upload
        } catch (err) {
            alert("Erreur lors de l'upload : " + (err instanceof Error ? err.message : err));
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const filteredFiles = files.filter(f => 
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fileRows: FileRow[] = filteredFiles.map(f => ({
        id: f.id,
        name: f.fileName,
        type: f.fileType,
        sizeLabel: formatBytes(f.fileSize),
        uploadedBy: "ID: " + f.uploadedBy.substring(0, 6) + "...", // Idéalement, récupérer le nom via un UserService
        uploadedAt: f.createdAt ? formatDate(f.createdAt) : "Inconnu",
        icon: f.fileType.includes("pdf") ? "picture_as_pdf" : f.fileType.includes("image") ? "image" : "description"
    }));

    return (
        <AppShell>
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <SectionTitle
                    title="Project Files"
                    subtitle="Tous les documents techniques liés à ce projet."
                    action={
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Rechercher un fichier..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-sm focus:outline-none focus:border-primary w-full sm:w-64"
                                />
                            </div>
                            
                            <Button onClick={() => fileInputRef.current?.click()}>
                                <span className="material-symbols-outlined text-base">
                                    upload
                                </span>
                                Upload
                            </Button>
                            <input 
                                type="file" 
                                multiple 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleUpload}
                            />
                        </div>
                    }
                />

                {error ? (
                    <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="py-8 text-center text-sm text-on-surface-variant">
                        Chargement des fichiers...
                    </div>
                ) : (
                    <FilesTable files={fileRows} onUploadClick={() => fileInputRef.current?.click()} />
                )}
            </div>
        </AppShell>
    );
}

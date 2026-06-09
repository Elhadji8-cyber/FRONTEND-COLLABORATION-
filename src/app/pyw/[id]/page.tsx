"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/app/component/layout/app-shell";
import { AuthService } from "@/services/auth.service";
import { PywFilesSectionService } from "@/services/pyw-files-section.service";
import { PywService } from "@/services/pyw.service";
import { FileService } from "@/services/file.service";
import { FileVersionService } from "@/services/file-version.service";
import { VersionTimeline } from "@/app/component/file-version/version-timeline";
import { VersionDetailModal } from "@/app/component/file-version/version-detail-modal";
import { CiFileOn, CiSaveDown1 } from "react-icons/ci";
import { IoCloudUploadOutline } from "react-icons/io5";
import type { FileVersion } from "@/types/pyw";
import type { PywDetailResponse } from "@/services/pyw.service";

export default function PywDetailPage() {
    const params = useParams();
    const pywId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [pyw, setPyw] = useState<PywDetailResponse | null>(null);
    const [versions, setVersions] = useState<FileVersion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<"approved" | "rejected" | "modified" | "pending">("pending");
    const [ownerComment, setOwnerComment] = useState("");
    
    // Modal et détails version
    const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const session = AuthService.getSession();
    const isOwner = session?.user.role === "owner" || session?.user.role === "admin";
    const router = useRouter();

    useEffect(() => {
        const loadPyw = async () => {
            if (!pywId) return;
            setIsLoading(true);
            try {
                const data = await PywService.getDetail(pywId);
                setPyw(data);
                setStatus(
                    data.status === "modification_requested"
                        ? "modified"
                        : (data.status as any)
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur lors du chargement");
            } finally {
                setIsLoading(false);
            }
        };
        loadPyw();
    }, [pywId]);

    useEffect(() => {
        const loadVersions = async () => {
            if (!pywId) return;
            setIsLoadingVersions(true);
            try {
                const history = await FileVersionService.getVersionHistory(pywId, session?.accessToken);
                setVersions(history);
            } catch (err) {
                console.error("Erreur lors du chargement des versions:", err);
            } finally {
                setIsLoadingVersions(false);
            }
        };
        loadVersions();
    }, [pywId, session?.accessToken]);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            // Vérifier que l'élément est visible et clickable
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError("");

        try {
            const session = AuthService.getSession();
            if (!session?.user.id || !session.companyId || !pyw?.project_id) {
                throw new Error("Session manquante");
            }

            for (let i = 0; i < files.length; i++) {
                const uploadedFile = await FileService.upload({
                    file: files[i],
                    projectId: pyw.project_id,
                    companyId: session.companyId,
                    uploadedBy: session.user.id,
                });

                const fileUrl = uploadedFile.storageKey;
                if (!fileUrl) {
                    throw new Error("Impossible de récupérer l'URL du fichier uploadé.");
                }

                await PywService.submitVersion(pywId, fileUrl, `Upload: ${uploadedFile.fileName}`);
            }

            // Recharger les données du pyw
            const updated = await PywService.getDetail(pywId);
            setPyw(updated);
            const history = await FileVersionService.getVersionHistory(pywId, session?.accessToken);
            setVersions(history);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDownloadFile = async (storageKey: string, fileName: string) => {
        if (!session?.companyId || !session.accessToken) {
            setError("Session utilisateur introuvable pour le téléchargement.");
            return;
        }

        try {
            const blob = await FileService.downloadFileByStorageKey(
                storageKey,
                fileName,
                session.companyId,
                session.accessToken,
            );

            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du téléchargement du fichier.");
        }
    };

    const handleStatusChange = async (newStatus: "approved" | "rejected" | "modified") => {
        if (!isOwner || !pywId) return;

        setIsUploading(true);
        setError("");

        try {
            await PywService.review(pywId, newStatus, ownerComment);
            setStatus(newStatus);
            const updated = await PywService.getDetail(pywId);
            setPyw(updated);
            setOwnerComment("");

            if (updated && (newStatus === "modified" || newStatus === "rejected")) {
                PywFilesSectionService.addCard({
                    id: updated.id,
                    title: updated.title,
                    description: updated.description,
                    projectName: updated.project_id,
                    owner: session?.user.name,
                    updatedAt: new Date().toISOString(),
                    status: newStatus,
                });
                router.push(`/files`);
                return;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
        } finally {
            setIsUploading(false);
        }
    };

    // ========== Handlers pour les versions ==========
    const handleVersionSelect = (version: FileVersion) => {
        setSelectedVersion(version);
        setIsDetailModalOpen(true);
    };

    const handleDownloadVersion = async (version: FileVersion) => {
        if (!session?.companyId || !session.accessToken) {
            setError("Session utilisateur introuvable pour le téléchargement.");
            return;
        }

        try {
            const blob = await FileService.downloadFileByStorageKey(
                version.storageKey,
                version.versionName,
                session.companyId,
                session.accessToken
            );

            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = `${version.versionName}.${version.fileType}`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du téléchargement du fichier.");
        }
    };

    const handleRestoreVersion = async (version: FileVersion) => {
        if (!isOwner || !pywId) {
            setError("Vous n'avez pas les droits pour restaurer une version.");
            return;
        }

        try {
            // Soumettre la version comme nouvelle version
            await FileVersionService.submitVersion(
                pywId,
                version.fileUrl,
                `Restauration de ${version.versionName}`
            );

            // Recharger les versions
            const history = await FileVersionService.getVersionHistory(pywId, session?.accessToken);
            setVersions(history);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la restauration.");
        }
    };

    return (
        <AppShell active="pyw">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-on-surface-variant">Chargement...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-error">{error}</p>
                    </div>
                ) : !pyw ? (
                    <div className="text-center py-12">
                        <p className="text-error">Travail non trouvé</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="rounded-2xl bg-surface-container-low p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-on-surface">{pyw.title}</h1>
                                    <p className="mt-2 text-sm text-on-surface-variant">{pyw.description}</p>
                                </div>
                                <span
                                    className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap ${
                                        status === "approved"
                                            ? "bg-green-100 text-green-600"
                                            : status === "rejected"
                                              ? "bg-error-container text-error"
                                              : status === "modified"
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-primary-container text-primary"
                                    }`}
                                >
                                    {status === "pending"
                                        ? "En attente"
                                        : status === "approved"
                                          ? "Approuvé"
                                          : status === "rejected"
                                            ? "Rejeté"
                                            : "Modification demandée"}
                                </span>
                            </div>

                            {error && (
                                <div className="mb-4 rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                                    {error}
                                </div>
                            )}

                            {/* Actions Grid - Plus compact */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Première ligne: Upload + Status badge */}
                                <div className="flex gap-2 w-full">
                                    <button
                                        type="button"
                                        onClick={handleUploadClick}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                handleUploadClick();
                                            }
                                        }}
                                        disabled={isUploading}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 active:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        <IoCloudUploadOutline className="h-5 w-5" />
                                        {isUploading ? "Upload..." : "Ajouter fichiers"}
                                    </button>
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                                    />
                                </div>

                                {/* Deuxième ligne: Boutons de revue pour owner */}
                                {isOwner && (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange("approved")}
                                            disabled={isUploading || status === "approved"}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-200 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-lg">check</span>
                                            <span className="hidden sm:inline">Approuver</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange("modified")}
                                            disabled={isUploading || status === "modified"}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-200 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                            <span className="hidden sm:inline">Modif</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange("rejected")}
                                            disabled={isUploading || status === "rejected"}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-error-container px-3 py-2 text-sm font-semibold text-error transition hover:brightness-110 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                            <span className="hidden sm:inline">Rejeter</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Owner Comment Section - Compact */}
                            {isOwner && (
                                <div className="mt-4 pt-4 border-t border-outline-variant/30">
                                    <label className="text-sm font-semibold text-on-surface block mb-2">
                                        Commentaire du propriétaire
                                    </label>
                                    <textarea
                                        value={ownerComment}
                                        onChange={(e) => setOwnerComment(e.target.value)}
                                        placeholder="Ajoutez un commentaire (optionnel)..."
                                        className="w-full rounded-lg bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                                        rows={2}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Files Section */}
                        <div className="rounded-2xl bg-surface-container-low p-6 shadow-sm">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-bold text-on-surface">
                                    Historique des versions
                                </h3>
                                <p className="text-sm text-on-surface-variant">
                                    {versions.length} version{versions.length !== 1 ? "s" : ""} trouvée{versions.length !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {isLoadingVersions ? (
                                <p className="text-center py-8 text-on-surface-variant">Chargement des versions...</p>
                            ) : versions.length === 0 ? (
                                <p className="text-center py-8 text-on-surface-variant">
                                    Aucune version pour ce travail
                                </p>
                            ) : (
                                <VersionTimeline
                                    versions={versions}
                                    currentVersionId={versions.length > 0 ? versions[0].id : undefined}
                                    onVersionSelect={handleVersionSelect}
                                    onDownload={handleDownloadVersion}
                                    onRestore={handleRestoreVersion}
                                    canRestore={isOwner}
                                />
                            )}
                        </div>

                        {/* Modal de détails version */}
                        {selectedVersion && (
                            <VersionDetailModal
                                version={selectedVersion}
                                allVersions={versions}
                                isOpen={isDetailModalOpen}
                                onClose={() => setIsDetailModalOpen(false)}
                                onDownload={handleDownloadVersion}
                                onRestore={handleRestoreVersion}
                                canRestore={isOwner}
                            />
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}

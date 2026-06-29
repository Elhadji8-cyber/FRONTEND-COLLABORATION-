"use client";

import { useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/app/component/layout/app-shell";
import { UploadProgressList } from "@/app/component/files/upload-progress-list";
import { AuthService } from "@/services/auth.service";
import { PywFilesSectionService } from "@/services/pyw-files-section.service";
import { FileService, type UploadProgressItem } from "@/services/file.service";
import { FileVersionService, getVersionDownloadFileName } from "@/services/file-version.service";
import { VersionTimeline } from "@/app/component/file-version/version-timeline";
import { VersionDetailModal } from "@/app/component/file-version/version-detail-modal";
import { usePywDetail, usePywReview, usePywVersions } from "@/hooks/usePyw";
import { IoCloudUploadOutline } from "react-icons/io5";
import type { FileVersion } from "@/types/pyw";

function canReviewPyw(role?: string) {
    const normalizedRole = role?.trim().toUpperCase();
    return normalizedRole === "OWNER" || normalizedRole === "ADMIN";
}

export default function PywDetailPage() {
    const params = useParams();
    const pywId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [ownerComment, setOwnerComment] = useState("");
    const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [uploadItems, setUploadItems] = useState<UploadProgressItem[]>([]);

    const session = AuthService.getSession();
    const isOwner = canReviewPyw(session?.user.role);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: pyw, isLoading: isLoadingPyw, error: pywError } = usePywDetail(pywId);
    const { data: versions = [], isLoading: isLoadingVersions, error: versionsError } = usePywVersions(pywId, session?.accessToken);
    const reviewMutation = usePywReview(pyw?.project_id);
    const status = useMemo(() => {
        if (!pyw) return "pending" as const;
        if (pyw.status === "modification_requested") return "modified" as const;
        if (pyw.status === "approved" || pyw.status === "rejected" || pyw.status === "modified") {
            return pyw.status as "approved" | "rejected" | "modified" | "pending";
        }
        return "pending" as const;
    }, [pyw]);

    const isLoading = isLoadingPyw || isLoadingVersions;
    const queryError = pywError || versionsError ? (pywError || versionsError) : null;
    const displayError = error || (queryError ? String(queryError) : null);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            // Vérifier que l'élément est visible et clickable
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        setError("");

        const newItems = files.map((file, index) => ({
            id: `${file.name}-${file.size}-${index}-${Date.now()}`,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || "application/octet-stream",
            status: "queued" as const,
            progress: 0,
            previewUrl: file.type.startsWith("image/") || file.type === "application/pdf"
                ? URL.createObjectURL(file)
                : undefined,
        }));
        setUploadItems((prev) => [...newItems, ...prev]);

        try {
            if (!session?.accessToken) {
                throw new Error("Session manquante");
            }

            for (const [index, file] of files.entries()) {
                const itemId = newItems[index]?.id;
                if (!itemId) continue;

                setUploadItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "uploading", progress: 0 } : item)));

                try {
                    const uploadedFile = file.size > 5 * 1024 * 1024
                        ? await FileService.uploadMultipart({
                            file,
                            projectId: pyw?.project_id || "",
                            companyId: session.companyId || "",
                            uploadedBy: session.user.id,
                            visibility: "PRIVATE",
                            token: session.accessToken,
                            onProgress: (progress) => {
                                setUploadItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "uploading", progress } : item)));
                            },
                        })
                        : await FileService.upload({
                            file,
                            projectId: pyw?.project_id || "",
                            companyId: session.companyId || "",
                            uploadedBy: session.user.id,
                            visibility: "PRIVATE",
                            token: session.accessToken,
                            onProgress: (progress) => {
                                setUploadItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "uploading", progress } : item)));
                            },
                        });

                    await FileVersionService.submitVersion(
                        pywId,
                        uploadedFile.downloadUrl || "",
                        `Upload : ${file.name}`,
                        uploadedFile.storageKey,
                        uploadedFile.fileName,
                        uploadedFile.fileSize,
                        uploadedFile.fileType,
                        session.accessToken,
                    );

                    await queryClient.invalidateQueries({ queryKey: ["pyw", pywId, "versions"] });
                    setUploadItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "completed", progress: 100 } : item)));
                } catch (err) {
                    const message = err instanceof Error ? err.message : "Erreur lors de l'upload";
                    setUploadItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "error", progress: item.progress, error: message } : item)));
                    setError(message);
                }
            }
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleStatusChange = async (newStatus: "approved" | "rejected" | "modified") => {
        if (!isOwner || !pywId) return;

        setIsUploading(true);
        setError("");

        try {
            await reviewMutation.mutateAsync({
                pywId,
                status: newStatus,
                ownerComment,
            });

            setOwnerComment("");

            if (newStatus === "modified" || newStatus === "rejected") {
                if (pyw) {
                    PywFilesSectionService.addCard({
                        id: pyw.id,
                        title: pyw.title,
                        description: pyw.description,
                        projectName: pyw.project_id,
                        owner: session?.user.name,
                        updatedAt: new Date().toISOString(),
                        status: newStatus,
                    });
                }
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
        if (!session?.accessToken) {
            setError("Session utilisateur introuvable pour le téléchargement.");
            return;
        }

        try {
            const downloadFileName = getVersionDownloadFileName(version);
            const downloadUrl = await FileService.getDownloadUrlByReference(
                version.storageKey,
                version.fileUrl,
                downloadFileName,
                session.companyId,
                session.accessToken,
            );

            const anchor = document.createElement("a");
            anchor.href = downloadUrl;
            anchor.target = "_blank";
            anchor.rel = "noreferrer noopener";
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || "Erreur lors du téléchargement du fichier.");
        }
    };

    const handleRestoreVersion = async (version: FileVersion) => {
        if (!isOwner || !pywId) {
            setError("Vous n'avez pas les droits pour restaurer une version.");
            return;
        }

        try {
            await FileVersionService.submitVersion(
                pywId,
                version.fileUrl,
                `Restauration de ${version.versionName}`,
                version.storageKey,
                version.fileName,
                version.fileSize,
                version.fileType,
                session?.accessToken,
            );
            await queryClient.invalidateQueries({ queryKey: ["pyw", pywId, "versions"] });
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
                ) : displayError ? (
                    <div className="text-center py-12">
                        <p className="text-error">{displayError}</p>
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

                            <UploadProgressList items={uploadItems} />

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
                                    />
                                </div>
                                <p className="text-xs text-on-surface-variant">
                                    Formats supportés : DWG, RVT, PLN, ARCHICAD, PDF, DOCX, XLSX, images, ZIP, etc.
                                </p>
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

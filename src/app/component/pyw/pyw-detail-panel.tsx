"use client";

import { useCallback } from "react";
import { AuthService } from "@/services/auth.service";
import { FileService } from "@/services/file.service";
import { getVersionDownloadFileName } from "@/services/file-version.service";
import type { FileVersion } from "@/types/pyw";
import type { PywCardData } from "./pyw-card";

type PywDetailPanelProps = {
    card: PywCardData;
    versions: FileVersion[];
    isLoadingVersions?: boolean;
    onClose: () => void;
};

const statusLabels: Record<PywCardData["status"], string> = {
    pending: "En attente",
    approved: "Approved",
    rejected: "Rejected",
    modified: "Modified",
};

export function PywDetailPanel({ card, versions, isLoadingVersions = false, onClose }: PywDetailPanelProps) {
    const handleDownloadFile = useCallback(async (
        storageKey: string | undefined,
        fileUrl: string | undefined,
        fileName: string,
    ) => {
        const session = AuthService.getSession();
        if (!session?.accessToken) {
            console.error("Aucune session valide pour le téléchargement.");
            return;
        }

        try {
            const blob = await FileService.downloadFileByReference(
                storageKey,
                fileUrl,
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
        } catch (error) {
            console.error("Erreur lors du téléchargement du fichier :", error);
        }
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pyw-detail-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Fermer"
            />
            <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-surface-container-lowest p-8 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">PYW</p>
                        <h2 id="pyw-detail-title" className="mt-2 text-2xl font-bold text-on-surface">
                            {card.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface transition hover:bg-surface-container-high"
                        aria-label="Fermer le panneau"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <dl className="mt-8 space-y-4">
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Responsable</dt>
                        <dd className="mt-1 text-base font-semibold text-on-surface">{card.owner}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Date</dt>
                        <dd className="mt-1 text-base font-semibold text-on-surface">{card.date}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Statut</dt>
                        <dd className="mt-1">
                            <span className="inline-flex rounded-full bg-primary-container px-3 py-1 text-sm font-semibold text-primary">
                                {statusLabels[card.status]}
                            </span>
                        </dd>
                    </div>
                    {card.description ? (
                        <div>
                            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Description</dt>
                            <dd className="mt-1 text-sm leading-6 text-on-surface-variant">{card.description}</dd>
                        </div>
                    ) : null}
                </dl>

                <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Versions fichier</h3>
                    {isLoadingVersions ? (
                        <p className="mt-3 text-sm text-on-surface-variant">Chargement...</p>
                    ) : versions.length === 0 ? (
                        <p className="mt-3 text-sm text-on-surface-variant">Aucune version pour ce PYW.</p>
                    ) : (
                        <ul className="mt-3 space-y-2">
                            {versions.map((version) => (
                                <li key={version.id} className="rounded-2xl bg-surface-container px-4 py-3 text-sm">
                                    <p className="font-semibold text-on-surface">Version {version.versionNumber ?? "—"}</p>
                                    {version.message ? (
                                        <p className="mt-1 text-on-surface-variant">{version.message}</p>
                                    ) : null}
                                    {version.fileUrl || version.storageKey ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDownloadFile(
                                                    version.storageKey,
                                                    version.fileUrl,
                                                    getVersionDownloadFileName(version),
                                                )
                                            }
                                            className="mt-2 inline-block text-primary underline"
                                        >
                                            Télécharger
                                        </button>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-8 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import type { FileVersion } from "@/types/pyw";
import { AuthService } from "@/services/auth.service";
import { FileService } from "@/services/file.service";
import { cn } from "@/lib/cn";
import { FaRegComment } from "react-icons/fa";
import { GrValidate } from "react-icons/gr";
import { VscDiffModified } from "react-icons/vsc";
import { MdDeleteOutline, MdPersonOutline, MdOutlineAssignmentTurnedIn } from "react-icons/md";

export type PywStatus = "pending" | "approved" | "rejected" | "modified";

export type ProjectMemberAvatar = {
    id: string;
    name?: string;
    avatarUrl?: string;
};

export type PywCardData = {
    id: string;
    title: string;
    owner: string;
    avatarUrl?: string;
    userId: string;
    projectName: string;
    date: string;
    description?: string;
    background: string;
    color: string;
    status: PywStatus;
    members?: ProjectMemberAvatar[];
};

type PywCardProps = {
    card: PywCardData;
    isOwner?: boolean;
    isSubmitting?: boolean;
    isOpen?: boolean;
    versions?: FileVersion[];
    onStatusChange: (id: string, status: Exclude<PywStatus, "pending">) => void;
    onOpen: (card: PywCardData) => void;
    onSendDirectMessage?: (card: PywCardData) => void;
    members?: ProjectMemberAvatar[];
};

const statusLabels: Record<PywStatus, string> = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
    modified: "Modification demandée",
};

const statusStyles: Record<PywStatus, string> = {
    pending: "bg-slate-100 text-slate-700 border-slate-200",
    approved: "bg-emerald-100 text-emerald-900 border-emerald-200",
    rejected: "bg-red-100 text-red-900 border-red-200",
    modified: "bg-orange-100 text-orange-900 border-orange-200",
};

export function PywCard({
    card,
    isOwner = false,
    isSubmitting = false,
    isOpen = false,
    versions = [],
    onStatusChange,
    onOpen,
    onSendDirectMessage,
}: PywCardProps) {
    const handleDownloadFile = useCallback(async (
        storageKey: string | undefined,
        fileUrl: string | undefined,
        fileName: string,
    ) => {
        const session = AuthService.getSession();
        if (!session?.companyId || !session.accessToken) {
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
        // NOTE: Framer Motion ajoute ici une animation de survol légère pour les cartes PYW sans modifier leur logique métier.
        <motion.article
            className={cn(
                "group flex min-h-[320px] flex-col overflow-hidden rounded-[2rem] border p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[340px] sm:p-8",
                card.status === "approved"
                    ? "border-emerald-300"
                    : card.status === "rejected"
                        ? "border-red-300"
                        : card.status === "modified"
                            ? "border-orange-300"
                            : "border-slate-300",
            )}
            style={{ backgroundColor: card.background, color: card.color }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p
                            className="text-xs font-semibold uppercase tracking-[0.2em] leading-snug"
                            style={{ color: card.color }}
                        >
                            {card.title}
                        </p>
                        <span
                            className={cn(
                                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                                statusStyles[card.status],
                            )}
                        >
                            {statusLabels[card.status]}
                        </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-full bg-white/90 text-sm font-semibold text-on-surface shadow-sm">
                            {card.avatarUrl ? (
                                <img
                                    src={card.avatarUrl}
                                    alt={card.owner}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-semibold text-on-surface">
                                    {card.owner
                                        .split(" ")
                                        .map((part) => part[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-on-surface truncate">{card.owner}</h3>
                            <p className="text-xs text-on-surface-variant truncate">Projet : {card.projectName}</p>
                        </div>
                    </div>
                    {card.description ? (
                        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                            {card.description}
                        </p>
                    ) : null}
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-on-surface shadow-sm">
                    <MdOutlineAssignmentTurnedIn className="h-6 w-6" aria-hidden />
                </div>
            </div>

            <p className="mt-auto pt-6 text-sm font-medium text-on-surface-variant">{card.date}</p>

            {/* Owner Actions */}
            {isOwner ? (
                <div className="mt-5 space-y-4">
                    {/* Buttons and Members in flex row */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onStatusChange(card.id, "modified")}
                                title="Demander des modifications"
                                className={cn(
                                    "inline-flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-50",
                                    card.status === "modified"
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "bg-orange-100 text-orange-700 hover:bg-orange-200",
                                )}
                            >
                                <VscDiffModified className="h-5 w-5" aria-hidden />
                                <span className="sr-only">Modifier</span>
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onStatusChange(card.id, "rejected")}
                                title="Rejeter"
                                className={cn(
                                    "inline-flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-50",
                                    card.status === "rejected"
                                        ? "bg-red-500 text-white shadow-sm"
                                        : "bg-red-100 text-red-700 hover:bg-red-200",
                                )}
                            >
                                <MdDeleteOutline className="h-5 w-5" aria-hidden />
                                <span className="sr-only">Rejeter</span>
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onStatusChange(card.id, "approved")}
                                title="Approuver"
                                className={cn(
                                    "inline-flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-50",
                                    card.status === "approved"
                                        ? "bg-green-500 text-white shadow-sm"
                                        : "bg-green-100 text-green-700 hover:bg-green-200",
                                )}
                            >
                                <GrValidate className="h-5 w-5" aria-hidden />
                                <span className="sr-only">Approuver</span>
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onSendDirectMessage?.(card)}
                                title="Message direct au membre"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-on-surface transition hover:bg-surface-container-high disabled:opacity-50"
                            >
                                <FaRegComment className="h-5 w-5" aria-hidden />
                                <span className="sr-only">Message direct au membre</span>
                            </button>
                        </div>

                        {/* Members avatars - vertical stack */}
                        {(card.members ?? []).length > 0 && (
                            <div className="flex flex-col items-center gap-2">
                                {card.members?.map((member) => (
                                    <div
                                        key={member.id}
                                        className="relative z-10 h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-surface-container-high text-sm font-semibold text-on-surface shadow-sm hover:z-20 transition-all"
                                        title={member.name}
                                    >
                                        {member.avatarUrl ? (
                                            <img
                                                src={member.avatarUrl}
                                                alt={member.name || "Avatar"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-surface-container-high text-on-surface">
                                                <MdPersonOutline className="text-lg" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Expose files when card is open */}
                    {isOpen && (
                        <div className="rounded-3xl border border-outline-variant/50 bg-surface-container-high p-4">
                            <div className="flex items-center justify-between gap-2 pb-3">
                                <p className="text-sm font-semibold text-on-surface">Fichiers téléchargés</p>
                                <span className="text-xs text-on-surface-variant">
                                    {versions.length} fichier{versions.length > 1 ? "s" : ""}
                                </span>
                            </div>
                            {versions.length === 0 ? (
                                <p className="text-sm text-on-surface-variant">Aucun fichier trouvé pour cette soumission.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {versions.map((file) => (
                                        <li
                                            key={file.id}
                                            className="flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-white/80 px-3 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-on-surface truncate">
                                                    {file.versionNumber ? `Version ${file.versionNumber}` : file.id}
                                                </p>
                                                <p className="mt-1 text-xs text-on-surface-variant truncate">
                                                    {file.message || file.fileUrl}
                                                </p>
                                            </div>
                                            {file.fileUrl || file.storageKey ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDownloadFile(
                                                            file.storageKey,
                                                            file.fileUrl,
                                                            file.versionNumber
                                                                ? `Version-${file.versionNumber}.pdf`
                                                                : `fichier`,
                                                        )
                                                    }
                                                    className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                                                >
                                                    Télécharger
                                                </button>
                                            ) : (
                                                <span className="text-xs text-on-surface-variant">Aucun lien</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            ) : null}

            {/* Open Button */}
            <button
                type="button"
                disabled={isSubmitting}
                onClick={() => onOpen(card)}
                className={cn(
                    "rounded-2xl bg-primary px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50",
                    isOwner ? "mt-2.5" : "mt-5",
                )}
            >
                Ouvrir
            </button>
        </motion.article>
    );
}
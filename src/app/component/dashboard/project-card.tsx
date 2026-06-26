"use client";

import { motion } from "framer-motion";
import { FaFolderOpen } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { MdDeleteOutline, MdPersonOutline } from "react-icons/md";
import { Card } from "../ui/card";

type ProjectMemberAvatar = {
    id: string;
    name?: string;
    avatarUrl?: string;
};

type ProjectCardProps = {
    id?: string;
    zone: string;
    title: string;
    description?: string;
    members?: ProjectMemberAvatar[];
    progress: number;
    date?: string;
    statusLabel?: string;
    accent?: "primary" | "tertiary";
    isOwner?: boolean;
    onOpen?: (id: string) => void;
    onMessage?: (id: string) => void;
    onDelete?: (id: string) => void;
};

function getProjectAccent(accent: ProjectCardProps["accent"]) {
    if (accent === "tertiary") {
        return {
            bar: "bg-tertiary",
            text: "text-tertiary",
        };
    }

    return {
        bar: "bg-primary",
        text: "text-primary",
    };
}

export function ProjectCard({
    id,
    zone,
    title,
    description,
    members,
    date,
    accent = "primary",
    isOwner = false,
    onOpen,
    onMessage,
    onDelete,
}: ProjectCardProps) {
    const accentClasses = getProjectAccent(accent);
    const formattedDate = date
        ? new Date(date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          })
        : undefined;

    const displayedMembers = members ?? [];

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="h-full"
        >
            <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
                <div className="relative overflow-hidden bg-surface-container-high px-5 py-4">
                    <div className={`absolute left-0 top-0 h-full w-2 ${accentClasses.bar}`} />

                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${accentClasses.text}`}>
                                {zone}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-on-surface">{title}</h3>
                        </div>

                        {formattedDate ? (
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${accentClasses.text} bg-primary-container/10`}>
                                {formattedDate}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="relative flex flex-1 flex-col p-5">
                    <div className="mb-4 line-clamp-3 text-sm leading-6 text-on-surface-variant">
                        {description || "Aucune description fournie pour ce projet."}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (id && onOpen) onOpen(id); }}
                                title="Ouvrir"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-on-surface shadow-sm transition hover:bg-surface-container"
                            >
                                <FaFolderOpen className="text-base" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (id && onMessage) onMessage(id); }}
                                title="Message"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-on-surface shadow-sm transition hover:bg-surface-container"
                            >
                                <FiMessageSquare className="text-base" />
                            </button>
                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (id && onDelete) onDelete(id); }}
                                    title="Supprimer"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-error-container text-error shadow-sm transition hover:bg-error/20"
                                >
                                    <MdDeleteOutline className="text-base" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center -space-x-2">
                            {displayedMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="relative z-10 h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-surface-container-high text-sm font-semibold text-on-surface shadow-sm"
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
                    </div>
                </div>
            </Card>
        </motion.article>
    );
}

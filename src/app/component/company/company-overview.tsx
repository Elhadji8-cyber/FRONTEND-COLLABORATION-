"use client";

import { motion } from "framer-motion";
import { GrStorage } from "react-icons/gr";
import { MdOutlineGroups, MdOutlineHub } from "react-icons/md";
import { FaRegFolder } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export type WorkspaceMember = {
    id: string;
    name?: string;
    avatarUrl?: string;
    role?: string;
};

export type CompanyOverviewData = {
    companyName: string;
    description: string;
    logoUrl?: string;
    storageUsedLabel: string;
    storageTotalLabel: string;
    storageUsagePercent: number;
    activeModules: number;
    membersCount?: number;
    projectsCount?: number;
    members?: WorkspaceMember[];
};

type CompanyOverviewProps = {
    company: CompanyOverviewData;
    onInviteClick?: () => void;
    onLogsClick?: () => void;
    onEditClick?: () => void;
};

// Composant pour le graphique circulaire du storage
function StorageCircle({ percentage }: { percentage: number }) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getStrokeColor = () => {
        if (percentage >= 90) {
            return "text-error";
        }

        if (percentage >= 70) {
            return "text-tertiary";
        }

        return "text-primary";
    };

    return (
        <div className="flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                {/* Fond du cercle */}
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-surface-container"
                />
                {/* Cercle de progression */}
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${getStrokeColor()} transition-all duration-500`}
                />
            </svg>
            {/* Texte au centre */}
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-on-surface">{percentage}%</span>
                <span className="text-xs font-medium text-on-surface-variant">Utilisé</span>
            </div>
        </div>
    );
}

export function CompanyOverview({
    company,
    onInviteClick,
    onLogsClick,
    onEditClick,
}: CompanyOverviewProps) {
    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex items-center gap-5">
                    {company.logoUrl ? (
                        <div className="h-16 w-16 overflow-hidden rounded-3xl bg-surface-container-highest">
                            <img
                                src={company.logoUrl}
                                alt={company.companyName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-container-highest text-3xl text-primary">
                            <span className="material-symbols-outlined">business</span>
                        </div>
                    )}

                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">
                            {company.companyName}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                            {company.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {onEditClick ? (
                        // NOTE: on garde la structure existante, mais on passe par un bouton shadcn pour un rendu plus propre.
                        <Button variant="secondary" onClick={onEditClick} className="rounded-full px-6 py-2.5">
                            <CiEdit className="text-base" aria-hidden />
                            Modifier
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Members */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
                    <Card className="rounded-[2rem] bg-gradient-to-br from-primary-container/20 to-primary-container/5 p-6 border border-primary-container/30">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                                Membres totaux
                            </p>
                            <h3 className="mt-4 text-3xl font-bold text-on-surface">
                                {company.membersCount ?? 0}
                            </h3>
                        </div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                            <MdOutlineGroups className="text-2xl" aria-hidden />
                        </div>
                    </div>
                    </Card>
                </motion.div>

                {/* Active Projects */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
                    <Card className="rounded-[2rem] bg-gradient-to-br from-secondary-container/20 to-secondary-container/5 p-6 border border-secondary-container/30">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                                Projets actifs
                            </p>
                            <h3 className="mt-4 text-3xl font-bold text-on-surface">
                                {company.projectsCount ?? 0}
                            </h3>
                        </div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                            <FaRegFolder className="text-2xl" aria-hidden />
                        </div>
                    </div>
                    </Card>
                </motion.div>

                {/* Active Modules */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
                    <Card className="rounded-[2rem] bg-gradient-to-br from-tertiary-container/20 to-tertiary-container/5 p-6 border border-tertiary-container/30">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                                Modules actifs
                            </p>
                            <h3 className="mt-4 text-3xl font-bold text-on-surface">
                                {company.activeModules}
                            </h3>
                        </div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary/20 text-tertiary">
                            <MdOutlineHub className="text-2xl" aria-hidden />
                        </div>
                    </div>
                    </Card>
                </motion.div>

                {/* Storage Usage */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
                    <Card className="rounded-[2rem] bg-gradient-to-br from-error-container/20 to-error-container/5 p-6 border border-error-container/30">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                                Espace utilisé
                            </p>
                            <h3 className="mt-4 text-2xl font-bold text-on-surface">
                                {company.storageUsedLabel}
                            </h3>
                            <p className="mt-1 text-xs text-on-surface-variant">
                                / {company.storageTotalLabel}
                            </p>
                        </div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-error/20 text-error">
                            <GrStorage className="text-2xl" aria-hidden />
                        </div>
                    </div>
                    </Card>
                </motion.div>
            </div>

            {/* Storage Visualization */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Circular Storage Chart */}
                <div className="rounded-[2rem] bg-surface-container-low p-8 border border-outline-variant/30">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold tracking-tight text-on-surface">
                            Stockage technique
                        </h3>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                            Infrastructure cloud
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative mb-8">
                            <StorageCircle percentage={company.storageUsagePercent} />
                        </div>

                        <div className="w-full space-y-3 text-center">
                            <div className="rounded-2xl bg-surface-container-lowest p-4">
                                <p className="text-xs font-medium text-on-surface-variant">Utilisé</p>
                                <p className="mt-1 text-2xl font-bold text-on-surface">
                                    {company.storageUsedLabel}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-surface-container-lowest p-4">
                                <p className="text-xs font-medium text-on-surface-variant">Capacité totale</p>
                                <p className="mt-1 text-2xl font-bold text-on-surface">
                                    {company.storageTotalLabel}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workspace Personnel */}
                <div className="rounded-[2rem] bg-surface-container-low p-8 border border-outline-variant/30">
                    <h3 className="mb-6 text-lg font-bold tracking-tight text-on-surface">
                        Workspace personnel
                    </h3>

                    <div className="flex flex-wrap gap-4">
                        {company.members && company.members.length > 0 ? (
                            company.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest p-6 transition hover:bg-surface-container"
                                >
                                    {/* Profile Photo */}
                                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-primary/20 flex items-center justify-center">
                                        {member.avatarUrl ? (
                                            <img
                                                src={member.avatarUrl}
                                                alt={member.name || "Utilisateur"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-3xl text-primary">
                                                person
                                            </span>
                                        )}
                                    </div>
                                    {/* Member Info */}
                                    <div className="text-center">
                                        <p className="font-semibold text-on-surface text-sm">
                                            {member.name || "Utilisateur"}
                                        </p>
                                        {member.role && (
                                            <p className="text-xs text-on-surface-variant">
                                                {member.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-on-surface-variant">Aucun membre trouvé</p>
                        )}
                    </div>
                </div>
            </div>

            {/*
        TODO: brancher ici ton backend Go

        Endpoints utiles :
        GET /api/v1/companies/:id
        GET /api/v1/companies/:id/projects (pour projectsCount)

        Tu peux mapper la réponse du backend vers :
        {
          companyName,
          description,
          storageUsedLabel,
          storageTotalLabel,
          storageUsagePercent,
          activeModules,
          membersCount,
          projectsCount
        }
      */}
        </section>
    );
}


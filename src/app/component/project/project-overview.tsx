"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// src/components/project/project-overview.tsx
export type ProjectOverviewStat = {
    label: string;
    value: string;
    accent?: "primary" | "tertiary" | "secondary";
};

type ProjectOverviewProps = {
    title?: string;
    summary: string;
    stats: ProjectOverviewStat[];
    milestones: Array<{
        id: string;
        title: string;
        description: string;
        dateLabel: string;
    }>;
};

export function ProjectOverview({
    title = "Project Overview",
    summary,
    stats,
    milestones,
}: ProjectOverviewProps) {
    const getAccentClass = (accent?: ProjectOverviewStat["accent"]) => {
        switch (accent) {
            case "tertiary":
                return "border-tertiary";
            case "secondary":
                return "border-secondary";
            case "primary":
            default:
                return "border-primary";
        }
    };

    return (
        <section className="space-y-6">
            {/* NOTE: on conserve le même contenu, mais le wrapper shadcn rend la section plus propre sans changer l’architecture visuelle. */}
            <Card className="rounded-2xl p-6 shadow-sm">
                <CardHeader className="p-0">
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-2">
                    <p className="leading-relaxed text-on-surface-variant">{summary}</p>
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => (
                    <motion.article
                        key={`${stat.label}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        className={`rounded-xl border-l-4 bg-surface-container-lowest p-5 shadow-sm ${getAccentClass(
                            stat.accent,
                        )}`}
                    >
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                    </motion.article>
                ))}
            </div>

            <Card className="rounded-2xl p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                    <CardTitle>Key Milestones</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                    {milestones.map((milestone) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2 }}
                            className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
                        >
                            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="font-semibold text-on-surface">
                                    {milestone.title}
                                </p>
                                <Badge variant="secondary">{milestone.dateLabel}</Badge>
                            </div>

                            <p className="text-sm leading-relaxed text-on-surface-variant">
                                {milestone.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* TODO: brancher ici ton backend Go
          Exemple de sources backend :
          GET /api/v1/projects/:id
          GET /api/v1/projects/:id/milestones (si tu ajoutes ça plus tard)
          GET /api/v1/projects/:id/files
          GET /api/v1/projects/:id/members

          Tu pourras calculer certaines stats côté frontend
          ou les faire retourner déjà prêtes par le backend.
      */}
        </section>
    );
}

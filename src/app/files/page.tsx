"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../component/layout/app-shell";
import {
    PywFilesSectionService,
    type PywFilesSectionCard,
} from "@/services/pyw-files-section.service";

export default function FilesPage() {
    const [rejectedCards, setRejectedCards] = useState<PywFilesSectionCard[]>([]);
    const [modifiedCards, setModifiedCards] = useState<PywFilesSectionCard[]>([]);

    useEffect(() => {
        setRejectedCards(PywFilesSectionService.getRejectedCards());
        setModifiedCards(PywFilesSectionService.getModifiedCards());
    }, []);

    const renderCard = (card: PywFilesSectionCard) => (
        <div
            key={card.id}
            className="rounded-3xl border border-outline-variant/50 bg-surface-container-high p-5 shadow-sm"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-on-surface-variant">{card.projectName || "Travail PYW"}</p>
                    <h3 className="mt-1 text-lg font-bold text-on-surface truncate">{card.title}</h3>
                    {card.description ? (
                        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{card.description}</p>
                    ) : null}
                </div>
                <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-primary">
                    {card.status === "rejected" ? "Rejeté" : "Modification demandée"}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                {card.owner ? <span>Par {card.owner}</span> : null}
                {card.updatedAt ? <span>{new Date(card.updatedAt).toLocaleDateString("fr-FR")}</span> : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <Link
                    href={`/pyw/${card.id}`}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                    Voir le travail
                </Link>
            </div>
        </div>
    );

    return (
        <AppShell active="files">
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <div className="rounded-3xl bg-surface-container-low p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-on-surface">Files</h1>
                    <p className="mt-2 text-sm text-on-surface-variant">
                        Les travaux rejetés et ceux demandant une modification sont regroupés ici.
                    </p>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                    <section className="rounded-3xl bg-surface-container-low p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-on-surface">Rejetées</h2>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    Travaux que le propriétaire a rejetés.
                                </p>
                            </div>
                            <span className="rounded-full bg-error-container px-3 py-1 text-xs font-semibold text-error">
                                {rejectedCards.length} card{rejectedCards.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {rejectedCards.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-outline-variant/50 bg-surface-container-high p-8 text-center text-sm text-on-surface-variant">
                                Aucune carte rejetée pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-4">{rejectedCards.map(renderCard)}</div>
                        )}
                    </section>

                    <section className="rounded-3xl bg-surface-container-low p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-on-surface">Modifiées</h2>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    Travaux pour lesquels une modification est demandée.
                                </p>
                            </div>
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                {modifiedCards.length} card{modifiedCards.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {modifiedCards.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-outline-variant/50 bg-surface-container-high p-8 text-center text-sm text-on-surface-variant">
                                Aucune carte modifiée pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-4">{modifiedCards.map(renderCard)}</div>
                        )}
                    </section>
                </div>
            </div>
        </AppShell>
    );
}

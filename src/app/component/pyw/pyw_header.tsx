"use client";

import { IoIosSearch } from "react-icons/io";

type PYWHeaderProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
};

export function PYWHeader({ searchTerm, onSearchChange }: PYWHeaderProps) {
    return (
        <section className="mb-8 rounded-[2rem] bg-surface-container-low p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                    <div className="inline-flex rounded-full bg-primary-container/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Board PYW
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
                            Plan de travail hebdomadaire
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
                            Organise tes tâches par priorités, responsables et dates de livraison.
                            Ce tableau te permet de suivre les actions et de garder une vision claire du backlog.
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-xl">
                    <label htmlFor="pyw-search" className="sr-only">
                        Rechercher les PYW par utilisateur
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                            <IoIosSearch className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <input
                            id="pyw-search"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Rechercher un PYW par utilisateur"
                            className="w-full rounded-full border border-outline-container bg-surface-container-high py-3 pl-12 pr-4 text-sm text-on-surface shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

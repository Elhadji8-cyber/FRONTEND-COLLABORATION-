"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { MdBusiness, MdBuild, MdFolder, MdChat, MdPerson, MdDashboard } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

type SidebarProps = {
    active?: "company" | "projects" | "files" | "messages" | "profile" | "pyw";
    title: string;
    subtitle: string;
    logoUrl?: string;
    canCreateProject?: boolean; // Prop pour vérifier si on a le droit de créer un projet
};

const items = [
    { key: "company", label: "Company", href: "/company", icon: MdBusiness },
    { key: "projects", label: "Projects", href: "/projects", icon: MdBuild },
    { key: "pyw", label: "Monoolith", href: "/pyw", icon: MdDashboard },
    { key: "files", label: "Files", href: "/files", icon: MdFolder },
    { key: "messages", label: "Messages", href: "/messages", icon: MdChat },
    { key: "profile", label: "Profile", href: "/profile", icon: MdPerson },
] as const;

export function Sidebar({ active = "projects", title, subtitle, logoUrl, canCreateProject = false }: SidebarProps) {
    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-surface-container-low lg:flex">
            <div className="px-6 py-8">
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary-container text-on-primary">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={`${title} logo`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-semibold uppercase text-on-primary">
                                    {title?.slice(0, 1) || "C"}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {items.map((item) => {
                        const isActive = active === item.key;
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-3 text-xs font-medium uppercase tracking-widest transition-all",
                                    isActive
                                        ? "border-l-4 border-primary bg-surface-variant pl-5 text-primary"
                                        : "text-on-surface-variant hover:bg-surface-container"
                                )}
                            >
                                <item.icon className="text-lg" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {canCreateProject && (
                    <div className="mt-10">
                        <button 
                            onClick={() => window.dispatchEvent(new Event("openProjectModal"))}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Project
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}

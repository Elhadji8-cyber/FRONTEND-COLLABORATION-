"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { MdBusiness, MdBuild, MdFolder, MdChat, MdPerson } from "react-icons/md";

type SidebarProps = {
    active?: "company" | "projects" | "files" | "messages" | "profile";
    title: string;
    subtitle: string;
    canCreateProject?: boolean; // Prop pour vérifier si on a le droit de créer un projet
};

const items = [
    { key: "company", label: "Company", href: "/company", icon: MdBusiness },
    { key: "projects", label: "Projects", href: "/projects", icon: MdBuild },
    { key: "files", label: "Files", href: "/files", icon: MdFolder },
    { key: "messages", label: "Messages", href: "/messages", icon: MdChat },
    { key: "profile", label: "Profile", href: "/profile", icon: MdPerson },
] as const;

export function Sidebar({ active = "projects", title, subtitle, canCreateProject = false }: SidebarProps) {
    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-surface-container-low lg:flex">
            <div className="px-6 py-8">
                <div className="mb-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                        <span className="material-symbols-outlined">architecture</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                            {subtitle}
                        </p>
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

                {/* Le bouton n'apparaît que si l'utilisateur a la permission (est propriétaire) */}
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

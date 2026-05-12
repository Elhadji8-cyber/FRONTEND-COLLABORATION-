"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Topbar } from "./topbar";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { CreateProjectModal } from "../project/create-project-modal";

const Sidebar = dynamic(() => import("./sidebar").then((mod) => mod.Sidebar), { ssr: false });

type AppShellProps = {
    children: ReactNode;
    active?: "company" | "projects" | "files" | "messages" | "profile";
};

// Exporte aussi l'état isOwner pour que les pages enfants puissent l'utiliser sans refetch
export type AppShellContextType = {
    isOwner: boolean;
};

export function AppShell({
    children,
    active = "projects",
}: AppShellProps) {
    const [title, setTitle] = useState("Loading...");
    const [subtitle, setSubtitle] = useState("");
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isOwner, setIsOwner] = useState(false); // État pour savoir si l'utilisateur courant est propriétaire

    useEffect(() => {
        async function fetchCompany() {
            const session = AuthService.getSession();
            if (session && session.companyId) {
                try {
                    const company = await CompanyService.getById(session.companyId, session.user.id);
                    setTitle(company.companyName);
                    setSubtitle(company.description || "Workspace");
                    
                    // Vérification du rôle : l'utilisateur est-il le propriétaire de l'entreprise ?
                    setIsOwner(session.user.id === company.ownerId);
                } catch (e) {
                    console.error("Failed to load company:", e);
                    setTitle("Company Error");
                }
            } else {
                setTitle("No Company");
            }
        }
        fetchCompany();
    }, []);

    useEffect(() => {
        const handleOpenProjectModal = () => setIsProjectModalOpen(true);
        window.addEventListener("openProjectModal", handleOpenProjectModal);
        return () => window.removeEventListener("openProjectModal", handleOpenProjectModal);
    }, []);

    return (
        <div className="min-h-screen bg-background text-on-surface">
            {/* Passage de l'information isOwner à Sidebar */}
            <Sidebar active={active} title={title} subtitle={subtitle} canCreateProject={isOwner} />
            <Topbar />
            <main className="min-h-screen lg:pl-64 pt-16">{children}</main>
            <CreateProjectModal 
                isOpen={isProjectModalOpen} 
                onClose={() => setIsProjectModalOpen(false)} 
            />
        </div>
    );
}

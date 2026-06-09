"use client";
import { useEffect, useState } from "react";
import { AppShell } from "../component/layout/app-shell";
import { CompanyOverview } from "../component/company/company-overview";
import { MembersTable, type CompanyMemberRow } from "../component/company/members-table";
import { SettingsPanel } from "../component/company/setting-panel";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { ProjectService } from "@/services/project.service";
import { PywService } from "@/services/pyw.service";
import { UserService } from "@/services/user.service";
import { InvitationService } from "@/services/invitation.service";
import type { Company } from "@/types/company";

export default function CompanyPage() {
    const [company, setCompany] = useState<Company | null>(null);
    const [members, setMembers] = useState<CompanyMemberRow[]>([]);
    const [projectsCount, setProjectsCount] = useState(0);
    const [activeModulesCount, setActiveModulesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("MEMBER");
    const [inviteMessage, setInviteMessage] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [companyNameEdit, setCompanyNameEdit] = useState("");
    const [descriptionEdit, setDescriptionEdit] = useState("");
    const [logoUrlEdit, setLogoUrlEdit] = useState("");
    const [logoPreviewEdit, setLogoPreviewEdit] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        async function loadCompanyData() {
            const session = AuthService.getSession();
            if (!session || !session.companyId) {
                setError("Aucune entreprise trouvée.");
                setIsLoading(false);
                return;
            }

            try {
                const companyData = await CompanyService.getById(session.companyId, session.user.id);
                setCompany(companyData);
                setCompanyNameEdit(companyData.companyName);
                setDescriptionEdit(companyData.description || "");
                setLogoUrlEdit(companyData.logoUrl || "");
                setLogoPreviewEdit(companyData.logoUrl || "");

                // Charger les détails des membres
                if (companyData.members && companyData.members.length > 0) {
                    const memberDetails = await Promise.all(
                        companyData.members.map(async (m) => {
                            try {
                                const user = await UserService.getById(m.userId);
                                return {
                                    id: m.userId,
                                    fullName: user.name || "Utilisateur inconnu",
                                    email: user.email || "",
                                    role: m.role || "Membre",
                                    status: m.isActive ? "Actif" : "Inactif",
                                    activityLabel: new Date(m.addedAt || "").toLocaleDateString(),
                                    name: user.name || "Utilisateur inconnu",
                                    avatarUrl: user.avatarUrl,
                                };
                            } catch {
                                return {
                                    id: m.userId,
                                    fullName: "Utilisateur introuvable",
                                    email: "",
                                    role: m.role || "Membre",
                                    status: "Inconnu",
                                    activityLabel: "",
                                    name: "Utilisateur introuvable",
                                    avatarUrl: undefined,
                                };
                            }
                        })
                    );
                    setMembers(memberDetails);
                }

                // Charger les projets et le nombre de PYW associés à l'entreprise
                const companyProjects = await ProjectService.listByCompany(session.companyId, session.companyId);
                const projectPywCounts = await Promise.all(
                    companyProjects.map(async (project) => {
                        try {
                            const pyws = await PywService.listByProject(project.id);
                            return pyws.length;
                        } catch {
                            return 0;
                        }
                    })
                );

                const projectsCount = companyProjects.length;
                const activeModulesCount = projectPywCounts.reduce((sum, count) => sum + count, 0);

                setProjectsCount(projectsCount);
                setActiveModulesCount(activeModulesCount);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur lors du chargement");
            } finally {
                setIsLoading(false);
            }
        }

        loadCompanyData();
    }, []);

    useEffect(() => {
        const handleOpenCompanyEdit = () => setIsEditing(true);
        window.addEventListener("openCompanyEdit", handleOpenCompanyEdit);
        return () => window.removeEventListener("openCompanyEdit", handleOpenCompanyEdit);
    }, []);

    async function handleInviteMember(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setInviteMessage("");

        const session = AuthService.getSession();
        if (!session?.companyId || !session.user?.id) {
            setInviteMessage("Session invalide.");
            return;
        }

        setIsInviting(true);
        try {
            const result = await InvitationService.inviteMember(
                session.companyId,
                inviteEmail,
                session.user.id,
                inviteRole
            );
            setInviteEmail("");
            setInviteMessage(`Invitation envoyée. Lien de test local: ${result.invite_link}`);
        } catch (err) {
            setInviteMessage(err instanceof Error ? err.message : "Invitation impossible.");
        } finally {
            setIsInviting(false);
        }
    }

    function handleStartEditing() {
        setSaveMessage("");
        setIsEditing(true);
    }

    function handleCancelEditing() {
        if (company) {
            setCompanyNameEdit(company.companyName);
            setDescriptionEdit(company.description || "");
            setLogoUrlEdit(company.logoUrl || "");
            setLogoPreviewEdit(company.logoUrl || "");
        }
        setSaveMessage("");
        setIsEditing(false);
    }

    function handleLogoFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            setLogoUrlEdit(company?.logoUrl || "");
            setLogoPreviewEdit(company?.logoUrl || "");
            return;
        }

        if (!file.type.startsWith("image/")) {
            setSaveMessage("Veuillez sélectionner une image.");
            return;
        }

        setSaveMessage("");
        const preview = URL.createObjectURL(file);
        setLogoPreviewEdit(preview);

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setLogoUrlEdit(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        return () => {
            if (logoPreviewEdit && logoPreviewEdit.startsWith("blob:")) {
                URL.revokeObjectURL(logoPreviewEdit);
            }
        };
    }, [logoPreviewEdit]);

    async function handleSaveCompany(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const session = AuthService.getSession();

        if (!session?.companyId || !session.user?.id || !company) {
            setSaveMessage("Session ou entreprise invalide.");
            return;
        }

        setIsSaving(true);
        setSaveMessage("");
        try {
            const updatedCompany = await CompanyService.update(company.id, {
                companyName: companyNameEdit,
                description: descriptionEdit,
                logoUrl: logoUrlEdit,
                requesterId: session.user.id,
            });

            setCompany(updatedCompany);
            window.dispatchEvent(
                new CustomEvent("companyUpdated", {
                    detail: {
                        companyName: updatedCompany.companyName,
                        description: updatedCompany.description || "",
                        logoUrl: updatedCompany.logoUrl,
                    },
                })
            );
            setIsEditing(false);
            setSaveMessage("Entreprise mise à jour avec succès.");
        } catch (err) {
            setSaveMessage(err instanceof Error ? err.message : "Impossible de sauvegarder les modifications.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <AppShell active="company">
                <div className="flex h-full items-center justify-center py-20 text-on-surface-variant">
                    Chargement des données de l&apos;entreprise...
                </div>
            </AppShell>
        );
    }

    if (error || !company) {
        return (
            <AppShell active="company">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
                    <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                        {error || "Entreprise introuvable"}
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell active="company">
            <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-12">
                {isEditing ? (
                    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-6">
                        <h2 className="text-xl font-bold tracking-tight text-on-surface">Modifier l&apos;entreprise</h2>
                        <form className="mt-6 space-y-6" onSubmit={handleSaveCompany}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-on-surface">
                                    <span>Nom de l&apos;entreprise</span>
                                    <input
                                        type="text"
                                        value={companyNameEdit}
                                        onChange={(event) => setCompanyNameEdit(event.target.value)}
                                        className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface"
                                        required
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-on-surface">
                                    <span>Logo de l&apos;entreprise (image)</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoFileChange}
                                        className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface file:cursor-pointer file:rounded-none file:border-0 file:bg-surface-container-lowest file:px-3 file:py-2 file:text-sm file:text-on-surface"
                                    />
                                    {logoPreviewEdit ? (
                                        <div className="mt-3 h-24 w-24 overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest">
                                            <img src={logoPreviewEdit} alt="Aperçu du logo" className="h-full w-full object-cover" />
                                        </div>
                                    ) : null}
                                </label>
                            </div>
                            <label className="space-y-2 text-sm text-on-surface">
                                <span>Description</span>
                                <textarea
                                    value={descriptionEdit}
                                    onChange={(event) => setDescriptionEdit(event.target.value)}
                                    className="min-h-[120px] w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface"
                                />
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancelEditing}
                                    className="rounded-lg border border-outline-variant/30 px-6 py-3 text-sm font-medium text-on-surface"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
                                >
                                    {isSaving ? "Enregistrement..." : "Sauvegarder"}
                                </button>
                            </div>
                            {saveMessage ? (
                                <p className="text-sm text-on-surface-variant">{saveMessage}</p>
                            ) : null}
                        </form>
                    </section>
                ) : null}

                <CompanyOverview
                    company={{
                        companyName: company.companyName,
                        description: company.description || "Aucune description",
                        logoUrl: company.logoUrl,
                        storageUsedLabel: `${((company.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                        storageTotalLabel: `${((company.storageLimit || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                        storageUsagePercent: company.storageLimit ? Math.round(((company.storageUsed || 0) / company.storageLimit) * 100) : 0,
                        activeModules: activeModulesCount,
                        membersCount: members.length,
                        projectsCount: projectsCount,
                        members: members.map((m) => ({
                            id: m.id,
                            name: m.name,
                            avatarUrl: m.avatarUrl,
                            role: m.role,
                        })),
                    }}
                    onEditClick={handleStartEditing}
                />

                <section className="rounded-lg bg-surface-container-low p-6">
                    <h2 className="mb-4 text-xl font-bold tracking-tight text-on-surface">
                        Inviter un membre
                    </h2>
                    <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleInviteMember}>
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={(event) => setInviteEmail(event.target.value)}
                            placeholder="email@entreprise.com"
                            className="min-w-0 flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface"
                            required
                        />
                        <select
                            value={inviteRole}
                            onChange={(event) => setInviteRole(event.target.value)}
                            className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface"
                        >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <button
                            type="submit"
                            disabled={isInviting}
                            className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                            {isInviting ? "Envoi..." : "Envoyer"}
                        </button>
                    </form>
                    {inviteMessage ? (
                        <p className="mt-3 break-words text-sm text-on-surface-variant">
                            {inviteMessage}
                        </p>
                    ) : null}
                </section>

                <MembersTable members={members} />

                <SettingsPanel
                    settings={{
                        visibility: "private",
                        dataResidency: "US East (Virginia)",
                        automaticArchivingEnabled: true,
                    }}
                />
            </div>
        </AppShell>
    );
}


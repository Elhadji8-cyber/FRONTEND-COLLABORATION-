"use client";
import { useEffect, useState } from "react";
import { AppShell } from "../component/layout/app-shell";
import { CompanyOverview } from "../component/company/company-overview";
import { MembersTable, type CompanyMemberRow } from "../component/company/members-table";
import { SettingsPanel } from "../component/company/setting-panel";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { UserService } from "@/services/user.service";
import { InvitationService } from "@/services/invitation.service";
import type { Company } from "@/types/company";

export default function CompanyPage() {
    const [company, setCompany] = useState<Company | null>(null);
    const [members, setMembers] = useState<CompanyMemberRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("MEMBER");
    const [inviteMessage, setInviteMessage] = useState("");
    const [isInviting, setIsInviting] = useState(false);

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
                                };
                            } catch {
                                return {
                                    id: m.userId,
                                    fullName: "Utilisateur introuvable",
                                    email: "",
                                    role: m.role || "Membre",
                                    status: "Inconnu",
                                    activityLabel: "",
                                };
                            }
                        })
                    );
                    setMembers(memberDetails);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur lors du chargement");
            } finally {
                setIsLoading(false);
            }
        }

        loadCompanyData();
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
                <CompanyOverview
                    company={{
                        companyName: company.companyName,
                        description: company.description || "Aucune description",
                        storageUsedLabel: `${((company.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                        storageTotalLabel: `${((company.storageLimit || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                        storageUsagePercent: company.storageLimit ? Math.round(((company.storageUsed || 0) / company.storageLimit) * 100) : 0,
                        activeModules: 3, // Mock pour l'instant
                    }}
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


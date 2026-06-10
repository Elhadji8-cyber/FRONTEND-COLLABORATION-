"use client";

import { CompanyOverview } from "@/app/component/company/company-overview";
import { AppShell } from "@/app/component/layout/app-shell";

export default function CompanyPreviewPage() {
    return (
        <AppShell active="company">
            <div className="space-y-8">
                <CompanyOverview
                    company={{
                        companyName: "Monoolith Inc.",
                        description:
                            "Plateforme collaborative de gestion de projets et planification hebdomadaire. Optimisez votre équipe avec des outils modernes et intuitifs.",
                        storageUsedLabel: "12.5",
                        storageTotalLabel: "50",
                        storageUsagePercent: 25,
                        activeModules: 5,
                        membersCount: 3,
                        projectsCount: 8,
                        members: [
                            {
                                id: "1",
                                name: "Alice Dupont",
                                avatarUrl: "https://i.pravatar.cc/150?img=1",
                                role: "Admin",
                            },
                            {
                                id: "2",
                                name: "Bob Martin",
                                avatarUrl: "https://i.pravatar.cc/150?img=2",
                                role: "Membre",
                            },
                            {
                                id: "3",
                                name: "Carol Jean",
                                avatarUrl: "https://i.pravatar.cc/150?img=3",
                                role: "Membre",
                            },
                        ],
                    }}
                    onInviteClick={() => alert("Invite member clicked")}
                    onLogsClick={() => alert("Logs clicked")}
                />
            </div>
        </AppShell>
    );
}

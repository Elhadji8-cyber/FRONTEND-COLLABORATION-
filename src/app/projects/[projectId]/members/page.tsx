// src/app/projects/[projectId]/members/page.tsx
import { AppShell } from "../../../component/layout/app-shell";
import { MembersTable } from "../../../component/company/members-table";
import { SectionTitle } from "../../../component/ui/section-title";
import { Button } from "../../../component/ui/button";

const mockMembers = [
    {
        id: "member-1",
        fullName: "Marcus Thorne",
        email: "m.thorne@planify.app",
        role: "Admin",
        status: "Active Now",
        activityLabel: "2m ago",
    },
    {
        id: "member-2",
        fullName: "Sarah Chen",
        email: "s.chen@planify.app",
        role: "Engineer",
        status: "Offline",
        activityLabel: "1h ago",
    },
    {
        id: "member-3",
        fullName: "David Miller",
        email: "d.miller@external.com",
        role: "Viewer",
        status: "Away",
        activityLabel: "14h ago",
    },
];

export default function ProjectMembersPage() {
    return (
        <AppShell>
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <SectionTitle
                    title="Project Members"
                    subtitle="Gestion des personnes qui ont accès à ce projet."
                    action={
                        <Button>
                            <span className="material-symbols-outlined text-base">
                                person_add
                            </span>
                            Add Member
                        </Button>
                    }
                />

                <MembersTable members={mockMembers} />

                {/* TODO: brancher ici ton backend Go
            Backend conseillé :
            GET /api/v1/projects/:id
            GET /api/v1/projects/:id/members
            POST /api/v1/projects/:id/members
            DELETE /api/v1/projects/:id/members/:user_id

            Ici tu remplaceras mockMembers par les vraies données du backend.
        */}
            </div>
        </AppShell>
    );
}

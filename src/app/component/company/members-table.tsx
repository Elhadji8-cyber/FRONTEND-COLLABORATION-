// src/components/company/members-table.tsx
"use client";

import Image from "next/image";
import { TableWrapper, Table, TableHead, TableBody } from "../ui/table";
import { Button } from "../ui/button";

export type CompanyMemberRow = {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  role: "Owner" | "Admin" | "Engineer" | "Viewer" | string;
  status: "Active Now" | "Offline" | "Away" | string;
  activityLabel: string;
  avatarUrl?: string;
};

type MembersTableProps = {
  members: CompanyMemberRow[];
  title?: string;
};

function roleClasses(role: string) {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "owner") {
    return "border border-primary/20 bg-primary-container/10 text-primary";
  }

  if (normalizedRole === "engineer") {
    return "border border-secondary/20 bg-secondary-container/30 text-secondary";
  }

  return "border border-outline-variant/30 bg-surface-container-high text-on-surface-variant";
}

function statusDotClasses(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("active")) return "bg-tertiary";
  if (normalizedStatus.includes("away")) return "bg-outline-variant";
  return "bg-outline-variant";
}

export function MembersTable({
  members,
  title = "Workspace Personnel",
}: MembersTableProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-on-surface">
          {title}
        </h2>

        <div className="flex gap-1 rounded-lg bg-surface-container p-1">
          <Button
            variant="secondary"
            size="sm"
            className="bg-surface-container-lowest shadow-sm"
          >
            All Members
          </Button>
          <Button variant="ghost" size="sm">
            Pending
          </Button>
        </div>
      </div>

      <TableWrapper className="bg-surface-container-lowest">
        <Table>
          <TableHead>
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Member
              </th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Access Role
              </th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Status
              </th>
              <th className="px-8 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                Activity
              </th>
            </tr>
          </TableHead>

          <TableBody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="transition-colors hover:bg-surface-container-low"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      <Image
                        src={member.avatarUrl}
                        alt={member.fullName}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-sm font-bold text-primary">
                        {member.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-bold text-on-surface">
                        {member.fullName}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleClasses(
                      member.role,
                    )}`}
                  >
                    {member.role}
                  </span>
                </td>

                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${statusDotClasses(
                        member.status,
                      )}`}
                    />
                    <span className="text-xs font-medium text-on-surface">
                      {member.status}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-5 text-right">
                  <span className="font-mono text-xs text-on-surface-variant">
                    {member.activityLabel}
                  </span>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </section>
  );
}

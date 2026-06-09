import type { Pyw } from "@/types/pyw";
import dynamic from "next/dynamic";
import type { EngineeringOutputCell } from "./profile-output";

const ProfileEngineeringOutput = dynamic(() => import("./profile-output").then((mod) => mod.ProfileEngineeringOutput), { ssr: false });

type ProfilePywProps = {
  works: Pyw[];
  projectNames: Record<string, string>;
  contributionsMap?: Record<string, number>;
  contributions?: EngineeringOutputCell[];
  totalContributions?: number;
};

export function ProfilePyw({ works, projectNames, contributionsMap, contributions, totalContributions }: ProfilePywProps) {
  const listClass = works.length > 6 ? "max-h-96 overflow-y-auto space-y-4 pr-2" : "space-y-4";

  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Travaux PYW</h3>
          <p className="text-sm text-on-surface-variant">
            Les contributions PYW postées par le membre sur ses projets.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {works.length} contribution{works.length !== 1 ? "s" : ""}
        </span>
      </div>

      {works.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Aucune contribution PYW n&apos;a encore été postée.
        </p>
      ) : (
        <div className={listClass}>
          {works.map((work) => {
            const dateKey = work.createdAt ? new Date(work.createdAt).toISOString().slice(0,10) : '';
            const level = dateKey && contributionsMap && contributionsMap[dateKey] !== undefined ? contributionsMap[dateKey] : 0;
            const color = level === 0 ? '#ebedf0' : level === 1 ? '#9be9a8' : level === 2 ? '#40c463' : '#30a14e';

            const bgColor = level === 0 ? undefined : level === 1 ? '#eef9ef' : level === 2 ? '#e0f4df' : '#d1ecd6';
            return (
              <article
                key={work.id}
                className="rounded-2xl border border-outline-variant/70 p-0 overflow-hidden"
                style={{ backgroundColor: bgColor, borderLeft: `6px solid ${color}` }}
              >
                <div style={{ backgroundColor: color }} className="h-2 w-full" />
                <div className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="-ml-1 mb-2 flex items-center gap-3">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
                      <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                        {projectNames[work.projectId] ?? "Projet PYW"}
                      </p>
                    </div>
                    <h4 className="text-base font-semibold text-on-surface">{work.title}</h4>
                    <p className="text-sm text-on-surface-variant line-clamp-2">
                      {work.description || "Pas de description disponible."}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full bg-surface-container py-1 px-3 text-xs font-semibold text-on-surface-variant">
                      {work.createdAt && !Number.isNaN(new Date(work.createdAt).getTime())
                        ? new Date(work.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })
                        : "Date inconnue"}
                    </span>
                    {(work.status === "approved" || work.status === "rejected") && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          work.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {work.status === "approved" ? "Approuvé" : "Refusé"}
                      </span>
                    )}
                  </div>
                </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {/* Place contributions heatmap below the list of posted PYW */}
      {contributions && (
        <div className="mt-6">
          <ProfileEngineeringOutput
            totalContributions={totalContributions || works.length}
            cells={contributions}
            title="Contributions PYW"
          />
        </div>
      )}
    </section>
  );
}

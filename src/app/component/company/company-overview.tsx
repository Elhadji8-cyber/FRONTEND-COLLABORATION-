export type CompanyOverviewData = {
    companyName: string;
    description: string;
    storageUsedLabel: string;
    storageTotalLabel: string;
    storageUsagePercent: number;
    activeModules: number;
};

type CompanyOverviewProps = {
    company: CompanyOverviewData;
    onInviteClick?: () => void;
    onLogsClick?: () => void;
};

export function CompanyOverview({
    company,
    onInviteClick,
    onLogsClick,
}: CompanyOverviewProps) {
    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">
                        {company.companyName}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                        {company.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onLogsClick}
                        className="rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-semibold text-on-secondary-container transition hover:brightness-95"
                    >
                        Workspace Logs
                    </button>

                    <button
                        type="button"
                        onClick={onInviteClick}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Invite Member
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-surface-container-lowest p-8 md:col-span-2">
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight text-on-surface">
                                Technical Assets Storage
                            </h3>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                                Cloud Infrastructure
                            </p>
                        </div>

                        <span className="text-2xl font-black text-primary">
                            {company.storageUsagePercent}%
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${company.storageUsagePercent}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                            <span>{company.storageUsedLabel} Used</span>
                            <span>{company.storageTotalLabel} Total Capacity</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl bg-surface-container-low p-8">
                    <span className="material-symbols-outlined text-3xl text-primary">hub</span>

                    <div>
                        <h4 className="text-2xl font-bold tracking-tight text-on-surface">
                            {company.activeModules}
                        </h4>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                            Active Sub-Modules
                        </p>
                    </div>
                </div>
            </div>

            {/*
        TODO: brancher ici ton backend Go

        Endpoints utiles :
        GET /api/v1/companies/:id

        Tu peux mapper la réponse du backend vers :
        {
          companyName,
          description,
          storageUsedLabel,
          storageTotalLabel,
          storageUsagePercent,
          activeModules
        }

        Exemple :
        - company.name -> companyName
        - company.description -> description
        - company.storage_limit -> storageTotalLabel
        - used_storage calculé -> storageUsedLabel
        - percentage -> storageUsagePercent
      */}
        </section>
    );
}

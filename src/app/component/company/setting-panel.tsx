export type CompanySettingsData = {
    visibility: "private" | "organization";
    dataResidency: string;
    automaticArchivingEnabled: boolean;
};

type SettingsPanelProps = {
    settings: CompanySettingsData;
    onVisibilityChange?: (value: "private" | "organization") => void;
    onResidencyChange?: (value: string) => void;
    onArchivingToggle?: (value: boolean) => void;
    onSave?: () => void;
    onDiscard?: () => void;
};

export function SettingsPanel({
    settings,
    onVisibilityChange,
    onResidencyChange,
    onArchivingToggle,
    onSave,
    onDiscard,
}: SettingsPanelProps) {
    return (
        <section className="space-y-6 border-t border-outline-variant/20 pt-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-on-surface">
                        Workspace Settings
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                        Configure fundamental workspace parameters and security protocols for
                        the Monoolith ecosystem.
                    </p>
                </div>

                <div className="space-y-8 lg:col-span-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                Workspace Visibility
                            </label>

                            <div className="flex rounded-lg bg-surface-container p-1">
                                <button
                                    type="button"
                                    onClick={() => onVisibilityChange?.("private")}
                                    className={`flex-1 rounded px-4 py-2 text-xs font-bold transition ${settings.visibility === "private"
                                            ? "bg-surface-container-lowest shadow-sm"
                                            : "text-on-surface-variant"
                                        }`}
                                >
                                    Private
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onVisibilityChange?.("organization")}
                                    className={`flex-1 px-4 py-2 text-xs font-medium transition ${settings.visibility === "organization"
                                            ? "rounded bg-surface-container-lowest shadow-sm"
                                            : "text-on-surface-variant"
                                        }`}
                                >
                                    Organization Only
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                Data Residency
                            </label>

                            <select
                                value={settings.dataResidency}
                                onChange={(e) => onResidencyChange?.(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface"
                            >
                                <option value="US East (Virginia)">US East (Virginia)</option>
                                <option value="EU West (Dublin)">EU West (Dublin)</option>
                                <option value="Asia Pacific (Singapore)">Asia Pacific (Singapore)</option>
                            </select>
                        </div>
                    </div>

                    <div className="rounded-lg border-l-4 border-tertiary bg-surface-container-lowest p-6">
                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <h4 className="text-sm font-bold text-on-surface">
                                    Automatic Archiving
                                </h4>
                                <p className="text-xs text-on-surface-variant">
                                    Move inactive project files to cold storage after 180 days.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    onArchivingToggle?.(!settings.automaticArchivingEnabled)
                                }
                                className={`relative h-6 w-11 rounded-full transition ${settings.automaticArchivingEnabled
                                        ? "bg-primary"
                                        : "bg-surface-container-highest"
                                    }`}
                                aria-label="Toggle automatic archiving"
                            >
                                <span
                                    className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition ${settings.automaticArchivingEnabled
                                            ? "left-[22px]"
                                            : "left-[2px]"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onDiscard}
                            className="px-6 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface"
                        >
                            Discard Changes
                        </button>

                        <button
                            type="button"
                            onClick={onSave}
                            className="rounded-lg bg-on-surface px-8 py-2 text-sm font-bold text-surface shadow-lg hover:bg-on-surface/90"
                        >
                            Save Protocols
                        </button>
                    </div>

                    {/*
            TODO: brancher ici ton backend Go

            Endpoint utile :
            PUT /api/v1/companies/:id

            Tu pourras envoyer par exemple :
            {
              visibility,
              data_residency,
              automatic_archiving_enabled
            }

            Ou adapter selon ton vrai modèle Go.

            Important :
            ce composant ne parle pas directement au backend.
            C'est la page parent qui devra :
            - charger les données
            - gérer le state
            - appeler ton API Go
          */}
                </div>
            </div>
        </section>
    );
}

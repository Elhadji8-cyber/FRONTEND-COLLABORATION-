import { ArchitectureIcon, SyncIcon, UsbIcon } from "./icons";
export const ComparisonSection = () => {
    return (
        <section
            id="solutions"
            className="relative overflow-hidden bg-[var(--on-background)] py-20 text-white sm:py-24 lg:py-32"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    <div>
                        <h2 className="mb-8 text-4xl font-black leading-[1.1] tracking-[-0.06em] sm:text-5xl">
                            The Evolution of Engineering Identity
                        </h2>
                        <p className="mb-12 text-lg leading-relaxed text-slate-400 sm:text-xl">
                            Legacy firms still ship physical drives. Leaders use Monolith. We
                            transform fragmented data silos into a singular, authoritative
                            source of truth.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-6">
                                <div className="rounded bg-[color:rgba(186,26,26,0.2)] p-2">
                                    <UsbIcon className="h-6 w-6 text-[var(--error)]" />
                                </div>
                                <div>
                                    <h4 className="mb-1 text-lg font-bold">
                                        Before: Fragmented USB Sharing
                                    </h4>
                                    <p className="text-sm text-slate-400">
                                        Prone to loss, physical damage, and version conflicts that
                                        delay project milestones.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-lg border border-[color:rgba(0,74,198,0.2)] bg-[color:rgba(0,74,198,0.1)] p-6">
                                <div className="rounded bg-[var(--primary)] p-2">
                                    <SyncIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="mb-1 text-lg font-bold">
                                        After: Secure Cloud Fabric
                                    </h4>
                                    <p className="text-sm text-slate-400">
                                        Instant synchronization across global teams with
                                        military-grade encryption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-20 rounded-full bg-[color:rgba(0,74,198,0.2)] blur-[120px]" />
                        <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
                            <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="font-mono text-xs text-[var(--primary)]">
                                    BUILD_VERSION_v4.2.0
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-8 w-3/4 rounded bg-slate-800" />
                                <div className="h-8 w-1/2 rounded bg-slate-800" />
                                <div className="flex h-40 items-center justify-center rounded border border-[color:rgba(0,74,198,0.3)] bg-[color:rgba(0,74,198,0.1)]">
                                    <ArchitectureIcon className="h-12 w-12 text-[var(--primary)]" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-12 rounded bg-slate-800" />
                                    <div className="h-12 rounded bg-slate-800" />
                                    <div className="h-12 rounded bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

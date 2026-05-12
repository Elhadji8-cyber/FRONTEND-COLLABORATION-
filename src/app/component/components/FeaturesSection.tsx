import { CloudIcon, GroupsIcon, HistoryIcon, ShieldIcon } from "./icons";
export const FeaturesSection = () => {
    return (
        <section id="features" className="bg-[var(--surface)] py-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 max-w-2xl sm:mb-20">
                    <h2 className="mb-4 text-3xl font-black tracking-[-0.06em] text-[var(--on-surface)] sm:text-4xl">
                        Engineered for High-Density Data
                    </h2>
                    <p className="text-base text-[var(--on-surface-variant)] sm:text-lg">
                        We&apos;ve replaced the friction of traditional CAD workflows with a
                        modern, high-performance stack.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-xl bg-[var(--surface-container-low)] p-8 sm:p-10 md:col-span-2">
                        <div className="relative z-10">
                            <CloudIcon className="mb-6 h-10 w-10 text-[var(--primary)]" />
                            <h3 className="mb-4 text-2xl font-bold text-[var(--on-surface)]">
                                Cloud-based Workspace
                            </h3>
                            <p className="max-w-md text-[var(--on-surface-variant)]">
                                Access massive architectural files from any device with zero
                                latency. Our proprietary streaming protocol handles datasets in
                                the terabytes.
                            </p>
                        </div>
                        <img
                            alt="Cloud data nodes"
                            className="absolute -bottom-[10%] -right-[10%] w-2/3 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9FC_Jhdd7pylJwXzWd119u-zIgfGAtBvdIV7hF5JayIO7586jAFM9JFE9ctyKy-D9VTcGsSP6XF2p1pf13GOg9XK9sq6KkUmAKmrBHJo70fH3JLudgvI25lMmhUMO2DusXQqcqWpsTPExskHGHrSQywQ1lwL8pkPnwK-XPTTyZVLYBHtBJL_fhNmLHm5Iu8Tdzka7rFETh1c0jdJCPGYRUfODkOYUj668UTOSrz5dbtV6jUIcoIHN92BKiIfkPFo1VWfi9we8Kw"
                        />
                    </div>

                    <div className="rounded-xl bg-[var(--primary)] p-8 text-[var(--on-primary)] shadow-xl shadow-[color:rgba(0,74,198,0.2)] sm:p-10">
                        <GroupsIcon className="mb-6 h-10 w-10" />
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            Real-time Collaboration
                        </h3>
                        <p className="text-[color:rgba(238,239,255,0.8)]">
                            Multiple engineers working on the same model simultaneously. See
                            changes as they happen, down to the millimeter.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[color:rgba(195,198,215,0.2)] bg-[var(--surface-container-highest)] p-8 sm:p-10">
                        <HistoryIcon className="mb-6 h-10 w-10 text-[var(--primary)]" />
                        <h3 className="mb-4 text-2xl font-bold text-[var(--on-surface)]">
                            Version Control
                        </h3>
                        <p className="text-[var(--on-surface-variant)]">
                            Complete revision history for every bolt and girder. Fork designs,
                            branch projects, and merge changes with total confidence.
                        </p>
                    </div>

                    <div className="group flex flex-col justify-between gap-8 overflow-hidden rounded-xl bg-[var(--surface-container)] p-8 sm:p-10 md:col-span-2 sm:flex-row sm:items-center">
                        <div className="max-w-sm">
                            <ShieldIcon className="mb-6 h-10 w-10 text-[var(--primary)]" />
                            <h3 className="mb-4 text-2xl font-bold text-[var(--on-surface)]">
                                Secure Cloud Infrastructure
                            </h3>
                            <p className="text-[var(--on-surface-variant)]">
                                Stop relying on vulnerable USB drives and local servers. Our
                                end-to-end encrypted cloud keeps your IP safe and accessible.
                            </p>
                        </div>

                        <div className="hidden shrink-0 translate-x-8 transition-transform group-hover:translate-x-4 sm:block">
                            <div className="rotate-12 rounded-xl bg-[var(--surface-container-lowest)] p-6 shadow-lg">
                                <div className="mb-4 h-1 w-32 rounded bg-[color:rgba(0,74,198,0.2)]" />
                                <div className="mb-4 h-1 w-24 rounded bg-[color:rgba(0,74,198,0.2)]" />
                                <div className="h-1 w-40 rounded bg-[var(--primary)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

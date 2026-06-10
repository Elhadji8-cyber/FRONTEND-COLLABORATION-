import { partnerLogos } from "./data";
export const SocialProofSection = () => {
    return (
        <section className="bg-[var(--surface-container-low)] py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.3em] text-[color:rgba(67,70,85,0.6)]">
                    Trusted by modern teams
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-center opacity-50 grayscale sm:gap-x-16">
                    {partnerLogos.map((logo) => (
                        <div
                            key={logo}
                            className="text-xl font-black tracking-[-0.06em] sm:text-2xl"
                        >
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

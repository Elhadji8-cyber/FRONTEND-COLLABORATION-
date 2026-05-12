export const FinalCtaSection = () => {
    return (
        <section id="pricing" className="bg-[var(--surface)] py-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-8 text-4xl font-black tracking-[-0.06em] text-[var(--on-surface)] sm:text-5xl md:text-6xl">
                    Build the Future Together
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-lg text-[var(--on-surface-variant)] sm:text-xl">
                    Join over 400 engineering firms redefining structural integrity with
                    the Monolith digital twin ecosystem.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button className="w-full rounded-xl bg-[var(--primary)] px-10 py-5 text-xl font-black text-white shadow-2xl shadow-[color:rgba(0,74,198,0.3)] transition-transform hover:scale-105 sm:w-auto">
                        Launch Project
                    </button>
                    <button className="w-full rounded-xl bg-[var(--surface-container-low)] px-10 py-5 text-xl font-black text-[var(--on-surface)] transition-all hover:bg-[var(--surface-container-high)] sm:w-auto">
                        Contact Sales
                    </button>
                </div>
            </div>
        </section>
    );
};

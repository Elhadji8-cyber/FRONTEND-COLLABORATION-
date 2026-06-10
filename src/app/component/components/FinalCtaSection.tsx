export const FinalCtaSection = () => {
    const plans = [
        { name: "Starter", price: "0€", description: "Parfait pour découvrir le système et lancer vos premiers projets.", accent: "border-slate-200 bg-white" },
        { name: "Pro", price: "29€", description: "Pour les équipes qui veulent centraliser fichiers, tâches et collaborations.", accent: "border-[var(--primary)] bg-[var(--surface-container)] shadow-xl shadow-[color:rgba(0,74,198,0.12)]" },
        { name: "Enterprise", price: "Personnalisé", description: "Pour les organisations avec plusieurs équipes, validation et besoins avancés.", accent: "border-slate-200 bg-white" },
    ];

    return (
        <section id="pricing" className="bg-[var(--surface)] py-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">Pricing</p>
                    <h2 className="mb-4 text-4xl font-black tracking-[-0.06em] text-[var(--on-surface)] sm:text-5xl">Des prix clairs pour démarrer vite et évoluer avec vous.</h2>
                    <p className="text-lg text-[var(--on-surface-variant)] sm:text-xl">Choisissez le niveau qui correspond à votre organisation et à vos besoins de collaboration.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <article key={plan.name} className={`rounded-3xl border p-6 shadow-sm ${plan.accent}`}>
                            <p className="text-sm uppercase tracking-[0.35em] text-[var(--primary)]">{plan.name}</p>
                            <div className="mt-6 flex items-end gap-2">
                                <span className="text-4xl font-black tracking-[-0.06em] text-[var(--on-surface)]">{plan.price}</span>
                                {plan.price !== "Personnalisé" && <span className="pb-1 text-sm text-[var(--on-surface-variant)]">/ mois</span>}
                            </div>
                            <p className="mt-4 text-sm text-[var(--on-surface-variant)]">{plan.description}</p>
                            <ul className="mt-6 space-y-3 text-sm text-[var(--on-surface)]">
                                <li>• Workspace partagé</li>
                                <li>• Gestion des versions</li>
                                <li>• Dashboard collaboratif</li>
                            </ul>
                            <button className="mt-8 w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--on-primary)] transition hover:opacity-95">Choisir {plan.name}</button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

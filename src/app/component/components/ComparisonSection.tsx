import Link from "next/link";
import { motion } from "framer-motion";

const solutions = [
    {
        title: "Team",
        href: "/solutions/team",
        items: ["Storage", "Task", "Manage workers", "Chat", "Share files"],
        description: "Un environnement simple pour les équipes opérationnelles qui veulent collaborer sans friction.",
    },
    {
        title: "Company",
        href: "/solutions/company",
        items: ["Entreprise", "Civil engineer", "Architect", "Bureau de contrôle", "Collaboration"],
        description: "Des espaces adaptés aux organisations qui gèrent plusieurs métiers et projets en parallèle.",
    },
    {
        title: "Industry",
        href: "/solutions/industry",
        items: ["Gestion entreprise", "Gestion projet", "Gestion d’équipe", "Chat", "Versioning", "Validation"],
        description: "Des workflows prêts à l’emploi pour les environnements industriels et de contrôle qualité.",
    },
];

export const ComparisonSection = () => {
    return (
        <section id="solutions" className="relative overflow-hidden bg-[var(--on-background)] py-20 text-white sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35 }}
                    className="mb-10 max-w-3xl"
                >
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">Solutions</p>
                    <h2 className="mb-4 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">Des solutions adaptées à chaque type d’organisation.</h2>
                    <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">Chaque colonne correspond à un usage spécifique avec des modules clés et des pages dédiées pour aller plus loin.</p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {solutions.map((solution, index) => (
                        <motion.article
                            key={solution.title}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.35, delay: index * 0.05 }}
                            className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/15 backdrop-blur-md"
                        >
                            <p className="text-sm uppercase tracking-[0.35em] text-blue-200">{solution.title}</p>
                            <h3 className="mt-3 text-2xl font-bold text-white">{solution.title}</h3>
                            <p className="mt-3 text-sm text-slate-300">{solution.description}</p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-100">
                                {solution.items.map((item) => (
                                    <li key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">• {item}</li>
                                ))}
                            </ul>
                            <Link href={solution.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                                Ouvrir la page dédiée
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

import { Footer } from "../../component/components/Footer";
import { TopNavBar } from "../../component/components/TopNavBar";

const solutionsPages = {
  team: {
    title: "Team",
    summary: "Un espace de travail orienté productivité pour les équipes qui doivent gérer stockage, tâches, communication et partage de fichiers.",
    items: ["Storage", "Task", "Manage workers", "Chat", "Share files"],
  },
  company: {
    title: "Company",
    summary: "Une vue adaptée aux structures plus larges avec des profils métiers variés et des besoins de collaboration avancés.",
    items: ["Entreprise", "Civil engineer", "Architect", "Bureau de contrôle", "Collaboration"],
  },
  industry: {
    title: "Industry",
    summary: "Un cadre pensé pour les environnements industriels avec contrôle, validation, gestion de projet et suivi des équipes.",
    items: ["Gestion entreprise", "Gestion projet", "Gestion d’équipe", "Chat", "Versioning", "Validation"],
  },
} as const;

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = solutionsPages[slug as keyof typeof solutionsPages];

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--on-surface)]">
      <TopNavBar />
      <main className="pt-24 pb-16">
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-100"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--primary)]">Solutions</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--on-surface)] sm:text-5xl">{page.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-[var(--on-surface-variant)]">{page.summary}</p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">← Retour à la landing page</Link>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-100"
            >
              <h2 className="text-2xl font-bold text-[var(--on-surface)]">Fonctionnalités principales</h2>
              <ul className="mt-6 space-y-3 text-sm text-[var(--on-surface)]">
                {page.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-200 bg-[var(--surface-container)] px-4 py-3">• {item}</li>
                ))}
              </ul>
            </motion.article>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-3xl border border-slate-200 bg-[linear-gradient(145deg,#0f172a,#172554)] p-8 text-white shadow-xl shadow-slate-200"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Approche</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">Une page dédiée par usage</h3>
              <p className="mt-4 text-sm text-slate-200">Chaque solution peut maintenant être détaillée séparément, avec ses propres modules, cas d’usage et parcours utilisateur.</p>
            </motion.aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

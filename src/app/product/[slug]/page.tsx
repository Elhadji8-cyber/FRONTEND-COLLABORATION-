"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

import { Footer } from "../../component/components/Footer";
import { TopNavBar } from "../../component/components/TopNavBar";

const productPages = {
  "project-manager": {
    title: "Project Manager",
    eyebrow: "Product",
    summary: "Pilotez vos projets avec des vues claires, des jalons, des priorités et des suivis de progression.",
    bullets: ["Planning et périmètre", "Tâches, responsabilités et jalons", "Suivi des avancements en temps réel"],
  },
  pyw: {
    title: "PYW",
    eyebrow: "Product",
    summary: "Centralisez vos besoins métiers et vos workflows pour automatiser les décisions clés.",
    bullets: ["Processus métier standardisés", "Décisions centralisées", "Suivi des points d’attention"],
  },
  chat: {
    title: "Chat",
    eyebrow: "Product",
    summary: "Discutez avec vos équipes dans un espace intégré au cœur du projet.",
    bullets: ["Conversations contextuelles", "Échanges rapides et structurés", "Historique et partage de décisions"],
  },
  versioning: {
    title: "Versioning",
    eyebrow: "Product",
    summary: "Gardez un historique fiable de chaque évolution, preuve et validation.",
    bullets: ["Versions documentées", "Historique détaillé", "Validation des livrables"],
  },
  "files-tracker": {
    title: "Files Tracker",
    eyebrow: "Product",
    summary: "Suivez vos fichiers, leurs versions et leurs statuts sans perdre de vue le contexte.",
    bullets: ["Détection des fichiers à valider", "Suivi des versions", "Contrôle des livrables"],
  },
  collaboration: {
    title: "Collaboration",
    eyebrow: "Product",
    summary: "Unifiez vos équipes, vos fichiers et vos actions dans un seul espace de travail.",
    bullets: ["Collaboration multi-rôles", "Partage de documents", "Visibilité sur les tâches"],
  },
} as const;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = productPages[slug as keyof typeof productPages];

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
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--primary)]">{page.eyebrow}</p>
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
              <h2 className="text-2xl font-bold text-[var(--on-surface)]">Pourquoi cela compte</h2>
              <p className="mt-4 text-[var(--on-surface-variant)]">Ce module complète votre système en apportant une valeur précise pour vos équipes, vos projets et vos livrables.</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--on-surface)]">
                {page.bullets.map((item) => (
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
              <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Usage</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">Une page dédiée pour chaque module</h3>
              <p className="mt-4 text-sm text-slate-200">Ce format vous permet d’ouvrir les fonctions individuellement, de les présenter proprement et de guider vos utilisateurs vers la bonne fonctionnalité.</p>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4">
                <div className="h-28 rounded-2xl bg-[linear-gradient(135deg,rgba(191,219,254,0.2),rgba(30,41,59,0.8))]" />
                <div className="mt-4 h-3 w-24 rounded-full bg-white/70" />
                <div className="mt-2 h-3 w-32 rounded-full bg-white/35" />
              </div>
            </motion.aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

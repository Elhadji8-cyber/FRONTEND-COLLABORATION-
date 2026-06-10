import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import photo from "./image/téléchargement (1).png";
import { Briefcase, FolderKanban, MessagesSquare, Sparkles, Users, Workflow } from "lucide-react";

const productItems = [
    { title: "Project Manager", description: "Planifier, suivre et piloter les tâches avec une vue d’ensemble claire.", href: "/product/project-manager", icon: Briefcase },
    { title: "PYW", description: "Centraliser les workflows métiers pour accélérer la prise de décision.", href: "/product/pyw", icon: Workflow },
    { title: "Chat", description: "Collaborer en temps réel avec des conversations contextuelles et sécurisées.", href: "/product/chat", icon: MessagesSquare },
    { title: "Versioning", description: "Garder un historique précis des évolutions de chaque livrable.", href: "/product/versioning", icon: Sparkles },
    { title: "Files Tracker", description: "Suivre les fichiers, versions et validations sans perdre de vue les dossiers.", href: "/product/files-tracker", icon: FolderKanban },
    { title: "Collaboration", description: "Unifier les équipes autour d’un espace de travail cohérent et partagé.", href: "/product/collaboration", icon: Users },
];

export const FeaturesSection = () => {
    return (
        <>
        <section id="product" className="bg-[var(--surface)] py-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35 }}
                    className="mb-14 max-w-3xl sm:mb-20"
                >
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">Product</p>
                    <h2 className="mb-4 text-3xl font-black tracking-[-0.06em] text-[var(--on-surface)] sm:text-4xl">
                        Un produit pensé pour piloter vos projets, vos fichiers et vos équipes.
                    </h2>
                    <p className="text-base text-[var(--on-surface-variant)] sm:text-lg">
                        Chaque module est conçu pour vous donner un espace clair, moderne et performant, avec des pages dédiées pour chaque fonction.
                    </p>
                </motion.div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="grid gap-6 md:grid-cols-2">
                        {productItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.35, delay: index * 0.04 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100 transition hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[color:rgba(0,74,198,0.12)]"
                                    >
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-container)] text-[var(--primary)]">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-[var(--on-surface)]">{item.title}</h3>
                                        <p className="mb-5 text-sm text-[var(--on-surface-variant)]">{item.description}</p>
                                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                                            Voir la page dédiée
                                            <span className="transition group-hover:translate-x-1">→</span>
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.aside
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1e3a8a_100%)] p-6 text-white shadow-xl shadow-slate-200"
                    >
                        <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Blog</p>
                        <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">Monoolith le système de gestion de projet</h3>
                        <p className="mt-4 text-sm text-slate-200">
                            Découvrez comment Monoolith centralise collaboration, gestion et suivi dans un espace de travail moderne et performant.
                        </p>
                        <div className="mt-8 rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                        
                            <div className=" rounded-2xl " />
                            <Image
                                src={photo}
                                alt="Photo de blog"
                                priority
                                loading="eager"
                                className="mt-2 h-full w-full rounded-2xl object-cover bg-white/45"
                            />
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <div>
                                    <div className="h-3 w-20 rounded-full bg-white/70" />   
                                    <div className="mt-2 h-3 w-28 rounded-full bg-white/45" />
                                </div>
                                <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-blue-100">Preview</span>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </section>

        <section id="blog" className="bg-[var(--surface-container-low)] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.article
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-100"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm uppercase tracking-[0.35em] text-[var(--primary)]">Blog</p>
                        <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--on-surface-variant)]">Collaboration • Fichiers • Productivité</span>
                    </div>

                    <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        <div>
                            <h3 className="text-2xl font-black tracking-[-0.04em] text-[var(--on-surface)] sm:text-3xl lg:text-4xl">
                                Pourquoi les équipes perdent du temps à gérer leurs fichiers de projet
                            </h3>
                            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--on-surface-variant)] sm:text-lg">
                                Dans de nombreuses entreprises, les fichiers de travail sont dispersés entre les emails, les groupes WhatsApp, les disques partagés et différents outils de stockage. Cette fragmentation entraîne souvent des pertes de temps, des erreurs de version et des difficultés de collaboration entre les équipes.
                            </p>
                            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--on-surface-variant)] sm:text-lg">
                                Lorsqu’un projet implique plusieurs intervenants, il devient essentiel de savoir qui a modifié un document, quelle est la dernière version disponible et quels travaux sont encore en attente de validation. C’est précisément pour répondre à ces défis que MONOOLITH a été conçu.
                            </p>
                        </div>

                        <aside className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#f8fafc_100%)] p-6 shadow-sm shadow-slate-100">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">En résumé</p>
                            <div className="mt-4 space-y-4 text-sm text-[var(--on-surface-variant)]">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    MONOOLITH centralise la collaboration autour des projets pour communiquer, partager des fichiers, suivre les versions et valider les travaux en un seul espace.
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    Grâce au système PYW, les collaborateurs peuvent soumettre leur travail directement depuis la plateforme, tandis que les responsables examinent, commentent et approuvent facilement.
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    L’objectif : gagner du temps, réduire les erreurs liées aux fichiers et garder une traçabilité complète de chaque décision.
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="mt-8 rounded-3xl border border-slate-200 bg-[var(--surface-container-low)] p-6 shadow-sm shadow-slate-100">
                        <p className="text-base leading-7 text-[var(--on-surface)] sm:text-lg">
                            MONOOLITH centralise la collaboration autour des projets en offrant un espace unique pour communiquer, partager des fichiers, suivre l’historique des versions et valider les travaux réalisés par les membres d’une équipe.
                        </p>
                        <p className="mt-4 text-base leading-7 text-[var(--on-surface-variant)] sm:text-lg">
                            Notre objectif est de permettre aux équipes de travailler plus efficacement, de réduire les erreurs liées aux fichiers et de conserver une traçabilité complète de chaque décision prise au cours d’un projet. Que vous travailliez dans le BTP, l’ingénierie, l’architecture ou toute autre activité basée sur des projets, MONOOLITH vous aide à transformer votre façon de collaborer.
                        </p>
                    </div>
                </motion.article>
            </div>
        </section>
        </>
    );
};

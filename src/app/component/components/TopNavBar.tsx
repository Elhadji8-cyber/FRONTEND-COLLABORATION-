import Link from "next/link";
import Image from "next/image";
import logo from "./image/noolith.png";
import {
    FiBookOpen,
    FiBriefcase,
    FiChevronDown,
    FiFolder,
    FiLayers,
    FiMessageSquare,
    FiShield,
    FiUsers,
    FiActivity,
} from "react-icons/fi";


const productItems = [
    { label: "Project Manager", description: "Planifier, suivre et piloter les tâches.", href: "/product/project-manager", icon: FiBriefcase },
    { label: "PYW", description: "Centraliser les workflows métier et les décisions.", href: "/product/pyw", icon: FiActivity },
    { label: "Chat", description: "Collaborer avec vos équipes en temps réel.", href: "/product/chat", icon: FiMessageSquare },
    { label: "Versioning", description: "Historique des versions et validations.", href: "/product/versioning", icon: FiLayers },
    { label: "Files Tracker", description: "Suivre les livrables et les dossiers.", href: "/product/files-tracker", icon: FiFolder },
    { label: "Collaboration", description: "Unifier les rôles, les fichiers et les échanges.", href: "/product/collaboration", icon: FiUsers },
];

const solutionItems = [
    { label: "Team", description: "Storage, tâches, workers et partage de fichiers.", href: "/solutions/team", icon: FiShield },
    { label: "Company", description: "Organisation, métiers et collaboration d’entreprise.", href: "/solutions/company", icon: FiUsers },
    { label: "Industry", description: "Gestion projet, validation et contrôle qualité.", href: "/solutions/industry", icon: FiLayers },
];

export const TopNavBar = () => {
    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[rgba(250,248,255,0.88)] shadow-sm shadow-[color:rgba(0,74,198,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3 px-2 py-1">
                    <Image src={logo} alt="Monoolith logo" className="h-12 w-16 rounded-full object-cover" />
                    <span className="text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">Monoolith</span>
                </Link>

                <div className="hidden items-center gap-1 md:flex">
                    <div className="group relative">
                        <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none">
                            Product
                            <FiChevronDown className="text-xs" />
                        </button>
                        <div className="invisible absolute left-0 top-full z-50 mt-3 w-[640px] rounded-3xl border border-slate-200 bg-white p-4 opacity-0 shadow-2xl shadow-slate-200/80 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                                <div className="grid gap-2">
                                    {productItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700 transition hover:border-[var(--primary)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                                            >
                                                <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm shadow-slate-200">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span>
                                                    <span className="block font-semibold">{item.label}</span>
                                                    <span className="text-xs text-slate-500">{item.description}</span>
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <aside className="rounded-3xl bg-[linear-gradient(160deg,#eff6ff,#ffffff)] p-4 shadow-inner shadow-blue-100">
                                    <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--primary)]">Blog Monoolith</p>
                                    <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white/90 p-4 text-center text-xs text-slate-500">
                                        <Image src={logo} alt="Logo" className="mx-auto h-16 w-full object-contain" />
                                    </div>
                                    <p className="mt-4 text-sm text-slate-600">Découvrez comment Monoolith centralise collaboration, gestion et suivi dans un espace de travail moderne et performant.</p>
                                    <Link
                                        href="#blog"
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                                    >
                                        <FiBookOpen className="h-4 w-4" />
                                        Read the blog
                                    </Link>
                                </aside>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none">
                            Solutions
                            <FiChevronDown className="text-xs" />
                        </button>
                        <div className="invisible absolute left-0 top-full z-50 mt-3 w-[420px] rounded-3xl border border-slate-200 bg-white p-3 opacity-0 shadow-2xl shadow-slate-200/80 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                            {solutionItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-start gap-3 rounded-2xl p-3 text-sm text-slate-700 transition hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                                    >
                                        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-container)] text-[var(--primary)]">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span>
                                            <span className="block font-semibold">{item.label}</span>
                                            <span className="text-xs text-slate-500">{item.description}</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <Link
                        className="rounded-full px-4 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                        href="#pricing"
                    >
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/auth/login" className="hidden px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:inline-flex">
                        Sign In
                    </Link>
                    <Link href="/auth/register" className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-[var(--on-primary)] transition-all duration-150 active:scale-95 sm:px-6">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

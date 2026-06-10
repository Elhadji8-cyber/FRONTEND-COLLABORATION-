"use client";

import Link from "next/link";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { SendIcon } from "./icons";

export const Footer = () => {
    const [openPanel, setOpenPanel] = useState<"privacy" | "terms" | null>(null);

    const productLinks = [
        { label: "Cloud Storage", href: "/product/files-tracker" },
        { label: "Real-time Chat", href: "/product/chat" },
        { label: "Version Control", href: "/product/versioning" },
    ];

    return (
        <footer className="w-full border-t border-slate-200 bg-slate-100">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
                <div>
                    <div className="mb-4 text-lg font-bold text-slate-900">MONOO LITH</div>
                    <p className="mb-6 text-sm text-slate-500">
                        Structural intelligence for the modern world. Built by engineers,
                        for engineers.
                    </p>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-slate-900">Products</h4>
                    <ul className="space-y-2">
                        {productLinks.map((item) => (
                            <li key={item.label}>
                                <Link
                                    className="text-sm text-slate-500 transition-colors hover:text-blue-600"
                                    href={item.href}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-slate-900">Legal</h4>
                    <div className="space-y-2">
                        <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <button
                                type="button"
                                className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-700"
                                onClick={() => setOpenPanel(openPanel === "privacy" ? null : "privacy")}
                            >
                                Privacy Policy
                                <FiChevronDown className={`transition ${openPanel === "privacy" ? "rotate-180" : ""}`} />
                            </button>
                            {openPanel === "privacy" ? (
                                <p className="mt-3 text-sm text-slate-500">
                                    We protect your data, limit access to what is necessary, and keep your information secure across the Monoolith workspace.
                                </p>
                            ) : null}
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <button
                                type="button"
                                className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-700"
                                onClick={() => setOpenPanel(openPanel === "terms" ? null : "terms")}
                            >
                                Terms of Service
                                <FiChevronDown className={`transition ${openPanel === "terms" ? "rotate-180" : ""}`} />
                            </button>
                            {openPanel === "terms" ? (
                                <p className="mt-3 text-sm text-slate-500">
                                    These terms define how users access Monoolith services, collaborate within projects, and use shared files and modules.
                                </p>
                            ) : null}
                        </article>
                    </div>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-slate-900">Newsletter</h4>
                    <div className="flex gap-2">
                        <input
                            className="w-full rounded-lg border-none bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="Email"
                            type="email"
                        />
                        <button className="rounded-lg bg-[var(--primary)] p-2 text-white">
                            <SendIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto border-t border-slate-200 px-4 py-8 text-center sm:px-6 lg:max-w-7xl lg:px-8">
                <p className="text-sm text-slate-500">
                    © 2024 Monoolith Engineering Systems. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

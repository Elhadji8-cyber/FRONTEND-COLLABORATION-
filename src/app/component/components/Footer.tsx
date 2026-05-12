import { SendIcon } from "./icons";
export const Footer = () => {
    return (
        <footer className="w-full border-t border-slate-200 bg-slate-100">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
                <div>
                    <div className="mb-4 text-lg font-bold text-slate-900">MONOLITH</div>
                    <p className="mb-6 text-sm text-slate-500">
                        Structural intelligence for the modern world. Built by engineers,
                        for engineers.
                    </p>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-slate-900">Products</h4>
                    <ul className="space-y-2">
                        <li>
                            <a className="text-sm text-slate-500 transition-colors hover:text-blue-600" href="#">
                                Cloud Storage
                            </a>
                        </li>
                        <li>
                            <a className="text-sm text-slate-500 transition-colors hover:text-blue-600" href="#">
                                Real-time Chat
                            </a>
                        </li>
                        <li>
                            <a className="text-sm text-slate-500 transition-colors hover:text-blue-600" href="#">
                                Version Control
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-slate-900">Legal</h4>
                    <ul className="space-y-2">
                        <li>
                            <a className="text-sm text-slate-500 transition-colors hover:text-blue-600" href="#">
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a className="text-sm text-slate-500 transition-colors hover:text-blue-600" href="#">
                                Terms of Service
                            </a>
                        </li>
                    </ul>
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
                    © 2024 Monolith Engineering Systems. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

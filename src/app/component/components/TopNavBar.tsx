import Link from "next/link";
import Image from "next/image";
import logo from "./image/lo-go-removebg-preview.png";
export const TopNavBar = () => {
    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[rgba(250,248,255,0.8)] backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className=" px-2 py-1">
                    <Image src={logo} alt="Logo" className="h-17 w-25 rounded-full" />
                    
                </div>

                <div className="hidden items-center gap-8 md:flex">
                    <a
                        className="border-b-2 border-[var(--primary)] pb-1 text-sm font-semibold tracking-tight text-[var(--primary)]"
                        href="#features"
                    >
                        Features
                    </a>
                    <a
                        className="text-sm tracking-tight text-slate-600 transition-colors hover:text-slate-900"
                        href="#solutions"
                    >
                        Solutions
                    </a>
                    <a
                        className="text-sm tracking-tight text-slate-600 transition-colors hover:text-slate-900"
                        href="#pricing"
                    >
                        Pricing
                    </a>
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

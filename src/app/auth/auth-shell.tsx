// src/components/auth/auth-shell.tsx
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthVisualPanel } from "./auth-visual-panel";
import logo from "../component/components/image/lo-go-removebg-preview.png";

type AuthShellProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  children: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  footerText,
  footerLinkLabel,
  footerHref,
  children,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen w-full flex-col md:h-screen md:flex-row">
      <section className="z-10 flex w-full flex-col justify-between bg-surface p-8 md:w-[45%] md:p-12 lg:w-[40%] lg:p-20">
        <header className="flex items-center gap-3">
          <div className="flex h-19 w-20 items-center justify-center rounded-lg ">
            <Image
              src={logo}
              alt="Monolith logo"
              className=" h-19 w-20 object-contain"
              width={32}
              height={32}
            />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-on-surface">
            Monolith
          </h1>
        </header>

        <div className="mx-auto w-full max-w-md py-12 md:mx-0">
          <div className="mb-10">
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">
              {title}
            </h2>
            <p className="font-medium text-on-surface-variant">{subtitle}</p>
          </div>

          {children}
        </div>

        <footer className="pt-8">
          <p className="text-sm font-medium text-on-surface-variant">
            {footerText}{" "}
            <Link
              href={footerHref}
              className="font-bold text-primary hover:underline"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </footer>
      </section>

      <AuthVisualPanel />
    </main>
  );
}

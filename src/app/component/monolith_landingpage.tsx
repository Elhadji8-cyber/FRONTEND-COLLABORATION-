"use client";

import type { CSSProperties } from "react";

import { ComparisonSection } from "./components/ComparisonSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { FinalCtaSection } from "./components/FinalCtaSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { SocialProofSection } from "./components/SocialProofSection";
import { TopNavBar } from "./components/TopNavBar";

export function MonolithLanding() {
    return (
        <div
            className="bg-[var(--background)] font-sans text-[var(--on-surface)] selection:bg-[var(--primary-fixed)] selection:text-[var(--on-primary-fixed)]"
            style={
                {
                    "--primary-container": "#2563eb",
                    "--surface-tint": "#0053db",
                    "--on-secondary-container": "#54647a",
                    "--on-secondary-fixed": "#0b1c30",
                    "--surface-variant": "#dae2fd",
                    "--outline-variant": "#c3c6d7",
                    "--error": "#ba1a1a",
                    "--primary-fixed": "#dbe1ff",
                    "--tertiary-fixed-dim": "#ffb690",
                    "--on-primary-container": "#eeefff",
                    "--tertiary-container": "#b54e00",
                    "--secondary": "#505f76",
                    "--surface-container-highest": "#dae2fd",
                    "--tertiary": "#8e3c00",
                    "--on-tertiary": "#ffffff",
                    "--outline": "#737686",
                    "--error-container": "#ffdad6",
                    "--on-tertiary-fixed-variant": "#783200",
                    "--on-primary": "#ffffff",
                    "--tertiary-fixed": "#ffdbca",
                    "--inverse-primary": "#b4c5ff",
                    "--background": "#faf8ff",
                    "--on-primary-fixed-variant": "#003ea8",
                    "--surface-container-lowest": "#ffffff",
                    "--surface-container-high": "#e2e7ff",
                    "--primary-fixed-dim": "#b4c5ff",
                    "--on-secondary-fixed-variant": "#38485d",
                    "--secondary-container": "#d0e1fb",
                    "--surface": "#faf8ff",
                    "--surface-container": "#eaedff",
                    "--inverse-surface": "#283044",
                    "--surface-dim": "#d2d9f4",
                    "--surface-bright": "#faf8ff",
                    "--on-error": "#ffffff",
                    "--on-tertiary-container": "#ffece5",
                    "--on-background": "#131b2e",
                    "--on-error-container": "#93000a",
                    "--inverse-on-surface": "#eef0ff",
                    "--surface-container-low": "#f2f3ff",
                    "--on-secondary": "#ffffff",
                    "--primary": "#004ac6",
                    "--secondary-fixed-dim": "#b7c8e1",
                    "--on-surface-variant": "#434655",
                    "--on-surface": "#131b2e",
                    "--secondary-fixed": "#d3e4fe",
                    "--on-tertiary-fixed": "#341100",
                    "--on-primary-fixed": "#00174b",
                } as CSSProperties
            }
        >
            <TopNavBar />
            <main className="pt-20">
                <HeroSection />
                <SocialProofSection />
                <FeaturesSection />
                <ComparisonSection />
                <FinalCtaSection />
            </main>
            <Footer />
        </div>
    );
}

export default MonolithLanding;
// src/components/ui/section-title.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionTitleProps = {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
};

export function SectionTitle({
    title,
    subtitle,
    action,
    className,
}: SectionTitleProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
                className,
            )}
        >
            <div>
                <h2 className="text-xl font-bold tracking-tight text-on-surface">
                    {title}
                </h2>

                {subtitle ? (
                    <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
                ) : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}

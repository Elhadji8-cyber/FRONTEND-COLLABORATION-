// src/components/ui/badge.tsx
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "danger"
    | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    variant?: BadgeVariant;
};

export function Badge({
    children,
    className,
    variant = "neutral",
    ...props
}: BadgeProps) {
    const variantClasses: Record<BadgeVariant, string> = {
        primary: "bg-primary-container/15 text-primary",
        secondary: "bg-secondary-container/40 text-secondary",
        tertiary: "bg-tertiary-container/20 text-tertiary",
        success: "bg-green-100 text-green-700",
        danger: "bg-error-container text-error",
        neutral: "bg-surface-container-high text-on-surface-variant",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// src/components/ui/button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
};

export function Button({
    children,
    className,
    variant = "primary",
    size = "md",
    fullWidth = false,
    type = "button",
    ...props
}: ButtonProps) {
    const variantClasses: Record<ButtonVariant, string> = {
        primary:
            "bg-primary text-white shadow-sm hover:brightness-110 active:scale-[0.98]",
        secondary:
            "bg-surface-container-highest text-on-secondary-container hover:brightness-95",
        ghost:
            "bg-transparent text-on-surface hover:bg-surface-container-low",
        danger:
            "bg-error text-on-error hover:brightness-95 active:scale-[0.98]",
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: "px-3 py-2 text-xs font-semibold",
        md: "px-4 py-2.5 text-sm font-semibold",
        lg: "px-6 py-3 text-sm font-bold",
    };

    return (
        <button
            type={type}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && "w-full",
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

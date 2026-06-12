// src/components/ui/card.tsx
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-[1.5rem] border border-outline-variant/30 bg-surface-container-lowest shadow-sm",
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("text-lg font-semibold tracking-tight text-on-surface", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn("text-sm text-on-surface-variant", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export function CardAction({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex items-center gap-2", className)} {...props} />;
}

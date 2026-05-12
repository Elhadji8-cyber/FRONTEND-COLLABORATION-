// src/components/ui/table.tsx
import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type WrapperProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
};

export function TableWrapper({
    children,
    className,
    ...props
}: WrapperProps) {
    return (
        <div className={cn("overflow-x-auto rounded-2xl", className)} {...props}>
            {children}
        </div>
    );
}

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
    children: ReactNode;
};

export function Table({ children, className, ...props }: TableProps) {
    return (
        <table className={cn("w-full border-collapse text-left", className)} {...props}>
            {children}
        </table>
    );
}

type SectionProps = HTMLAttributes<HTMLTableSectionElement> & {
    children: ReactNode;
};

export function TableHead({ children, className, ...props }: SectionProps) {
    return (
        <thead className={cn("bg-surface-container-low", className)} {...props}>
            {children}
        </thead>
    );
}

export function TableBody({ children, className, ...props }: SectionProps) {
    return (
        <tbody className={cn("divide-y divide-outline-variant/10", className)} {...props}>
            {children}
        </tbody>
    );
}

type RowProps = HTMLAttributes<HTMLTableRowElement> & {
    children: ReactNode;
};

export function TableRow({ children, className, ...props }: RowProps) {
    return (
        <tr
            className={cn("transition-colors hover:bg-surface-container-low", className)}
            {...props}
        >
            {children}
        </tr>
    );
}

type CellProps = HTMLAttributes<HTMLTableCellElement> & {
    children: ReactNode;
};

export function TableHeaderCell({
    children,
    className,
    ...props
}: CellProps) {
    return (
        <th
            className={cn(
                "px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant",
                className,
            )}
            {...props}
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className, ...props }: CellProps) {
    return (
        <td className={cn("px-6 py-4 text-sm text-on-surface", className)} {...props}>
            {children}
        </td>
    );
}

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
            {...props}
        />
    );
}

export function CloudIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M7 18a4 4 0 1 1 .8-7.92A5.5 5.5 0 0 1 18 12.5h.5a3.5 3.5 0 1 1 0 7H7Z" />
        </BaseIcon>
    );
}

export function GroupsIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="3" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 4.13a4 4 0 0 1 0 7.75" />
        </BaseIcon>
    );
}

export function HistoryIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M3 3v5h5" />
            <path d="M3.05 13a9 9 0 1 0 2.13-5.83L3 8" />
            <path d="M12 7v5l3 2" />
        </BaseIcon>
    );
}

export function ShieldIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3Z" />
            <path d="m9.5 12 1.8 1.8 3.7-3.8" />
        </BaseIcon>
    );
}

export function UsbIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 3v8" />
            <path d="m9 6 3-3 3 3" />
            <path d="M12 11a3 3 0 0 0-3 3v2" />
            <path d="M15 13a2 2 0 0 1 2 2v4" />
            <path d="M7 19h4" />
            <path d="M15 19h4" />
        </BaseIcon>
    );
}

export function SyncIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M3 12a9 9 0 0 1 15.3-6.3L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.3 6.3L3 16" />
            <path d="M8 16H3v5" />
        </BaseIcon>
    );
}

export function ArchitectureIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m4 20 8-16 8 16" />
            <path d="M7 14h10" />
            <path d="M9 20h6" />
        </BaseIcon>
    );
}

export function SendIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        </BaseIcon>
    );
}
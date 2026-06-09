"use client";

import type { User } from "@/types/user";

type ChatHeaderProps = {
    title: string;
    subtitle: string;
    memberAvatars?: Array<{ id: string; name: string; avatarUrl?: string }>;
    totalMembersCount?: number;
    onMembersClick?: () => void;
};

export function MessageHeader({
    title,
    subtitle,
    memberAvatars = [],
    totalMembersCount = 0,
    onMembersClick,
}: ChatHeaderProps) {
    const displayAvatars = memberAvatars.slice(0, 3);
    const remainingCount = totalMembersCount - displayAvatars.length;

    return (
        <header className="flex h-16 items-center justify-between border-b border-outline-variant/10 bg-surface px-4 sm:px-6 lg:px-8">
            <div>
                <h1 className="flex items-center gap-2 text-lg font-bold text-on-surface">
                    {title}
                    <span className="material-symbols-outlined text-sm opacity-40">star</span>
                </h1>
                <p className="text-[11px] font-medium tracking-wide text-on-surface-variant">
                    {subtitle}
                </p>
            </div>

            <div className="hidden items-center gap-6 lg:flex">
                <button
                    onClick={onMembersClick}
                    className="flex -space-x-2 rounded-full hover:opacity-80 transition cursor-pointer"
                    title="Voir les membres"
                >
                    {displayAvatars.map((member) => (
                        <div
                            key={member.id}
                            className="h-7 w-7 rounded-full border-2 border-surface flex-shrink-0 overflow-hidden"
                        >
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    ))}
                    {remainingCount > 0 && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-surface-container-highest text-[10px] font-bold text-primary flex-shrink-0">
                            +{remainingCount}
                        </div>
                    )}
                </button>

                <div className="h-8 w-px bg-outline-variant/20" />

                <button
                    onClick={onMembersClick}
                    className="cursor-pointer text-on-surface-variant transition hover:text-primary"
                    title="Voir les détails"
                >
                    <span className="material-symbols-outlined">info</span>
                </button>
            </div>
        </header>
    );
}

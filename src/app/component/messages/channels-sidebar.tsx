import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type ChannelItem = {
    id: string;
    name: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
};

export type DirectMessageItem = {
    id: string;
    name: string;
    href?: string;
    online?: boolean;
    active?: boolean;
    onClick?: () => void;
    avatarUrl?: string;
};

type ChannelsSidebarProps = {
    channels: ChannelItem[];
    directMessages: DirectMessageItem[];
    canCreate?: boolean; // Indique si l'utilisateur peut créer des conversations
    onAddChannel?: () => void; // Fonction appelée lors du clic sur +
};

export function ChannelsSidebar({
    channels,
    directMessages,
    canCreate = false,
    onAddChannel,
}: ChannelsSidebarProps) {
    return (
        <aside className="hidden w-80 shrink-0 border-r border-outline-variant/10 bg-surface-container-low p-6 xl:block h-full overflow-y-auto chat-scrollbar">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <p className="font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                        Channels
                    </p>
                    {/* Le bouton n'apparaît que si l'utilisateur a la permission de créer */}
                    {canCreate && (
                        <button 
                            onClick={onAddChannel} 
                            className="text-on-surface-variant transition hover:text-primary"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    )}
                </div>

                <div className="mt-3 space-y-1">
                    {channels.map((channel) => {
                        const className = cn(
                            "flex flex-1 items-center rounded-md px-3 py-2 text-left text-sm transition",
                            channel.active
                                ? "bg-surface-variant font-bold text-primary"
                                : "text-on-surface-variant hover:bg-surface-container"
                        );
                        return (
                            <div key={channel.id} className="group flex items-center w-full">
                                {channel.onClick ? (
                                    <button type="button" onClick={channel.onClick} className={className}>
                                        <span className="mr-2 opacity-60">#</span>
                                        <span className="truncate flex-1">{channel.name}</span>
                                    </button>
                                ) : (
                                    <Link href={channel.href || "#"} className={className}>
                                        <span className="mr-2 opacity-60">#</span>
                                        <span className="truncate flex-1">{channel.name}</span>
                                    </Link>
                                )}
                                {channel.onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            channel.onDelete!();
                                        }}
                                        className="ml-2 hidden text-on-surface-variant hover:text-error group-hover:block"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-outline-variant/10 pt-6">
                <p className="mb-3 font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    Direct Messages
                </p>

                <div className="space-y-1">
                    {directMessages.map((dm) => {
                        const avatarSrc = dm.avatarUrl || "/default-avatar.png";
                        const content = (
                            <>
                                <div className="relative flex-shrink-0">
                                    {dm.avatarUrl && dm.avatarUrl.startsWith("data:image/") ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={dm.avatarUrl}
                                            alt={`${dm.name}'s avatar`}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={avatarSrc}
                                            alt={`${dm.name}'s avatar`}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                            style={{ width: 32, height: 32 }}
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-surface-container-low",
                                            dm.online ? "bg-green-500" : "bg-gray-400"
                                        )}
                                    />
                                </div>
                                <span className="truncate flex-1">{dm.name}</span>
                            </>
                        );

                        const dmClass = cn(
                            "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition",
                            dm.active
                                ? "bg-surface-variant text-primary font-semibold"
                                : "text-on-surface-variant hover:bg-surface-container"
                        );

                        return dm.onClick ? (
                            <button
                                key={dm.id}
                                type="button"
                                onClick={dm.onClick}
                                className={dmClass}
                            >
                                {content}
                            </button>
                        ) : (
                            <Link
                                key={dm.id}
                                href={dm.href || "#"}
                                className={dmClass}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/*
        TODO: brancher ici ton backend Go.

        Pour les channels / conversations :
        GET /api/v1/users/:id/conversations

        Tu peux ensuite mapper :
        - conversations de type GROUP -> channels
        - conversations de type DIRECT -> direct messages

        Plus tard, tu pourras aussi ajouter :
        POST /api/v1/conversations
        POST /api/v1/conversations/:id/members
      */}
        </aside>
    );
}

// src/components/messages/message-bubble.tsx
import Image from "next/image";
import { cn } from "@/lib/cn";

export type MessageAttachment = {
    id: string;
    fileName: string;
    fileSize?: string;
    fileType?: string;
    downloadUrl?: string;
};

export type MessageBubbleProps = {
    id: string;
    senderName: string;
    senderAvatar?: string;
    content?: string;
    sentAt: string;
    isOwn?: boolean;
    attachments?: MessageAttachment[];
    status?: "sent" | "delivered" | "read";
    reactions?: Array<{
        emoji: string;
        count: number;
    }>;
};

export function MessageBubble({
    senderName,
    senderAvatar,
    content,
    sentAt,
    isOwn = false,
    attachments = [],
    status = "sent",
    reactions = [],
}: MessageBubbleProps) {
    const hasContent = Boolean(content?.trim());
    const hasAttachments = attachments.length > 0;

    return (
        <article
            className={cn(
                "flex w-full gap-3",
                isOwn ? "justify-end" : "justify-start",
            )}
        >
            {!isOwn && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high">
                    {senderAvatar ? (
                        <Image
                            src={senderAvatar}
                            alt={senderName}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                            {senderName.slice(0, 1).toUpperCase()}
                        </div>
                    )}
                </div>
            )}

            <div
                className={cn(
                    "min-w-0 max-w-[80%] sm:max-w-[75%]",
                    isOwn ? "items-end" : "items-start",
                    "flex flex-col gap-2",
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-2 text-xs text-on-surface-variant",
                        isOwn ? "justify-end" : "justify-start",
                    )}
                >
                    {!isOwn && <span className="font-semibold text-on-surface">{senderName}</span>}
                    <span>{sentAt}</span>
                    {isOwn && (
                        <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            {status}
                        </span>
                    )}
                </div>

                {(hasContent || hasAttachments) && (
                    <div
                        className={cn(
                            "inline-block w-fit max-w-full min-w-0 overflow-hidden rounded-2xl border px-4 py-3 shadow-sm",
                            isOwn
                                ? "border-primary/20 bg-primary text-on-primary"
                                : "border-outline-variant/20 bg-surface-container-lowest text-on-surface",
                        )}
                    >
                        {hasContent && (
                            <p
                                className={cn(
                                    "overflow-hidden whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed",
                                    isOwn ? "text-on-primary" : "text-on-surface",
                                )}
                            >
                                {content}
                            </p>
                        )}

                        {hasAttachments && (
                            <div className={cn("space-y-2", hasContent ? "mt-4" : "")}>
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className={cn(
                                            "flex items-center justify-between gap-3 rounded-xl border px-3 py-3",
                                            isOwn
                                                ? "border-white/20 bg-white/10"
                                                : "border-outline-variant/20 bg-surface-container",
                                        )}
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className={cn(
                                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                                    isOwn
                                                        ? "bg-white/15 text-on-primary"
                                                        : "bg-primary/10 text-primary",
                                                )}
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    📄
                                                </span>
                                            </div>

                                            <div className="min-w-0">
                                                <p
                                                    className={cn(
                                                        "truncate text-sm font-semibold",
                                                        isOwn ? "text-on-primary" : "text-on-surface",
                                                    )}
                                                >
                                                    {attachment.fileName}
                                                </p>
                                                <p
                                                    className={cn(
                                                        "text-xs",
                                                        isOwn ? "text-white/80" : "text-on-surface-variant",
                                                    )}
                                                >
                                                    {attachment.fileType || "Document"}
                                                    {attachment.fileSize ? ` • ${attachment.fileSize}` : ""}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className={cn(
                                                "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition",
                                                isOwn
                                                    ? "bg-white/15 text-on-primary hover:bg-white/20"
                                                    : "bg-surface-container-high text-primary hover:bg-surface-container-highest",
                                            )}
                                            onClick={() => {
                                                // TODO: brancher ici ton backend Go pour télécharger le fichier joint.
                                                // Exemple plus tard :
                                                // window.open(attachment.downloadUrl, "_blank");
                                                if (attachment.downloadUrl) {
                                                    window.open(attachment.downloadUrl, "_blank");
                                                }
                                            }}
                                        >
                                            Ouvrir
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {reactions.length > 0 && (
                    <div
                        className={cn(
                            "flex flex-wrap gap-2",
                            isOwn ? "justify-end" : "justify-start",
                        )}
                    >
                        {reactions.map((reaction, index) => (
                            <button
                                key={`${reaction.emoji}-${index}`}
                                type="button"
                                className="rounded-full border border-outline-variant/20 bg-surface-container-low px-2.5 py-1 text-xs font-semibold text-on-surface transition hover:bg-surface-container"
                            >
                                {reaction.emoji} {reaction.count}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isOwn && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high">
                    {senderAvatar ? (
                        <Image
                            src={senderAvatar}
                            alt={senderName}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                            {senderName.slice(0, 1).toUpperCase()}
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}

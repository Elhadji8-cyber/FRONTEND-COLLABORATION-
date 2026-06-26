"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { IoSearchOutline } from "react-icons/io5";

export function Topbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useAuth();
    const {
        notifications,
        unreadCount,
        isLoadingList,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        error,
    } = useNotifications();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [isOpen]);

    const handleToggle = async () => {
        if (!isOpen) {
            await refreshNotifications();
        }
        setIsOpen((current) => !current);
    };

    const handleNotificationClick = async (notification: { id: string; relatedId?: string | null }) => {
        await markAsRead(notification.id);
        setIsOpen(false);

        if (notification.relatedId) {
            router.push(`/messages?conversation_id=${notification.relatedId}`);
        }
    };

    const formatNotificationDate = (value: string) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return "à l'instant";
        if (diffMins < 60) return `il y a ${diffMins}m`;
        if (diffHours < 24) return `il y a ${diffHours}h`;
        if (diffDays < 7) return `il y a ${diffDays}j`;
        
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-outline-variant/10 bg-background/90 backdrop-blur lg:left-64">
            <div className="flex h-full items-center justify-between px-4 lg:px-12">
                <div className="hidden max-w-xl flex-1 lg:block">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                            <IoSearchOutline />
                        </span>
                        <input
                            type="text"
                            placeholder="Search blueprints, assets, or teams..."
                            className="w-full rounded-full border-none bg-surface-container-low py-2.5 pl-12 pr-4 text-sm outline-none ring-0"
                        />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-4 lg:gap-6 relative">
                    <div className="relative">
                        <button
                            onClick={handleToggle}
                            className="relative rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container"
                            aria-label="Notifications"
                        >
                            <IoNotificationsOutline size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-error px-1.5 text-[0.65rem] font-semibold text-on-error">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {isOpen && (
                            <div ref={dropdownRef} className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-variant shadow-lg">
                                <div className="flex items-center justify-between border-b border-outline-variant/20 px-4 py-3 text-sm font-semibold text-on-surface">
                                    <span>Notifications</span>
                                    {notifications.some((notification) => !notification.isRead) && (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                void markAllAsRead();
                                            }}
                                            className="text-xs font-medium text-primary transition hover:opacity-80"
                                        >
                                            Tout marquer comme lu
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {isLoadingList ? (
                                        <div className="p-4 text-sm text-on-surface-variant">Chargement des notifications...</div>
                                    ) : error ? (
                                        <div className="p-4 text-sm text-error">{error}</div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-4 text-sm text-on-surface-variant">Aucune notification.
                                        </div>
                                    ) : (
                                        notifications.map((notification) => {
                                            const hasConversation = Boolean(notification.relatedId);
                                            return (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => void handleNotificationClick(notification)}
                                                    className={`flex w-full gap-3 rounded-2xl border px-4 py-3 text-left transition hover:bg-primary/10 hover:text-on-primary ${notification.isRead ? "border-outline-variant/10 bg-surface-container-high" : "border-primary/30 bg-primary/5 ring-1 ring-primary/20"}`}
                                                >
                                                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                                                        {notification.title?.trim().charAt(0).toUpperCase() || "N"}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <span className="min-w-0 truncate text-sm font-semibold text-on-surface">
                                                                {notification.title}
                                                            </span>
                                                            <span className="shrink-0 text-[0.7rem] text-on-surface-variant">
                                                                {formatNotificationDate(notification.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 min-w-0 truncate text-sm text-on-surface-variant">
                                                            {notification.content}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.65rem] font-medium text-on-surface-variant">
                                                            {!notification.isRead && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />}
                                                            <span>{notification.isRead ? "Lue" : "Nouveau"}</span>
                                                            {hasConversation && (
                                                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                                                                    Conversation
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container">
                        <span className="material-symbols-outlined">settings</span>
                    </button>

                    <div className="flex items-center gap-3 rounded-full border border-outline-variant/50 bg-surface-container px-3 py-1">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-surface-container-highest text-sm font-semibold text-on-surface-variant">
                            {mounted && user?.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.name || "Utilisateur"}
                                    fill
                                    className="object-cover"
                                    sizes="36px"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center">
                                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                                </span>
                            )}
                        </div>
                        <div className="hidden min-w-[8rem] flex-col text-left md:flex">
                            <span className="text-sm font-semibold text-on-surface">
                                {user?.name || "Utilisateur"}
                            </span>
                            <span className="text-xs text-on-surface-variant">
                                Mon profil
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

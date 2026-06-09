import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { NotificationService } from "../services/notification.service";
import { NotificationSocketService } from "../services/notification-socket.service";
import { mapBackendNotification } from "../services/notification.service";
import type { Notification, NotificationSocketEvent } from "../types/notification";

export function useNotifications() {
  const { userId, companyId, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socket = useMemo(() => new NotificationSocketService(), []);

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await NotificationService.countUnread(userId, token || undefined);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to refresh unread notifications:", err);
      setError((err as Error)?.message || "Impossible de charger le compteur de notifications.");
    }
  }, [token, userId]);

  const refreshNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    setIsLoadingList(true);
    try {
      const list = await NotificationService.listByUser(userId, token || undefined);
      const sorted = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
      setError(null);
      await refreshUnreadCount();
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError((err as Error)?.message || "Impossible de charger les notifications.");
    } finally {
      setIsLoadingList(false);
    }
  }, [refreshUnreadCount, token, userId]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!notificationId) return;
      try {
        await NotificationService.markAsRead(notificationId, token || undefined);
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          )
        );
        await refreshUnreadCount();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        setError((err as Error)?.message || "Impossible de marquer la notification comme lue.");
      }
    },
    [refreshUnreadCount, token]
  );

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  useEffect(() => {
    if (!userId || !companyId || !token) {
      return;
    }

    socket.connect({
      token,
      companyId,
      onOpen: () => {
        console.debug("Notification WebSocket connected");
      },
      onClose: () => {
        console.debug("Notification WebSocket disconnected");
      },
      onError: (error) => {
        console.error("Notification WebSocket error:", error);
        setError("Impossible de se connecter au flux de notifications en temps réel.");
      },
      onEvent: (event: NotificationSocketEvent) => {
        if (event.type === "notification") {
          const incoming = mapBackendNotification(event.data);
          setNotifications((current) => {
            const next = current.filter((item) => item.id !== incoming.id);
            return [incoming, ...next];
          });
          if (!incoming.isRead) {
            setUnreadCount((current) => current + 1);
          }
        }

        if (event.type === "error") {
          setError(event.error.message);
        }
      },
    });

    return () => {
      socket.close();
    };
  }, [companyId, socket, token, userId]);

  return {
    notifications,
    unreadCount,
    isLoadingList,
    refreshNotifications,
    markAsRead,
    error,
  };
}

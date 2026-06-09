import { apiFetch } from "../lib/api";
import type { BackendNotification, Notification } from "../types/notification";

export function mapBackendNotification(notification: BackendNotification): Notification {
  return {
    id: notification._id || "",
    userId: notification.user_id,
    companyId: notification.company_id,
    title: notification.title,
    content: notification.content,
    relatedId: notification.related_id,
    isRead: notification.is_read,
    createdAt: notification.created_at,
  };
}

export class NotificationService {
  static async listByUser(userId: string, token?: string): Promise<Notification[]> {
    const notifications = await apiFetch<BackendNotification[]>(
      `/notifications?user_id=${encodeURIComponent(userId)}`,
      { token }
    );

    return notifications.map(mapBackendNotification);
  }

  static async countUnread(userId: string, token?: string): Promise<number> {
    const response = await apiFetch<{ unread_count: number }>(
      `/notifications/unread/count?user_id=${encodeURIComponent(userId)}`,
      { token }
    );

    return response.unread_count ?? 0;
  }

  static async markAsRead(notificationId: string, token?: string): Promise<void> {
    await apiFetch<void>(`/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: "PATCH",
      token,
    });
  }
}

export type BackendNotification = {
  _id?: string;
  user_id: string;
  company_id: string;
  title: string;
  content: string;
  related_id?: string | null;
  is_read: boolean;
  created_at: string;
};

export type Notification = {
  id: string;
  userId: string;
  companyId: string;
  title: string;
  content: string;
  relatedId?: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationSocketEvent =
  | {
      type: "notification";
      data: BackendNotification;
    }
  | {
      type: "error";
      error: {
        code?: string;
        message: string;
      };
    };

import { env } from "../config/env";
import type { BackendNotification } from "../types/notification";

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

export type NotificationSocketOptions = {
  token: string;
  companyId: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onEvent: (event: NotificationSocketEvent) => void;
};

export class NotificationSocketService {
  private socket?: WebSocket;
  private isConnected = false;

  connect(options: NotificationSocketOptions) {
    if (this.socket && this.isConnected) {
      return;
    }

    const url = new URL(env.wsUrl);
    url.searchParams.set("token", options.token);
    url.searchParams.set("company_id", options.companyId);

    this.socket = new WebSocket(url.toString());

    this.socket.addEventListener("open", () => {
      this.isConnected = true;
      options.onOpen?.();
    });

    this.socket.addEventListener("close", () => {
      this.isConnected = false;
      options.onClose?.();
    });

    this.socket.addEventListener("error", (error) => {
      options.onError?.(error);
    });

    this.socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data) as NotificationSocketEvent;
        options.onEvent(data);
      } catch (err) {
        options.onEvent({
          type: "error",
          error: {
            message: err instanceof Error ? err.message : "Échec du parse du message WebSocket.",
          },
        });
      }
    });
  }

  close() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
    this.socket = undefined;
    this.isConnected = false;
  }
}

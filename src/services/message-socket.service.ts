import { env } from "@/config/env";
import type { MessageSocketEvent } from "@/types/message";

type MessageSocketOptions = {
  token: string;
  companyId: string;
  onEvent: (event: MessageSocketEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
};

// Petit wrapper autour de WebSocket.
// Son role: cacher les details de connexion et exposer des methodes simples:
// connect, join, leave, sendMessage, close.
export class MessageSocketService {
  private socket: WebSocket | null = null;

  connect({ token, companyId, onEvent, onOpen, onClose, onError }: MessageSocketOptions) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    // Le backend Go accepte le JWT et le company_id dans l'URL:
    // /api/v1/ws?token=...&company_id=...
    const url = new URL(env.wsUrl);
    url.searchParams.set("token", token);
    url.searchParams.set("company_id", companyId);

    this.socket = new WebSocket(url.toString());

    // On renvoie les evenements importants au hook React.
    this.socket.onopen = () => onOpen?.();
    this.socket.onclose = () => onClose?.();
    this.socket.onerror = (event) => onError?.(event);
    this.socket.onmessage = (event) => {
      try {
        // Le backend envoie des JSON du type:
        // { type: "message", conversation_id, data }
        onEvent(JSON.parse(event.data) as MessageSocketEvent);
      } catch {
        onEvent({
          type: "error",
          error: { message: "Evenement WebSocket invalide" },
        });
      }
    };
  }

  join(conversationId: string) {
    // Demande au backend de mettre ce client dans la room de conversation.
    this.send({ type: "join", conversation_id: conversationId });
  }

  leave(conversationId: string) {
    // Retire ce client de la room quand on quitte la page.
    this.send({ type: "leave", conversation_id: conversationId });
  }

  sendMessage(conversationId: string, content: string, fileId?: string | null) {
    // Le backend sauvegarde le message puis le diffuse aux clients de la room.
    this.send({
      type: "message",
      conversation_id: conversationId,
      content,
      file_id: fileId || undefined,
    });
  }

  close() {
    // Ferme la connexion pour eviter une socket ouverte quand la page change.
    this.socket?.close();
    this.socket = null;
  }

  private send(payload: Record<string, unknown>) {
    // Si la socket n'est pas encore ouverte, on ignore l'envoi.
    // Plus tard, on pourra ajouter une file d'attente si besoin.
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify(payload));
  }
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageService, mapBackendMessage } from "@/services/message.service";
import { MessageSocketService } from "@/services/message-socket.service";
import type { Message } from "@/types/message";

type UseMessagesOptions = {
  conversationId: string;
  userId: string;
  companyId: string;
  token?: string;
};

export const useMessages = ({
  conversationId,
  userId,
  companyId,
  token,
}: UseMessagesOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Une seule instance de WebSocket service pendant la vie du composant.
  const socket = useMemo(() => new MessageSocketService(), []);

  // Charge l'historique depuis REST.
  // C'est utile au premier affichage et apres un refresh navigateur.
  const loadMessages = useCallback(
    async (signal?: AbortSignal) => {
      if (!conversationId || !userId || !companyId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const history = await MessageService.getByConversation({
          conversationId,
          requesterId: userId,
          requesterCompanyId: companyId,
          signal,
        });
        setMessages(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger les messages.");
      } finally {
        setIsLoading(false);
      }
    },
    [companyId, conversationId, userId]
  );

  // Premier chargement de la conversation.
  // AbortController evite de modifier le state si la page est quittee avant la fin du fetch.
  useEffect(() => {
    const controller = new AbortController();
    loadMessages(controller.signal);
    return () => controller.abort();
  }, [loadMessages]);

  // Connexion WebSocket.
  // Elle s'active seulement si on a un token, car le backend refuse les sockets anonymes.
  useEffect(() => {
    if (!conversationId || !companyId || !token) {
      return;
    }

    socket.connect({
      token,
      companyId,
      onOpen: () => {
        setIsRealtimeConnected(true);
        socket.join(conversationId);
      },
      onClose: () => setIsRealtimeConnected(false),
      onError: () => setError("Connexion temps reel impossible."),
      onEvent: (event) => {
        if (event.type === "message") {
          setMessages((current) => {
            const incoming = mapBackendMessage(event.data);
            // Evite les doublons si le meme message arrive deja dans la liste.
            if (current.some((message) => message.id === incoming.id)) {
              return current;
            }
            return [...current, incoming];
          });
        }

        if (event.type === "error") {
          setError(event.error.message);
        }
      },
    });

    return () => {
      socket.leave(conversationId);
      socket.close();
      setIsRealtimeConnected(false);
    };
  }, [companyId, conversationId, socket, token]);

  // Envoi d'un message.
  // Si le WebSocket est connecte, on passe par lui pour avoir le realtime.
  // Sinon on utilise REST comme fallback.
  const sendMessage = useCallback(
    async (content: string, file?: File | null) => {
      if (!conversationId || !userId || !companyId) {
        throw new Error("Conversation ou utilisateur manquant.");
      }

      setIsSending(true);
      setError(null);

      try {
        // Si un fichier est attaché, utiliser le nouveau endpoint avec fichier
        if (file) {
          const created = await MessageService.sendWithFile(
            {
              conversationId,
              senderId: userId,
              senderCompanyId: companyId,
              content,
              file,
            },
            token
          );
          setMessages((current) => [...current, created]);
          return;
        }

        // Sinon, utiliser l'ancien endpoint pour les messages texte seulement
        if (isRealtimeConnected) {
          socket.sendMessage(conversationId, content, null);
          return;
        }

        const created = await MessageService.send(
          {
            conversationId,
            senderId: userId,
            senderCompanyId: companyId,
            content,
            fileId: null,
          },
          token
        );
        setMessages((current) => [...current, created]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Impossible d'envoyer le message.";
        setError(message);
        throw new Error(message);
      } finally {
        setIsSending(false);
      }
    },
    [companyId, conversationId, isRealtimeConnected, socket, token, userId]
  );

  return {
    messages,
    isLoading,
    isSending,
    isRealtimeConnected,
    error,
    reload: loadMessages,
    sendMessage,
  };
};

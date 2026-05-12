"use client";

import { ReactNode, useSyncExternalStore } from "react";

interface ClientSideOnlyProps {
  children: ReactNode;
}

export function ClientSideOnly({ children }: ClientSideOnlyProps) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isClient) {
    return null; // Ne rien rendre côté serveur
  }

  return <>{children}</>; // Rendre les enfants uniquement côté client
}

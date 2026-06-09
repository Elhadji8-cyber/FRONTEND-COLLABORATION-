import { AuthService } from "@/services/auth.service";

export type PywFilesSectionStatus = "rejected" | "modified";

export type PywFilesSectionCard = {
  id: string;
  title: string;
  description?: string;
  projectName?: string;
  owner?: string;
  updatedAt?: string;
  status: PywFilesSectionStatus;
};

type PywFilesSectionState = Record<PywFilesSectionStatus, PywFilesSectionCard[]>;

const STORAGE_KEY_PREFIX = "planify_pyw_files_state";

const defaultState: PywFilesSectionState = {
  rejected: [],
  modified: [],
};

function getStorageKey() {
  if (typeof window === "undefined") {
    return STORAGE_KEY_PREFIX;
  }

  const session = AuthService.getSession();
  const userId = session?.user.id;
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
}

function isClient() {
  return typeof window !== "undefined";
}

function readState(): PywFilesSectionState {
  if (!isClient()) {
    return defaultState;
  }

  const rawValue = window.localStorage.getItem(getStorageKey());
  if (!rawValue) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(rawValue) as PywFilesSectionState;
    if (!parsed || typeof parsed !== "object") {
      return defaultState;
    }
    return {
      rejected: Array.isArray(parsed.rejected) ? parsed.rejected : [],
      modified: Array.isArray(parsed.modified) ? parsed.modified : [],
    };
  } catch {
    return defaultState;
  }
}

function writeState(state: PywFilesSectionState) {
  if (!isClient()) {
    return;
  }

  window.localStorage.setItem(getStorageKey(), JSON.stringify(state));
}

function normalizeCard(card: PywFilesSectionCard): PywFilesSectionCard {
  return {
    ...card,
    title: card.title || "Travail sans titre",
    description: card.description || "",
    projectName: card.projectName || "",
    owner: card.owner || "",
    updatedAt: card.updatedAt || new Date().toISOString(),
  };
}

function addCard(card: PywFilesSectionCard) {
  const state = readState();
  const normalized = normalizeCard(card);
  const section = state[normalized.status];
  const otherStatus: PywFilesSectionStatus = normalized.status === "rejected" ? "modified" : "rejected";
  const otherSection = state[otherStatus];

  const existingIndex = section.findIndex((item) => item.id === normalized.id);
  if (existingIndex >= 0) {
    section[existingIndex] = normalized;
  } else {
    section.unshift(normalized);
  }

  const otherIndex = otherSection.findIndex((item) => item.id === normalized.id);
  if (otherIndex >= 0) {
    otherSection.splice(otherIndex, 1);
  }

  writeState(state);
}

function getRejectedCards() {
  return readState().rejected;
}

function getModifiedCards() {
  return readState().modified;
}

function clearAll() {
  writeState(defaultState);
}

export const PywFilesSectionService = {
  addCard,
  getRejectedCards,
  getModifiedCards,
  clearAll,
};

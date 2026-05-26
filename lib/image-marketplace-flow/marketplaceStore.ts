"use client";

import { create } from "zustand";
import { createDemoUserFromId, marketplaceUsers } from "./demoUsers";
import {
  clearStoredMarketplaceUserId,
  normalizeMarketplaceUserId,
  readStoredMarketplaceUserId,
  writeStoredMarketplaceUserId,
} from "./marketplaceAuth";
import type { MarketplaceUser } from "./marketplaceTypes";

type MarketplaceState = {
  currentUser: MarketplaceUser | null;
  loginWithId: (id: string) => void;
  logout: () => void;
  setCurrentUser: (user: MarketplaceUser) => void;
};

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  currentUser: null,

  loginWithId: (id) => {
    const normalized = normalizeMarketplaceUserId(id) || marketplaceUsers.guest.id;
    writeStoredMarketplaceUserId(normalized);
    set({ currentUser: createDemoUserFromId(normalized) });
  },

  logout: () => {
    clearStoredMarketplaceUserId();
    set({ currentUser: null });
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
}));

let authHydrated = false;

export function hydrateMarketplaceAuthFromStorage() {
  if (typeof window === "undefined" || authHydrated) {
    return;
  }

  const storedId = readStoredMarketplaceUserId();
  if (storedId) {
    useMarketplaceStore.setState({
      currentUser: createDemoUserFromId(storedId),
    });
  }

  authHydrated = true;
}

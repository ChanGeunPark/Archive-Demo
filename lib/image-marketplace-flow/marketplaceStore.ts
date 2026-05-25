"use client";

import { create } from "zustand";
import { createDemoUserFromId, marketplaceUsers } from "./demoUsers";
import type {
  MarketplaceOffer,
  MarketplaceUser,
  OwnershipTransferEvent,
} from "./marketplaceTypes";

type WorkRuntimeState = {
  owner?: MarketplaceUser;
  askingPrice?: number | null;
  lastSalePrice?: number | null;
  offerCount?: number;
};

type MarketplaceState = {
  currentUser: MarketplaceUser | null;
  workStateById: Record<string, WorkRuntimeState>;
  offersByWorkId: Record<string, MarketplaceOffer[]>;
  lastEvent: OwnershipTransferEvent | null;
  loginWithId: (id: string) => void;
  logout: () => void;
  buyWork: (workId: string, price: number) => OwnershipTransferEvent | null;
  simulateOtherUserPurchase: (
    workId: string,
    price: number,
  ) => OwnershipTransferEvent;
  createOffer: (workId: string, amount: number) => MarketplaceOffer | null;
  acceptOffer: (workId: string, offerId: string) => OwnershipTransferEvent | null;
  resolveWorkState: (workId: string, fallback: WorkRuntimeState) => WorkRuntimeState;
};

function createTransferEvent(
  type: OwnershipTransferEvent["type"],
  workId: string,
  newOwnerId: string,
): OwnershipTransferEvent {
  return {
    type,
    workId,
    newOwnerId,
    transactionId: `tx-${Date.now()}`,
    occurredAt: new Date().toISOString(),
  };
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  currentUser: null,
  workStateById: {},
  offersByWorkId: {},
  lastEvent: null,

  loginWithId: (id) => set({ currentUser: createDemoUserFromId(id) }),
  logout: () => set({ currentUser: null }),

  buyWork: (workId, price) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      return null;
    }

    const event = createTransferEvent(
      "WORK_OWNERSHIP_TRANSFERRED",
      workId,
      currentUser.id,
    );

    set((state) => ({
      lastEvent: event,
      workStateById: {
        ...state.workStateById,
        [workId]: {
          ...state.workStateById[workId],
          owner: currentUser,
          askingPrice: null,
          lastSalePrice: price,
        },
      },
    }));

    return event;
  },

  simulateOtherUserPurchase: (workId, price) => {
    const otherUser = marketplaceUsers.collectorB;
    const event = createTransferEvent(
      "WORK_OWNERSHIP_TRANSFERRED",
      workId,
      otherUser.id,
    );

    set((state) => ({
      lastEvent: event,
      workStateById: {
        ...state.workStateById,
        [workId]: {
          ...state.workStateById[workId],
          owner: otherUser,
          askingPrice: null,
          lastSalePrice: price,
        },
      },
    }));

    return event;
  },

  createOffer: (workId, amount) => {
    const currentUser = get().currentUser;
    if (!currentUser || amount <= 0) {
      return null;
    }

    const offer: MarketplaceOffer = {
      id: `offer-${Date.now()}`,
      workId,
      bidder: currentUser,
      amount,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const offers = [offer, ...(state.offersByWorkId[workId] || [])];

      return {
        offersByWorkId: {
          ...state.offersByWorkId,
          [workId]: offers,
        },
        workStateById: {
          ...state.workStateById,
          [workId]: {
            ...state.workStateById[workId],
            offerCount: offers.filter((item) => item.status === "PENDING")
              .length,
          },
        },
      };
    });

    return offer;
  },

  acceptOffer: (workId, offerId) => {
    const offers = get().offersByWorkId[workId] || [];
    const offer = offers.find((item) => item.id === offerId);
    if (!offer) {
      return null;
    }

    const event = createTransferEvent("OFFER_ACCEPTED", workId, offer.bidder.id);

    set((state) => {
      const nextOffers = (state.offersByWorkId[workId] || []).map((item) =>
        item.id === offerId
          ? { ...item, status: "ACCEPTED" as const }
          : item.status === "PENDING"
            ? { ...item, status: "DECLINED" as const }
            : item,
      );

      return {
        lastEvent: event,
        offersByWorkId: {
          ...state.offersByWorkId,
          [workId]: nextOffers,
        },
        workStateById: {
          ...state.workStateById,
          [workId]: {
            ...state.workStateById[workId],
            owner: offer.bidder,
            askingPrice: null,
            lastSalePrice: offer.amount,
            offerCount: 0,
          },
        },
      };
    });

    return event;
  },

  resolveWorkState: (workId, fallback) => ({
    ...fallback,
    ...get().workStateById[workId],
  }),
}));

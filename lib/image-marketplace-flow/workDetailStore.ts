"use client";

import { create } from "zustand";

type WorkDetailState = {
  /** Chizu-style refetch signal — payload는 UI에 쓰지 않음 */
  forceUpdateTrigger: boolean;
  pendingWorkId: string | null;
  requestRefresh: (workId: string) => void;
  clearRefresh: () => void;
};

export const useWorkDetailStore = create<WorkDetailState>((set) => ({
  forceUpdateTrigger: false,
  pendingWorkId: null,

  requestRefresh: (workId) =>
    set({
      forceUpdateTrigger: true,
      pendingWorkId: workId,
    }),

  clearRefresh: () =>
    set({
      forceUpdateTrigger: false,
      pendingWorkId: null,
    }),
}));

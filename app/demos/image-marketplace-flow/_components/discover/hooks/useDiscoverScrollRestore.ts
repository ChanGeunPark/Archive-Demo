"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from "react";
import { MARKETPLACE_BASE_PATH } from "@/lib/image-marketplace-flow/routes";
import type { WorksQueryResponse } from "@/lib/image-marketplace-flow/graphql/types";
import {
  DISCOVER_SCROLL_KEY,
  DISCOVER_SCROLL_RESTORE_MAX_FRAMES,
  DISCOVER_SCROLL_SAVE_DEBOUNCE_MS,
  getMaxScrollY,
  isDiscoverPath,
  waitForNextFrame,
} from "./discoverScrollUtils";

type UseDiscoverScrollRestoreOptions = {
  isInitialLoading: boolean;
  worksCount: number;
  pageInfoRef: RefObject<
    WorksQueryResponse["works"]["pageInfo"] | undefined
  >;
  loadMore: () => Promise<void>;
  unlockLoadMore: () => boolean;
  tryLoadMoreIfSentinelVisible: () => void;
};

export function useDiscoverScrollRestore({
  isInitialLoading,
  worksCount,
  pageInfoRef,
  loadMore,
  unlockLoadMore,
  tryLoadMoreIfSentinelVisible,
}: UseDiscoverScrollRestoreOptions) {
  const hasRestoredScrollRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const isLeavingForWorkRef = useRef(false);
  const loadMoreRef = useRef(loadMore);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useLayoutEffect(() => {
    const previous =
      "scrollRestoration" in history ? history.scrollRestoration : null;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in history && previous) {
        history.scrollRestoration = previous;
      }
    };
  }, []);

  useEffect(() => {
    let saveTimeout: ReturnType<typeof setTimeout> | undefined;

    const saveScrollPosition = () => {
      if (!isDiscoverPath(window.location.pathname)) {
        return;
      }

      sessionStorage.setItem(DISCOVER_SCROLL_KEY, String(lastScrollYRef.current));
    };

    const onScroll = () => {
      if (
        isLeavingForWorkRef.current ||
        !isDiscoverPath(window.location.pathname)
      ) {
        return;
      }

      lastScrollYRef.current = window.scrollY;

      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      saveTimeout = setTimeout(saveScrollPosition, DISCOVER_SCROLL_SAVE_DEBOUNCE_MS);

      const wasUnlocked = unlockLoadMore();
      if (!wasUnlocked) {
        tryLoadMoreIfSentinelVisible();
      }
    };

    const workLinkSelector = `a[href*="${MARKETPLACE_BASE_PATH}/work/"]`;

    const onWorkLinkClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest(workLinkSelector);
      if (!link) {
        return;
      }

      isLeavingForWorkRef.current = true;
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = undefined;
      }
      saveScrollPosition();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onWorkLinkClick, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onWorkLinkClick, true);
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      if (
        !isLeavingForWorkRef.current &&
        lastScrollYRef.current > 0 &&
        isDiscoverPath(window.location.pathname)
      ) {
        sessionStorage.setItem(
          DISCOVER_SCROLL_KEY,
          String(lastScrollYRef.current),
        );
      }
    };
  }, [tryLoadMoreIfSentinelVisible, unlockLoadMore]);

  useLayoutEffect(() => {
    if (
      hasRestoredScrollRef.current ||
      isInitialLoading ||
      worksCount === 0
    ) {
      return;
    }

    const raw = sessionStorage.getItem(DISCOVER_SCROLL_KEY);
    if (!raw) {
      return;
    }

    const targetY = Number(raw);
    if (!Number.isFinite(targetY) || targetY <= 0) {
      sessionStorage.removeItem(DISCOVER_SCROLL_KEY);
      hasRestoredScrollRef.current = true;
      return;
    }

    hasRestoredScrollRef.current = true;

    let cancelled = false;

    const restoreScroll = async () => {
      unlockLoadMore();

      for (let frame = 0; frame < DISCOVER_SCROLL_RESTORE_MAX_FRAMES; frame += 1) {
        if (cancelled) {
          return;
        }

        await waitForNextFrame();

        if (getMaxScrollY() >= targetY - 32) {
          window.scrollTo(0, targetY);
          sessionStorage.removeItem(DISCOVER_SCROLL_KEY);
          return;
        }
      }

      while (
        !cancelled &&
        pageInfoRef.current?.hasNextPage &&
        pageInfoRef.current.endCursor &&
        getMaxScrollY() < targetY - 32
      ) {
        await loadMoreRef.current();

        for (
          let frame = 0;
          frame < DISCOVER_SCROLL_RESTORE_MAX_FRAMES;
          frame += 1
        ) {
          if (cancelled) {
            return;
          }

          await waitForNextFrame();

          if (getMaxScrollY() >= targetY - 32) {
            window.scrollTo(0, targetY);
            sessionStorage.removeItem(DISCOVER_SCROLL_KEY);
            return;
          }
        }
      }

      if (!cancelled) {
        window.scrollTo(0, Math.min(targetY, getMaxScrollY()));
        sessionStorage.removeItem(DISCOVER_SCROLL_KEY);
      }
    };

    void restoreScroll();

    return () => {
      cancelled = true;
    };
    // worksCount는 의존성에서 제외 — fetchMore 중 재실행되면 복원이 취소됨
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once after initial load
  }, [isInitialLoading]);
}

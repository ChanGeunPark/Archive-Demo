"use client";

import { useCallback, useEffect, useRef } from "react";
import { DISCOVER_SENTINEL_ROOT_MARGIN } from "./discoverScrollUtils";

type UseInfiniteScrollSentinelOptions = {
  filterKey: string;
  isInitialLoading: boolean;
  hasNextPage: boolean;
  endCursor: string | null | undefined;
  loadMore: () => Promise<void>;
};

export function useInfiniteScrollSentinel({
  filterKey,
  isInitialLoading,
  hasNextPage,
  endCursor,
  loadMore,
}: UseInfiniteScrollSentinelOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingMoreRef = useRef(false);
  const canLoadMoreRef = useRef(false);
  const loadMoreFnRef = useRef<() => void>(() => undefined);

  const loadMoreIfAllowed = useCallback(async () => {
    if (!canLoadMoreRef.current) {
      return;
    }
    if (isFetchingMoreRef.current || isInitialLoading) {
      return;
    }

    isFetchingMoreRef.current = true;
    try {
      await loadMore();
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [isInitialLoading, loadMore]);

  useEffect(() => {
    loadMoreFnRef.current = () => {
      void loadMoreIfAllowed();
    };
  }, [loadMoreIfAllowed]);

  useEffect(() => {
    canLoadMoreRef.current = false;
  }, [filterKey]);

  const unlockLoadMore = useCallback(() => {
    const wasUnlocked = canLoadMoreRef.current;
    canLoadMoreRef.current = true;
    return wasUnlocked;
  }, []);

  const tryLoadMoreIfSentinelVisible = useCallback(() => {
    if (!canLoadMoreRef.current || isInitialLoading) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const rect = sentinel.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 200) {
      void loadMoreFnRef.current();
    }
  }, [isInitialLoading]);

  useEffect(() => {
    if (isInitialLoading || !hasNextPage) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreFnRef.current();
        }
      },
      { rootMargin: DISCOVER_SENTINEL_ROOT_MARGIN },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filterKey, isInitialLoading, hasNextPage, endCursor]);

  return {
    sentinelRef,
    unlockLoadMore,
    tryLoadMoreIfSentinelVisible,
  };
}

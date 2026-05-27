"use client";

import type { PriceFilterRange } from "../discoverPriceFilter";
import { useDiscoverScrollRestore } from "./useDiscoverScrollRestore";
import { useInfiniteScrollSentinel } from "./useInfiniteScrollSentinel";
import { useWorksInfiniteQuery } from "./useWorksInfiniteQuery";

export function useDiscoverWorksFeed(
  query: string,
  priceFilter: PriceFilterRange,
) {
  const {
    works,
    pageInfo,
    worksError,
    isInitialLoading,
    filterKey,
    loadMore,
    pageInfoRef,
  } = useWorksInfiniteQuery(query, priceFilter);

  const { sentinelRef, unlockLoadMore, tryLoadMoreIfSentinelVisible } =
    useInfiniteScrollSentinel({
      filterKey,
      isInitialLoading,
      hasNextPage: pageInfo?.hasNextPage ?? false,
      endCursor: pageInfo?.endCursor,
      loadMore,
    });

  useDiscoverScrollRestore({
    isInitialLoading,
    worksCount: works.length,
    pageInfoRef,
    loadMore,
    unlockLoadMore,
    tryLoadMoreIfSentinelVisible,
  });

  return {
    works,
    pageInfo,
    worksError,
    isInitialLoading,
    sentinelRef,
  };
}

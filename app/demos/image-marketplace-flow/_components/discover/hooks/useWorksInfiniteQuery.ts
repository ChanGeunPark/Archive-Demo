"use client";

import { useCallback, useEffect, useRef } from "react";
import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  DEFAULT_WORKS_QUERY_VARIABLES,
  WORKS_PAGE_SIZE,
  WORKS_QUERY,
} from "@/lib/image-marketplace-flow/graphql/operations";
import type {
  WorksQueryResponse,
  WorksQueryVariables,
} from "@/lib/image-marketplace-flow/graphql/types";
import type { PriceFilterRange } from "../discoverPriceFilter";

function buildWorksQueryVariables(
  query: string,
  priceFilter: PriceFilterRange,
): WorksQueryVariables {
  return {
    first: WORKS_PAGE_SIZE,
    query: query.trim() || undefined,
    ...(priceFilter.minPrice != null ? { minPrice: priceFilter.minPrice } : {}),
    ...(priceFilter.maxPrice != null ? { maxPrice: priceFilter.maxPrice } : {}),
  };
}

function buildFilterKey(query: string, priceFilter: PriceFilterRange) {
  return `${query.trim()}|${priceFilter.minPrice ?? ""}|${priceFilter.maxPrice ?? ""}`;
}

export function useWorksInfiniteQuery(
  query: string,
  priceFilter: PriceFilterRange,
) {
  const variables = buildWorksQueryVariables(query, priceFilter);
  const filterKey = buildFilterKey(query, priceFilter);

  const pageInfoRef = useRef<
    WorksQueryResponse["works"]["pageInfo"] | undefined
  >(undefined);

  const {
    data: worksData,
    error: worksError,
    fetchMore,
    networkStatus,
  } = useQuery<WorksQueryResponse, WorksQueryVariables>(WORKS_QUERY, {
    variables,
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const works = worksData?.works.edges.map((edge) => edge.node) ?? [];
  const pageInfo = worksData?.works.pageInfo;
  const isInitialLoading =
    works.length === 0 &&
    (networkStatus === NetworkStatus.loading ||
      networkStatus === NetworkStatus.setVariables ||
      networkStatus === NetworkStatus.refetch);
  const isLoadingMore = networkStatus === NetworkStatus.fetchMore;

  useEffect(() => {
    pageInfoRef.current = pageInfo;
  }, [pageInfo]);

  const loadMore = useCallback(async () => {
    if (isInitialLoading) {
      return;
    }
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    await fetchMore({
      variables: {
        ...DEFAULT_WORKS_QUERY_VARIABLES,
        query: variables.query,
        minPrice: variables.minPrice,
        maxPrice: variables.maxPrice,
        after: pageInfo.endCursor,
      },
    });
  }, [
    fetchMore,
    isInitialLoading,
    pageInfo,
    variables.maxPrice,
    variables.minPrice,
    variables.query,
  ]);

  return {
    works,
    pageInfo,
    worksError,
    isInitialLoading,
    isLoadingMore,
    filterKey,
    loadMore,
    pageInfoRef,
  };
}

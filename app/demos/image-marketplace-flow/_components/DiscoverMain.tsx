"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ArtistGrid from "./discover/ArtistGrid";
import DiscoverHeader from "./discover/DiscoverHeader";
import DiscoverMobileSearch from "./discover/DiscoverMobileSearch";
import DiscoverTabNav from "./discover/DiscoverTabNav";
import type { DiscoverTab } from "./discover/discoverTypes";
import TagGrid from "./discover/TagGrid";
import WorkGrid from "./discover/WorkGrid";
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
import LoadingAni from "./animation/LoadingAni";

export default function DiscoverMain() {
  // --- state ---
  const [activeTab, setActiveTab] = useState<DiscoverTab>("work");
  const [query, setQuery] = useState("");
  const [buyNowOnly, setBuyNowOnly] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingMoreRef = useRef(false);
  const canLoadMoreRef = useRef(false);
  const loadMoreFnRef = useRef<() => void>(() => undefined);

  // --- graphql ---
  const variables: WorksQueryVariables = {
    first: WORKS_PAGE_SIZE,
    query: query.trim() || undefined,
    buyNowOnly: buyNowOnly || undefined,
  };

  const {
    data: worksData,
    loading: worksLoading,
    error: worksError,
    fetchMore,
  } = useQuery<WorksQueryResponse, WorksQueryVariables>(WORKS_QUERY, {
    variables,
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  // --- derived state ---
  const works = worksData?.works.edges.map((edge) => edge.node) ?? [];
  const pageInfo = worksData?.works.pageInfo;
  const isInitialLoading = worksLoading && works.length === 0;
  const isFetchingMore = worksLoading && works.length > 0;

  // --- effects ---
  const loadMore = useCallback(async () => {
    if (!canLoadMoreRef.current) {
      return;
    }
    if (isFetchingMoreRef.current || isInitialLoading) {
      return;
    }
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    isFetchingMoreRef.current = true;
    try {
      await fetchMore({
        variables: {
          ...DEFAULT_WORKS_QUERY_VARIABLES,
          query: variables.query,
          buyNowOnly: variables.buyNowOnly,
          after: pageInfo.endCursor,
        },
      });
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [
    fetchMore,
    isInitialLoading,
    pageInfo,
    variables.buyNowOnly,
    variables.query,
  ]);

  useEffect(() => {
    loadMoreFnRef.current = loadMore;
  }, [loadMore]);

  // 필터 변경 시 첫 페이지 로드 직후 자동 fetchMore 방지
  useEffect(() => {
    canLoadMoreRef.current = false;
  }, [query, buyNowOnly]);

  // 사용자가 스크롤한 뒤에만 추가 로드 허용
  useEffect(() => {
    const onScroll = () => {
      if (canLoadMoreRef.current) {
        return;
      }

      canLoadMoreRef.current = true;

      const sentinel = sentinelRef.current;
      if (!sentinel) {
        return;
      }

      const rect = sentinel.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 200) {
        void loadMoreFnRef.current();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- intersection observer[무한 스크롤 로드] ---
  useEffect(() => {
    if (isInitialLoading) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel || activeTab !== "work") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreFnRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeTab, isInitialLoading]);

  return (
    <main className="min-h-screen bg-white text-[#17191C]">
      <DiscoverHeader query={query} onQueryChange={setQuery} />

      <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-10">
        <DiscoverMobileSearch query={query} onQueryChange={setQuery} />

        <DiscoverTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          buyNowOnly={buyNowOnly}
          onBuyNowOnlyChange={setBuyNowOnly}
        />

        <section className="py-6">
          {worksError && (
            <div className="text-sm font-medium text-gray-500">
              Error: {worksError.message}
            </div>
          )}
          {isInitialLoading ? (
            <div className="flex w-full items-center justify-center">
              <LoadingAni loop={true} className="h-[60px] w-[60px]" />
            </div>
          ) : (
            <>
              {activeTab === "work" && (
                <>
                  <WorkGrid works={works} />
                  {pageInfo?.hasNextPage && (
                    <div
                      ref={sentinelRef}
                      className="flex w-full justify-center py-8"
                    >
                      {isFetchingMore && (
                        <LoadingAni loop={true} className="h-[40px] w-[40px]" />
                      )}
                    </div>
                  )}
                </>
              )}
              {activeTab === "artist" && <ArtistGrid />}
              {activeTab === "tag" && <TagGrid />}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

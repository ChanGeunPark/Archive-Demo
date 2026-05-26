"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import DiscoverHeader from "./discover/DiscoverHeader";
import DiscoverMobileSearch from "./discover/DiscoverMobileSearch";
import DiscoverTabNav from "./discover/DiscoverTabNav";
import {
  DEFAULT_PRICE_FILTER_OPTION,
  type PriceFilterRange,
} from "./discover/discoverPriceFilter";
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

const SCROLL_KEY = "discover-scroll";
const SCROLL_SAVE_DEBOUNCE_MS = 150;
const SCROLL_RESTORE_MAX_FRAMES = 30;

function getMaxScrollY() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export default function DiscoverMain() {
  // --- state ---
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilterRange>(
    DEFAULT_PRICE_FILTER_OPTION.range,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingMoreRef = useRef(false);
  const canLoadMoreRef = useRef(false);
  const loadMoreFnRef = useRef<() => void>(() => undefined);
  const hasRestoredScrollRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const pageInfoRef = useRef<
    WorksQueryResponse["works"]["pageInfo"] | undefined
  >(undefined);

  // --- graphql ---
  const variables: WorksQueryVariables = {
    first: WORKS_PAGE_SIZE,
    query: query.trim() || undefined,
    ...(priceFilter.minPrice != null ? { minPrice: priceFilter.minPrice } : {}),
    ...(priceFilter.maxPrice != null ? { maxPrice: priceFilter.maxPrice } : {}),
  };

  const filterKey = `${query.trim()}|${priceFilter.minPrice ?? ""}|${priceFilter.maxPrice ?? ""}`;

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

  useEffect(() => {
    pageInfoRef.current = pageInfo;
  }, [pageInfo]);

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
          minPrice: variables.minPrice,
          maxPrice: variables.maxPrice,
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
    variables.maxPrice,
    variables.minPrice,
    variables.query,
  ]);

  useEffect(() => {
    loadMoreFnRef.current = loadMore;
  }, [loadMore]);

  // 필터 변경 시 첫 페이지 로드 직후 자동 fetchMore 방지
  useEffect(() => {
    canLoadMoreRef.current = false;
  }, [filterKey]);

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

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // 사용자가 스크롤한 뒤에만 추가 로드 허용 + 스크롤 위치 저장
  useEffect(() => {
    let saveTimeout: ReturnType<typeof setTimeout> | undefined;

    const saveScrollPosition = () => {
      sessionStorage.setItem(SCROLL_KEY, String(lastScrollYRef.current));
    };

    const onScroll = () => {
      lastScrollYRef.current = window.scrollY;

      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      saveTimeout = setTimeout(saveScrollPosition, SCROLL_SAVE_DEBOUNCE_MS);

      const wasUnlocked = canLoadMoreRef.current;
      canLoadMoreRef.current = true;

      if (!wasUnlocked) {
        tryLoadMoreIfSentinelVisible();
      }
    };

    const onWorkLinkClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a[href*="/image-marketplace-flow/work/"]');
      if (!link) {
        return;
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
      // Next.js가 라우트 이동 시 scrollY를 0으로 만든 뒤 unmount하므로 ref 값을 저장
      if (lastScrollYRef.current > 0) {
        sessionStorage.setItem(SCROLL_KEY, String(lastScrollYRef.current));
      }
    };
  }, [tryLoadMoreIfSentinelVisible]);

  // --- intersection observer[무한 스크롤 로드] ---
  // 필터 결과가 적어 sentinel이 unmount됐다가 다시 mount되면 observer를 재연결해야 함
  useEffect(() => {
    if (isInitialLoading || !pageInfo?.hasNextPage) {
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
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filterKey, isInitialLoading, pageInfo?.hasNextPage, pageInfo?.endCursor]);

  // --- scroll restore ---
  useLayoutEffect(() => {
    if (
      hasRestoredScrollRef.current ||
      isInitialLoading ||
      works.length === 0
    ) {
      return;
    }

    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (!raw) {
      return;
    }

    const targetY = Number(raw);
    if (!Number.isFinite(targetY) || targetY <= 0) {
      sessionStorage.removeItem(SCROLL_KEY);
      hasRestoredScrollRef.current = true;
      return;
    }

    hasRestoredScrollRef.current = true;

    let cancelled = false;

    const restoreScroll = async () => {
      canLoadMoreRef.current = true;

      for (let frame = 0; frame < SCROLL_RESTORE_MAX_FRAMES; frame += 1) {
        if (cancelled) {
          return;
        }

        await waitForNextFrame();

        if (getMaxScrollY() >= targetY - 32) {
          window.scrollTo(0, targetY);
          sessionStorage.removeItem(SCROLL_KEY);
          return;
        }
      }

      while (
        !cancelled &&
        pageInfoRef.current?.hasNextPage &&
        pageInfoRef.current.endCursor &&
        getMaxScrollY() < targetY - 32
      ) {
        await loadMoreFnRef.current();

        for (let frame = 0; frame < SCROLL_RESTORE_MAX_FRAMES; frame += 1) {
          if (cancelled) {
            return;
          }

          await waitForNextFrame();

          if (getMaxScrollY() >= targetY - 32) {
            window.scrollTo(0, targetY);
            sessionStorage.removeItem(SCROLL_KEY);
            return;
          }
        }
      }

      if (!cancelled) {
        window.scrollTo(0, Math.min(targetY, getMaxScrollY()));
        sessionStorage.removeItem(SCROLL_KEY);
      }
    };

    void restoreScroll();

    return () => {
      cancelled = true;
    };
    // works.length는 의존성에서 제외 — fetchMore 중 재실행되면 복원이 취소됨
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once after initial load
  }, [isInitialLoading]);

  return (
    <main className="min-h-screen bg-white text-[#17191C]">
      <DiscoverHeader query={query} onQueryChange={setQuery} />

      <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-10">
        <DiscoverMobileSearch query={query} onQueryChange={setQuery} />

        <DiscoverTabNav
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
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
              <WorkGrid works={works} />
              {pageInfo?.hasNextPage && (
                <div
                  ref={sentinelRef}
                  className="flex w-full justify-center py-8"
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

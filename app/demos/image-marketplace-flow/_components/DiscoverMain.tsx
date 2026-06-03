"use client";

import Link from "next/link";
import { useState } from "react";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import DiscoverHeader from "./discover/DiscoverHeader";
import DiscoverMobileSearch from "./discover/DiscoverMobileSearch";
import DiscoverTabNav from "./discover/DiscoverTabNav";
import {
  DEFAULT_PRICE_FILTER_OPTION,
  type PriceFilterRange,
} from "./discover/discoverPriceFilter";
import { useDiscoverWorksFeed } from "./discover/hooks/useDiscoverWorksFeed";
import WorkGrid from "./discover/WorkGrid";
import WorkGridSkeleton from "./discover/WorkGridSkeleton";
import Typography from "@/components/typography/Typography";

export default function DiscoverMain() {
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilterRange>(
    DEFAULT_PRICE_FILTER_OPTION.range,
  );

  const {
    works,
    pageInfo,
    worksError,
    isInitialLoading,
    isLoadingMore,
    sentinelRef,
  } = useDiscoverWorksFeed(query, priceFilter);

  return (
    <main className="min-h-screen bg-white text-[#17191C]">
      <DiscoverHeader query={query} onQueryChange={setQuery} />

      <div className="mx-auto max-w-[1440px] px-4 py-4 lg:px-10">
        <DiscoverMobileSearch query={query} onQueryChange={setQuery} />

        <section
          className="mb-3 overflow-hidden rounded-2xl border border-[#EDEEEF] bg-linear-to-br from-amber-50/50 via-white to-zinc-50/60 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] ring-1 ring-inset ring-zinc-200/70 sm:p-5"
          aria-label="데모 소개"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ">
            <Typography
              variant="body2"
              color="#52525B"
              className="min-w-0 flex-1 break-keep leading-relaxed"
            >
              이미지 탐색부터 작품 상세·구매·가격 제안·등록까지 이어지는
              마켓플레이스 데모입니다. 우측 상단 ID 입력란에 원하는 ID를 넣고
              로그인하세요. 별도 가입 없이 사용할 수 있습니다. 로그인 후 작품
              등록·구매·가격 제안을 시도해 보고, 입력한 ID로 등록한 작품은 상세
              화면에서 삭제할 수 있습니다. 탭을 두 개 열면 실시간 갱신도 확인할
              수 있습니다.
            </Typography>
            <Link
              href={marketplaceRoutes.technicalNotes}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-800/10 bg-zinc-800 px-3 py-1.5 shadow-sm transition hover:bg-zinc-700 active:scale-[0.98]"
            >
              <Typography as="span" variant="body3" weight={600} color="white">
                기술 노트
              </Typography>
            </Link>
          </div>
        </section>

        <DiscoverTabNav
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
        />

        <section>
          {worksError && (
            <div className="text-sm font-medium text-gray-500">
              Error: {worksError.message}
            </div>
          )}
          {isInitialLoading ? (
            <WorkGridSkeleton />
          ) : (
            <>
              <WorkGrid works={works} isLoadingMore={isLoadingMore} />
              {!isLoadingMore && pageInfo?.hasNextPage && (
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

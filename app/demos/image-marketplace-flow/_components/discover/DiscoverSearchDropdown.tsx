"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { SEARCH_BY_KEYWORD_QUERY } from "@/lib/image-marketplace-flow/graphql/operations";
import type {
  SearchByKeywordResponse,
  SearchByKeywordVariables,
} from "@/lib/image-marketplace-flow/graphql/types";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import LoadingAni from "../animation/LoadingAni";
import DiscoverSearchItem from "./DiscoverSearchItem";

const SEARCH_RESULT_COUNT = 20;
const SEARCH_DEBOUNCE_MS = 300;

type DiscoverSearchDropdownProps = {
  keyword: string;
  onNavigate?: () => void;
};

export default function DiscoverSearchDropdown({
  keyword,
  onNavigate,
}: DiscoverSearchDropdownProps) {
  const [search, { data, loading }] = useLazyQuery<
    SearchByKeywordResponse,
    SearchByKeywordVariables
  >(SEARCH_BY_KEYWORD_QUERY, {
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void search({
        variables: {
          keyword: trimmed,
          count: SEARCH_RESULT_COUNT,
        },
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [keyword, search]);

  const works = data?.searchByKeyword.works ?? [];

  if (!keyword.trim()) {
    return null;
  }

  if (loading && works.length === 0) {
    return (
      <div className="flex w-full justify-center py-6">
        <LoadingAni loop className="h-10 w-10" />
      </div>
    );
  }

  if (data && works.length === 0) {
    return (
      <div className="px-4 py-5 text-sm text-[#777D84]">
        검색 결과가 없습니다.
      </div>
    );
  }

  if (works.length === 0) {
    return null;
  }

  return (
    <menu>
      <section>
        <h6 className="px-4 pt-4 text-left text-xs font-semibold text-[#777D84]">
          작품
        </h6>
        {works.map((work) => (
          <DiscoverSearchItem
            key={work.id}
            href={marketplaceRoutes.work(work.id)}
            title={work.title}
            subtitle={work.creator.handle}
            imageUrl={work.imageUrl}
            avatarUrl={work.creator.avatar}
            onNavigate={onNavigate}
          />
        ))}
      </section>
    </menu>
  );
}

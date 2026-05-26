"use client";

import { useState } from "react";
import ArtistGrid from "./discover/ArtistGrid";
import DiscoverHeader from "./discover/DiscoverHeader";
import DiscoverMobileSearch from "./discover/DiscoverMobileSearch";
import DiscoverTabNav from "./discover/DiscoverTabNav";
import type { DiscoverTab } from "./discover/discoverTypes";
import TagGrid from "./discover/TagGrid";
import WorkGrid from "./discover/WorkGrid";
import { useQuery } from "@apollo/client/react";
import { WORKS_QUERY } from "@/lib/image-marketplace-flow/graphql/operations";
import { WorksQueryResponse } from "@/lib/image-marketplace-flow/graphql/types";
import LoadingAni from "./animation/LoadingAni";

export default function DiscoverMain() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("work");
  const [query, setQuery] = useState("");
  const [buyNowOnly, setBuyNowOnly] = useState(false);

  const {
    data: worksData,
    loading: worksLoading,
    error: worksError,
  } = useQuery<WorksQueryResponse>(WORKS_QUERY, {
    fetchPolicy: "cache-first",
  });

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
          {worksLoading ? (
            <div className="w-full flex justify-center items-center">
              <LoadingAni loop={true} className="w-[60px] h-[60px]" />
            </div>
          ) : (
            <>
              {activeTab === "work" && (
                <WorkGrid works={worksData?.works ?? []} />
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

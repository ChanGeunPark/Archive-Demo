"use client";

import { useMemo, useState } from "react";
import { works, type WorkItem } from "./chizuData";
import { useCreateArtworkStore } from "@/lib/image-marketplace-flow/createArtworkStore";
import { getArtworkTagLabel } from "@/lib/image-marketplace-flow/artworkTags";
import { marketplaceUsers } from "@/lib/image-marketplace-flow/demoUsers";
import ArtistGrid from "./discover/ArtistGrid";
import CollectionGrid from "./discover/CollectionGrid";
import DiscoverHeader from "./discover/DiscoverHeader";
import DiscoverMobileSearch from "./discover/DiscoverMobileSearch";
import DiscoverTabNav from "./discover/DiscoverTabNav";
import type { DiscoverTab } from "./discover/discoverTypes";
import TagGrid from "./discover/TagGrid";
import WorkGrid from "./discover/WorkGrid";

export default function ChizuDiscoverMain() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("work");
  const [query, setQuery] = useState("");
  const [buyNowOnly, setBuyNowOnly] = useState(false);
  const createdWorks = useCreateArtworkStore((state) => state.createdWorks);

  const marketplaceWorks = useMemo(
    () => [
      ...createdWorks.map(
        (work): WorkItem => ({
        id: work.id,
        title: work.title,
        artist: work.artist,
        image: work.image,
        price: work.price,
        width: 1000,
        height: 1000,
        tags: work.tags,
        status: "Buy now" as const,
        creator: marketplaceUsers.guest,
        owner: marketplaceUsers.guest,
        ownershipStatus: "OWNED_BY_CREATOR",
        listingStatus: "LISTED",
        askingPrice: work.price,
        lastSalePrice: null,
        offerCount: 0,
        usageRights: [
          { label: "상업적 이용 가능", enabled: true },
          { label: "독점 사용권 이전", enabled: true },
          { label: "2차 수정 가능", enabled: true },
          { label: "재판매 가능", enabled: false },
        ],
      }),
      ),
      ...works,
    ],
    [createdWorks],
  );

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return marketplaceWorks.filter((work) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          work.title,
          work.artist,
          ...work.tags,
          ...work.tags.map((tag) => getArtworkTagLabel(tag)),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesFilter = !buyNowOnly || work.status === "Buy now";

      return matchesQuery && matchesFilter;
    });
  }, [buyNowOnly, marketplaceWorks, query]);

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
          {activeTab === "work" && <WorkGrid works={filteredWorks} />}
          {activeTab === "collection" && <CollectionGrid />}
          {activeTab === "artist" && <ArtistGrid />}
          {activeTab === "tag" && <TagGrid />}
        </section>
      </div>
    </main>
  );
}

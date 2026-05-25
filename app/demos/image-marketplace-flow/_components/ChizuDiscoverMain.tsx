"use client";

import { useMemo, useState } from "react";
import { works } from "./chizuData";
import { useCreateArtworkStore } from "@/lib/image-marketplace-flow/createArtworkStore";
import { getArtworkTagLabel } from "@/lib/image-marketplace-flow/artworkTags";
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
      ...createdWorks.map((work) => ({
        id: work.id,
        title: work.title,
        artist: work.artist,
        image: work.image,
        price: work.price,
        width: 1000,
        height: 1000,
        tags: work.tags,
        status: "Buy now" as const,
      })),
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

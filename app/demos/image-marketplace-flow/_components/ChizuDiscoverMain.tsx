"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { cls } from "@/lib/client/utils";
import MasonryImageCard from "./card/MasonryImageCard";
import OrderedMasonry from "./layout/OrderedMasonry";

const AUCTION_DURATION_MS = 12 * 60 * 60 * 1000;

function getAuctionEndTime() {
  return new Date(Date.now() + AUCTION_DURATION_MS).toISOString();
}

type DiscoverTab = "work" | "collection" | "artist" | "tag";

type WorkItem = {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  width: number;
  height: number;
  tags: string[];
  status: "Buy now" | "Auction" | "Offer";
};

const tabs: { id: DiscoverTab; label: string }[] = [
  { id: "work", label: "작품" },
  { id: "collection", label: "컬렉션" },
  { id: "artist", label: "작가" },
  { id: "tag", label: "태그" },
];

const works: WorkItem[] = [
  {
    id: "work-01",
    title: "Archive Bloom",
    artist: "Min Park",
    image: "/images/chizu/main1.jpg",
    price: 280_000,
    width: 1200,
    height: 1600,
    tags: ["illustration", "character"],
    status: "Buy now",
  },
  {
    id: "work-02",
    title: "Blue Signal",
    artist: "Haru Studio",
    image: "/images/chizu/main2.jpg",
    price: 160_000,
    width: 1400,
    height: 1100,
    tags: ["anime", "blue"],
    status: "Auction",
  },
  {
    id: "work-03",
    title: "Soft Protocol",
    artist: "Noah Kim",
    image: "/images/chizu/main3.jpg",
    price: 420_000,
    width: 1200,
    height: 1800,
    tags: ["portrait", "license"],
    status: "Offer",
  },
  {
    id: "work-04",
    title: "Creator Room",
    artist: "Yuna Lee",
    image: "/images/chizu/main4.jpg",
    price: 310_000,
    width: 1300,
    height: 1500,
    tags: ["3d", "interior"],
    status: "Buy now",
  },
  {
    id: "work-05",
    title: "Layered Dream",
    artist: "Studio Oji",
    image: "/images/chizu/main5.jpg",
    price: 190_000,
    width: 1500,
    height: 1200,
    tags: ["concept", "dream"],
    status: "Auction",
  },
  {
    id: "work-06",
    title: "Neon Field",
    artist: "Kira",
    image: "/images/chizu/main6.jpg",
    price: 350_000,
    width: 1200,
    height: 1600,
    tags: ["neon", "landscape"],
    status: "Buy now",
  },
  {
    id: "work-07",
    title: "Silent Light",
    artist: "Jun Seo",
    image: "/images/chizu/main7.jpg",
    price: 220_000,
    width: 1100,
    height: 1500,
    tags: ["archive", "quiet"],
    status: "Offer",
  },
  {
    id: "work-08",
    title: "Pixel Memory",
    artist: "Mori",
    image: "/images/chizu/main8.png",
    price: 130_000,
    width: 1200,
    height: 1200,
    tags: ["pixel", "memory"],
    status: "Buy now",
  },
  {
    id: "work-09",
    title: "Open Canvas",
    artist: "Sora",
    image: "/images/chizu/main9.png",
    price: 480_000,
    width: 1500,
    height: 1700,
    tags: ["canvas", "exclusive"],
    status: "Auction",
  },
];

const collections = [
  {
    name: "Signal Garden",
    owner: "Haru Studio",
    image: "/images/chizu/cover_default_1.png",
    works: 28,
  },
  {
    name: "Character Proofs",
    owner: "Studio Oji",
    image: "/images/chizu/main4.jpg",
    works: 17,
  },
  {
    name: "Soft Archives",
    owner: "Min Park",
    image: "/images/chizu/main5.jpg",
    works: 42,
  },
  {
    name: "Licensable Frames",
    owner: "Noah Kim",
    image: "/images/chizu/main7.jpg",
    works: 13,
  },
];

const artists = [
  {
    name: "Min Park",
    handle: "@minarchive",
    avatar: "/images/chizu/profile_default_180x180_00.png",
    works: ["/images/chizu/main1.jpg", "/images/chizu/main5.jpg"],
  },
  {
    name: "Haru Studio",
    handle: "@harustudio",
    avatar: "/images/chizu/profile_default_180x180_01.png",
    works: ["/images/chizu/main2.jpg", "/images/chizu/main6.jpg"],
  },
  {
    name: "Noah Kim",
    handle: "@noahdraws",
    avatar: "/images/chizu/profile_default_180x180_00.png",
    works: ["/images/chizu/main3.jpg", "/images/chizu/main9.png"],
  },
];

const tagGroups = [
  { name: "illustration", count: 128 },
  { name: "character", count: 94 },
  { name: "license", count: 72 },
  { name: "anime", count: 66 },
  { name: "exclusive", count: 38 },
  { name: "archive", count: 31 },
  { name: "portrait", count: 29 },
  { name: "concept", count: 24 },
];

function MasonryWorkItem(props: { children: ReactNode; stdHeight: number }) {
  return (
    <article className="min-w-0 rounded-[12px] bg-white">
      {props.children}
    </article>
  );
}

function DiscoverNavMenu({
  active,
  id,
  title,
  onClick,
}: {
  active: boolean;
  id: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={cls(
        "relative flex h-full cursor-pointer items-center justify-center break-keep px-3 text-center text-[13px] font-semibold whitespace-nowrap transition-all hover:text-gray-700",
        active ? "text-gray-700" : "text-gray-300 hover:text-gray-500",
      )}
    >
      {active && (
        <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#F3CC00]" />
      )}
      {title}
    </button>
  );
}

function FilterIcon({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9.5 16a.68.68 0 0 1-.5-.146.68.68 0 0 1-.146-.5v-4.729L4.104 4.812a.49.49 0 0 1-.052-.531A.47.47 0 0 1 4.5 4h11a.47.47 0 0 1 .448.281.49.49 0 0 1-.052.531L11 10.771V15.5a.68.68 0 0 1-.146.354.68.68 0 0 1-.354.146h-1ZM10 9.625 13.375 5.5H6.604L10 9.625Z"
        fill={active ? "#F3CC00" : "#6B7280"}
      />
    </svg>
  );
}

export default function ChizuDiscoverMain() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("work");
  const [query, setQuery] = useState("");
  const [buyNowOnly, setBuyNowOnly] = useState(false);

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return works.filter((work) => {
      const matchesQuery =
        !normalizedQuery ||
        [work.title, work.artist, ...work.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesFilter = !buyNowOnly || work.status === "Buy now";

      return matchesQuery && matchesFilter;
    });
  }, [buyNowOnly, query]);

  return (
    <main className="min-h-screen bg-white text-[#17191C]">
      <header className="sticky top-0 z-99 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-10">
          <Link href="/" className="text-xl font-black tracking-tight">
            CHIZU
          </Link>
          <div className="hidden h-10 w-full max-w-md items-center rounded-md border border-[#D8DBDE] bg-white px-3 md:flex">
            <span className="mr-2 text-[#777D84]">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search works, artists, tags"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#A7ABB0]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demos/image-marketplace-flow"
              className="hidden h-10 items-center rounded-md border border-[#D8DBDE] bg-white px-3 text-sm font-bold text-[#3F444B] transition hover:border-[#17191C] sm:flex"
            >
              Flow demo
            </Link>
            <button className="h-10 rounded-md bg-[#17191C] px-4 text-sm font-bold text-white">
              Sign in
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-10">
        <div className="mb-4 flex h-11 items-center rounded-md border border-[#D8DBDE] bg-white px-3 md:hidden">
          <span className="mr-2 text-[#777D84]">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="h-full w-full bg-transparent text-sm outline-none"
          />
        </div>

        <section className="mx-auto mb-5 w-full">
          {/* {activeTab === "tag" ? null : (
            <p className="mt-4 hidden py-10 text-3xl font-black text-gray-900 max-lg:block">
              Discover
            </p>
          )} */}
          <nav className="flex w-full justify-between">
            <div className="flex w-full flex-col content-center items-start justify-between xl:flex-row">
              <section className="flex w-full items-center justify-between border-b border-[#D8DBDE]">
                <nav className="flex h-[3.75rem] w-full items-center overflow-hidden overflow-x-auto">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className="relative flex h-full items-center justify-center text-center"
                    >
                      <DiscoverNavMenu
                        id={tab.id}
                        title={tab.label}
                        active={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                      />
                    </div>
                  ))}
                </nav>

                {activeTab === "work" ? (
                  <button
                    type="button"
                    onClick={() => setBuyNowOnly((current) => !current)}
                    className={cls(
                      "flex h-8 w-fit max-w-[150px] shrink-0 items-center justify-center gap-1 rounded-md border px-4 text-[13px] font-semibold transition-all max-lg:w-[30px] max-lg:p-0",
                      buyNowOnly
                        ? "border-[#F3CC00]"
                        : "border-[#D5DBE4] hover:border-gray-700",
                    )}
                  >
                    <FilterIcon active={buyNowOnly} className="shrink-0" />
                    <span
                      className={cls(
                        "shrink-0 whitespace-nowrap max-lg:hidden",
                        buyNowOnly ? "text-[#F3CC00]" : "text-gray-500",
                      )}
                    >
                      Filter
                    </span>
                  </button>
                ) : null}
              </section>
            </div>
          </nav>
        </section>

        <section className="py-6">
          {activeTab === "work" && <WorkGrid works={filteredWorks} />}
          {activeTab === "collection" && <CollectionGrid />}
          {activeTab === "artist" && <ArtistGrid />}
          {activeTab === "tag" && <TagGrid />}
        </section>
      </div>
      <style jsx>{`
        body {
          background-color: white !important;
        }
      `}</style>
    </main>
  );
}

function WorkGrid({ works }: { works: WorkItem[] }) {
  const auctionEndTime = useMemo(() => getAuctionEndTime(), []);

  if (works.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-lg border border-[#E6E1D8] bg-white text-sm font-bold text-[#777D84]">
        No works found
      </div>
    );
  }

  return (
    <OrderedMasonry
      className="-ml-5 flex w-auto"
      columnClassName="flex min-w-0 flex-col gap-5 pl-5"
      breakpointCols={{
        default: 6,
        1536: 5,
        1280: 4,
        1024: 3,
        640: 2,
      }}
    >
      {works.map((work) => (
        <MasonryWorkItem key={work.id} stdHeight={work.height / work.width}>
          <MasonryImageCard
            imgUrl={work.image}
            width={work.width}
            height={work.height}
            title={work.title}
            link="/demos/image-marketplace-flow"
            buyNowPrice={work.status === "Buy now" ? work.price : undefined}
            auctionTime={work.status === "Auction" ? auctionEndTime : null}
            userProfile="/images/chizu/profile_default_180x180_00.png"
            userScreenName={work.artist.toLowerCase().replaceAll(" ", "")}
            userAddress={work.id}
            userName={work.artist}
          />
        </MasonryWorkItem>
      ))}
    </OrderedMasonry>
  );
}

function CollectionGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {collections.map((collection) => (
        <article
          key={collection.name}
          className="overflow-hidden rounded-lg border border-[#E6E1D8] bg-white"
        >
          <div className="relative aspect-[4/3] bg-[#EDEEEF]">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="font-black">{collection.name}</h2>
            <p className="mt-1 text-sm text-[#777D84]">{collection.owner}</p>
            <p className="mt-3 text-sm font-bold">{collection.works} works</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function ArtistGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {artists.map((artist) => (
        <article
          key={artist.handle}
          className="rounded-lg border border-[#E6E1D8] bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <Image
              src={artist.avatar}
              alt={artist.name}
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <h2 className="font-black">{artist.name}</h2>
              <p className="text-sm text-[#777D84]">{artist.handle}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {artist.works.map((work) => (
              <div
                key={work}
                className="relative aspect-square overflow-hidden rounded-md bg-[#EDEEEF]"
              >
                <Image
                  src={work}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 14vw, 40vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function TagGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {tagGroups.map((tag) => (
        <button
          key={tag.name}
          className="rounded-lg border border-[#E6E1D8] bg-white p-4 text-left transition hover:border-[#17191C]"
        >
          <p className="font-black">#{tag.name}</p>
          <p className="mt-2 text-sm text-[#777D84]">{tag.count} works</p>
        </button>
      ))}
    </div>
  );
}

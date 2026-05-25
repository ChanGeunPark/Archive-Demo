import type { DiscoverTabItem } from "./discoverTypes";

export const DISCOVER_TABS: DiscoverTabItem[] = [
  { id: "work", label: "작품" },
  { id: "collection", label: "컬렉션" },
  { id: "artist", label: "작가" },
  { id: "tag", label: "태그" },
];

export const collections = [
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

export const artists = [
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

export const tagGroups = [
  { name: "illustration", count: 128 },
  { name: "character", count: 94 },
  { name: "license", count: 72 },
  { name: "anime", count: 66 },
  { name: "exclusive", count: 38 },
  { name: "archive", count: 31 },
  { name: "portrait", count: 29 },
  { name: "concept", count: 24 },
];

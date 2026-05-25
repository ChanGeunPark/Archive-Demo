import type { MarketplaceUser } from "./marketplaceTypes";

export const marketplaceUsers: Record<string, MarketplaceUser> = {
  min: {
    id: "min",
    name: "Min Park",
    handle: "minarchive",
    avatar: "/images/chizu/profile_default_180x180_00.png",
  },
  haru: {
    id: "haru",
    name: "Haru Studio",
    handle: "harustudio",
    avatar: "/images/chizu/profile_default_180x180_01.png",
  },
  noah: {
    id: "noah",
    name: "Noah Kim",
    handle: "noahdraws",
    avatar: "/images/chizu/profile_default_180x180_00.png",
  },
  yuna: {
    id: "yuna",
    name: "Yuna Lee",
    handle: "yunalee",
    avatar: "/images/chizu/profile_default_180x180_01.png",
  },
  collectorA: {
    id: "collector-a",
    name: "Jin Collector",
    handle: "jincollects",
    avatar: "/images/chizu/profile_default_180x180_01.png",
  },
  collectorB: {
    id: "collector-b",
    name: "Sora Buyer",
    handle: "sorabuyer",
    avatar: "/images/chizu/profile_default_180x180_00.png",
  },
  guest: {
    id: "guest",
    name: "Guest User",
    handle: "guest",
    avatar: "/images/chizu/profile_default_180x180_00.png",
  },
};

export function createDemoUserFromId(id: string): MarketplaceUser {
  const normalized = id.trim() || "guest";

  return {
    id: normalized,
    name: normalized,
    handle: normalized.toLowerCase().replaceAll(" ", "-"),
    avatar: "/images/chizu/profile_default_180x180_00.png",
  };
}

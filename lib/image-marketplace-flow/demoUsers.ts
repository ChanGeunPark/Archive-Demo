import type { MarketplaceUser } from "./marketplaceTypes";

export const marketplaceUsers: Record<string, MarketplaceUser> = {
  min: {
    id: "min",
    name: "Min Park",
    handle: "minarchive",
    avatar: "/images/marketplace/profile/profile_default_180x180_00.jpg",
  },
  haru: {
    id: "haru",
    name: "Haru Studio",
    handle: "harustudio",
    avatar: "/images/marketplace/profile/profile_default_180x180_01.jpg",
  },
  noah: {
    id: "noah",
    name: "Noah Kim",
    handle: "noahdraws",
    avatar: "/images/marketplace/profile/betidraws-cute-7920120_1920.jpg",
  },
  yuna: {
    id: "yuna",
    name: "Yuna Lee",
    handle: "yunalee",
    avatar: "/images/marketplace/profile/mimosaai-ai-generated-8203396_1920.jpg",
  },
  collectorA: {
    id: "collector-a",
    name: "Jin Collector",
    handle: "jincollects",
    avatar: "/images/marketplace/profile/arl_dlt-girl-7432855_1920.jpg",
  },
  collectorB: {
    id: "collector-b",
    name: "Sora Buyer",
    handle: "sorabuyer",
    avatar: "/images/marketplace/profile/betidraws-fairy-tale-9502808_1920.jpg",
  },
  guest: {
    id: "guest",
    name: "Guest User",
    handle: "guest",
    avatar: "/images/marketplace/profile/profile_default_180x180_00.jpg",
  },
};

export function createDemoUserFromId(id: string): MarketplaceUser {
  const normalized = id.trim() || "guest";

  return {
    id: normalized,
    name: normalized,
    handle: normalized.toLowerCase().replaceAll(" ", "-"),
    avatar: "/images/marketplace/profile/profile_default_180x180_00.jpg",
  };
}

export const DEFAULT_MARKETPLACE_AVATAR =
  "/images/marketplace/profile/profile_default_180x180_00.jpg";

export const MARKETPLACE_AVATAR_PRESETS = [
  DEFAULT_MARKETPLACE_AVATAR,
  "/images/marketplace/profile/arl_dlt-girl-7432855_1920.jpg",
  "/images/marketplace/profile/betidraws-cute-7920120_1920.jpg",
  "/images/marketplace/profile/betidraws-fairy-tale-9502808_1920.jpg",
  "/images/marketplace/profile/dg-ra-anime-7397617_1920.png",
  "/images/marketplace/profile/mimosaai-ai-generated-8203396_1920.jpg",
] as const;

export function resolveMarketplaceAvatar(avatar?: string | null) {
  const trimmed = avatar?.trim();
  return trimmed || DEFAULT_MARKETPLACE_AVATAR;
}

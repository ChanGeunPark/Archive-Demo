export const DEFAULT_MARKETPLACE_AVATAR =
  "/images/chizu/profile_default_180x180_00.png";

export const MARKETPLACE_AVATAR_PRESETS = [
  DEFAULT_MARKETPLACE_AVATAR,
  "/images/chizu/profile_default_180x180_01.png",
] as const;

export function resolveMarketplaceAvatar(avatar?: string | null) {
  const trimmed = avatar?.trim();
  return trimmed || DEFAULT_MARKETPLACE_AVATAR;
}

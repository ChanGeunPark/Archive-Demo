import type { ListingStatus, UsageRight } from "./marketplaceTypes";

export type ArtworkLicensePolicy =
  | "exclusive"
  | "commercial"
  | "commercial-no-ai"
  | "personal"
  | "portfolio"
  | "open";

const USAGE_RIGHT_LABELS = [
  "상업적 이용 가능",
  "독점 사용권 이전",
  "2차 수정 가능",
  "재판매 가능",
] as const;

const LICENSE_USAGE_CHECKS: Record<
  ArtworkLicensePolicy,
  [boolean, boolean, boolean, boolean]
> = {
  exclusive: [true, true, true, false],
  commercial: [true, true, true, true],
  "commercial-no-ai": [true, true, false, true],
  personal: [true, false, false, true],
  portfolio: [false, false, true, true],
  open: [true, true, true, true],
};

export function licensePolicyToUsageRights(
  policy: ArtworkLicensePolicy,
): UsageRight[] {
  const checks = LICENSE_USAGE_CHECKS[policy];

  return USAGE_RIGHT_LABELS.map((label, index) => ({
    label,
    enabled: checks[index],
  }));
}

export function resolveListingStatus(
  askingPrice: number | null,
  allowOffers: boolean,
): ListingStatus {
  if (askingPrice && askingPrice > 0) {
    return "LISTED";
  }

  return allowOffers ? "OFFER_OPEN" : "NOT_LISTED";
}

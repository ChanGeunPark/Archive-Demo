import type {
  ListingStatus,
  MarketplaceOfferStatus,
  MarketplaceUser,
  Offer,
  UsageRight,
  Work,
  WorkOwnershipStatus,
} from "../marketplaceTypes";
import { DEFAULT_AVATAR } from "./constants";
import type { OfferRow, UserRow, WorkRow, WorkWithRelations } from "./types";

/** User row → MarketplaceUser */
export function mapUser(row: UserRow | null | undefined): MarketplaceUser {
  if (!row) {
    return {
      id: "unknown",
      name: "Unknown",
      handle: "unknown",
      avatar: DEFAULT_AVATAR,
    };
  }

  return {
    id: row.id,
    name: row.display_name,
    handle: row.handle,
    avatar: row.avatar_url ?? DEFAULT_AVATAR,
  };
}

/** Offer row → Offer */
export function mapOffer(row: OfferRow & { bidder: UserRow | null }): Offer {
  return {
    id: row.id,
    amount: row.amount,
    status: row.status as MarketplaceOfferStatus,
    bidder: mapUser(row.bidder),
    createdAt: row.created_at,
  };
}

/** usage_rights JSON → UsageRight[] */
function mapUsageRights(value: WorkRow["usage_rights"]): UsageRight[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("label" in item) ||
      !("enabled" in item)
    ) {
      return [];
    }

    return [
      {
        label: String(item.label),
        enabled: Boolean(item.enabled),
      },
    ];
  });
}

/** Work row → Work */
export function mapWork(row: WorkWithRelations, includeOffers = false): Work {
  const offers = includeOffers
    ? (row.marketplace_demo_offers ?? []).map(mapOffer)
    : [];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    imageId: row.image_id,
    width: row.width,
    height: row.height,
    tags: row.tags ?? [],
    listingStatus: row.listing_status as ListingStatus,
    ownershipStatus: row.ownership_status as WorkOwnershipStatus,
    askingPrice: row.asking_price,
    lastSalePrice: row.last_sale_price,
    offerCount: row.offer_count,
    usageRights: mapUsageRights(row.usage_rights),
    creator: mapUser(row.creator),
    owner: mapUser(row.owner),
    offers,
  };
}

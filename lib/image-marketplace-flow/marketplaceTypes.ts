export type MarketplaceUser = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
};

export type WorkOwnershipStatus = "OWNED_BY_CREATOR" | "OWNED_BY_COLLECTOR";

export type ListingStatus = "LISTED" | "NOT_LISTED" | "OFFER_OPEN";

export type MarketplaceOfferStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type UsageRight = {
  label: string;
  enabled: boolean;
};

export type MarketplaceOffer = {
  id: string;
  workId: string;
  bidder: MarketplaceUser;
  amount: number;
  status: MarketplaceOfferStatus;
  createdAt: string;
};

/** GraphQL / repository용 중첩 offer (workId는 부모 Work에 포함) */
export type Offer = {
  id: string;
  amount: number;
  status: MarketplaceOfferStatus;
  bidder: MarketplaceUser;
  createdAt: string;
};

/** GraphQL / repository용 작품 도메인 타입 */
export type Work = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  tags: string[];
  listingStatus: ListingStatus;
  ownershipStatus: WorkOwnershipStatus;
  askingPrice: number | null;
  lastSalePrice: number | null;
  offerCount: number;
  creator: MarketplaceUser;
  owner: MarketplaceUser;
  offers: Offer[];
};

export type OwnershipTransferEvent = {
  type: "WORK_OWNERSHIP_TRANSFERRED" | "OFFER_ACCEPTED";
  workId: string;
  newOwnerId: string;
  transactionId: string;
  occurredAt: string;
};

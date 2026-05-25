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

export type OwnershipTransferEvent = {
  type: "WORK_OWNERSHIP_TRANSFERRED" | "OFFER_ACCEPTED";
  workId: string;
  newOwnerId: string;
  transactionId: string;
  occurredAt: string;
};

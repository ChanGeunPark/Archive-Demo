import { Work, Offer, OwnershipTransferEvent, MarketplaceUser } from "../marketplaceTypes";

export type WorksQueryWork = Pick<
  Work,
  | "id"
  | "title"
  | "imageUrl"
  | "width"
  | "height"
  | "listingStatus"
  | "askingPrice"
> & {
  owner: Pick<Work["owner"], "id" | "name" | "handle" | "avatar">;
};
export type WorksQueryVariables = {
  first?: number;
  after?: string;
  query?: string;
  buyNowOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type WorksQueryResponse = {
  works: {
    edges: { cursor: string; node: WorksQueryWork }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    totalCount: number | null;
  };
};

export type CreatorWorksQueryVariables = {
  creatorId: string;
  first?: number;
  excludeWorkId?: string;
};

export type CreatorWorksQueryResponse = {
  creatorWorks: WorksQueryWork[];
};

export type RandomWorksQueryVariables = {
  first?: number;
  excludeWorkId?: string;
};

export type RandomWorksQueryResponse = {
  randomWorks: WorksQueryWork[];
};
export type WorkDetailQueryResponse = {
  work: Work | null;
};
export type CreateWorkMutationResponse = {
  createWork: Pick<
    Work,
    "id" | "title" | "imageUrl" | "listingStatus" | "askingPrice"
  >;
};
export type DeleteWorkMutationResponse = {
  deleteWork: boolean;
};
export type BuyWorkMutationResponse = {
  buyWork: OwnershipTransferEvent;
};
export type CreateOfferMutationResponse = {
  createOffer: Offer;
};
export type AcceptOfferMutationResponse = {
  acceptOffer: OwnershipTransferEvent;
};
export type UserQueryResponse = {
  user: MarketplaceUser | null;
};
export type UpdateUserAvatarMutationResponse = {
  updateUserAvatar: MarketplaceUser;
};
export type UpdateAskingPriceMutationResponse = {
  updateAskingPrice: Pick<Work, "id" | "listingStatus" | "askingPrice">;
};

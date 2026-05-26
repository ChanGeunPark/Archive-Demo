import { Work, Offer, OwnershipTransferEvent } from "../marketplaceTypes";

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
export type WorksQueryResponse = {
  works: WorksQueryWork[];
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

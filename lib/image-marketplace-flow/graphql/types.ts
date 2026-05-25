import { Work } from "../marketplaceTypes";

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
  owner: Pick<Work["owner"], "id" | "name" | "avatar">;
};
export type WorksQueryResponse = {
  works: WorksQueryWork[];
};
export type WorkDetailQueryResponse = {
  work: Work | null;
};

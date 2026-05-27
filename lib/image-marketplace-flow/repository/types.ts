import type { Tables } from "@/lib/supabase/database.types";
import type { UsageRight, Work } from "../marketplaceTypes";

export type UserRow = Tables<"marketplace_demo_users">;
export type WorkRow = Tables<"marketplace_demo_works">;
export type OfferRow = Tables<"marketplace_demo_offers">;
export type EventRow = Tables<"marketplace_demo_events">;

export type WorkWithRelations = WorkRow & {
  creator: UserRow | null;
  owner: UserRow | null;
  marketplace_demo_offers?: (OfferRow & { bidder: UserRow | null })[];
};

export type CreateWorkInput = {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageId?: string | null;
  width?: number;
  height?: number;
  tags?: string[];
  creatorId: string;
  ownerId?: string;
  askingPrice?: number | null;
  allowOffers?: boolean;
  usageRights?: UsageRight[];
};

export type ListWorksOptions = {
  first?: number;
  after?: string;
  query?: string;
  buyNowOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type ListCreatorWorksOptions = {
  creatorId: string;
  first?: number;
  excludeWorkId?: string;
};

export type ListRandomWorksOptions = {
  first?: number;
  excludeWorkId?: string;
};

export type ListWorksByUserIdOptions = {
  userId: string;
  first?: number;
};

export type WorkEdge = {
  cursor: string;
  node: Work;
};

export type WorksPageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type WorksConnection = {
  edges: WorkEdge[];
  pageInfo: WorksPageInfo;
  totalCount: number | null;
};

export type SearchByKeywordResult = {
  works: Work[];
};

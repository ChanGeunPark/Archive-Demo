/**
 * 마켓플레이스 데모의 Supabase 데이터 접근 계층.
 *
 * DB row ↔ GraphQL 도메인 타입 변환을 담당합니다.
 * 환경 변수가 없거나 쿼리가 실패하면 빈 배열/null을 반환하고 콘솔에 경고를 남깁니다.
 */
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type { Tables } from "@/lib/supabase/database.types";
import type {
  ListingStatus,
  MarketplaceOfferStatus,
  MarketplaceUser,
  Offer,
  Work,
  WorkOwnershipStatus,
} from "./marketplaceTypes";


type UserRow = Tables<"marketplace_demo_users">;
type WorkRow = Tables<"marketplace_demo_works">;
type OfferRow = Tables<"marketplace_demo_offers">;

type WorkWithRelations = WorkRow & {
  creator: UserRow | null;
  owner: UserRow | null;
  marketplace_demo_offers?: (OfferRow & { bidder: UserRow | null })[];
};

const DEFAULT_AVATAR = "/images/chizu/profile_default_180x180_00.png";

const WORK_BASE_SELECT = `
  *,
  creator:marketplace_demo_users!creator_id(*),
  owner:marketplace_demo_users!owner_id(*)
`;

const WORK_DETAIL_SELECT = `
  ${WORK_BASE_SELECT},
  marketplace_demo_offers(
    *,
    bidder:marketplace_demo_users!bidder_id(*)
  )
`;

function logSupabaseFallback(scope: string, error: unknown) {
  const details =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);

  console.warn(
    `[marketplace-demo] ${scope}. Falling back to local demo data.`,
    details,
  );
}

function mapUser(row: UserRow | null | undefined): MarketplaceUser {
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

function mapOffer(row: OfferRow & { bidder: UserRow | null }): Offer {
  return {
    id: row.id,
    amount: row.amount,
    status: row.status as MarketplaceOfferStatus,
    bidder: mapUser(row.bidder),
    createdAt: row.created_at,
  };
}

function mapWork(row: WorkWithRelations, includeOffers = false): Work {
  const offers = includeOffers
    ? (row.marketplace_demo_offers ?? []).map(mapOffer)
    : [];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    width: row.width,
    height: row.height,
    tags: row.tags ?? [],
    listingStatus: row.listing_status as ListingStatus,
    ownershipStatus: row.ownership_status as WorkOwnershipStatus,
    askingPrice: row.asking_price,
    lastSalePrice: row.last_sale_price,
    offerCount: row.offer_count,
    creator: mapUser(row.creator),
    owner: mapUser(row.owner),
    offers,
  };
}

export async function listWorks(): Promise<Work[]> {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("marketplace_demo_works")
      .select(WORK_BASE_SELECT)
      .order("created_at", { ascending: false });

    if (error || !data) {
      logSupabaseFallback("Failed to load works", error);
      return [];
    }

    return data.map((row) => mapWork(row as WorkWithRelations));
  } catch (error) {
    logSupabaseFallback("Failed to load works", error);
    return [];
  }
}

export async function getWorkById(id: string): Promise<Work | null> {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("marketplace_demo_works")
      .select(WORK_DETAIL_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      logSupabaseFallback(`Failed to load work ${id}`, error);
      return null;
    }

    const work = mapWork(data as WorkWithRelations, true);
    work.offers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return work;
  } catch (error) {
    logSupabaseFallback(`Failed to load work ${id}`, error);
    return null;
  }
}

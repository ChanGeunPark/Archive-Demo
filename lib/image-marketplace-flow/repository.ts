/**
 * 마켓플레이스 데모의 Supabase 데이터 접근 계층.
 *
 * DB row ↔ GraphQL 도메인 타입 변환을 담당합니다.
 * 환경 변수가 없거나 쿼리가 실패하면 빈 배열/null을 반환하고 콘솔에 경고를 남깁니다.
 */
import { deleteImageFromCloudflare } from "@/lib/cloudflare/images";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type { Tables } from "@/lib/supabase/database.types";
import { createDemoUserFromId } from "./demoUsers";
import { resolveListingStatus } from "./artworkCreateUtils";
import type {
  ListingStatus,
  MarketplaceOfferStatus,
  MarketplaceUser,
  Offer,
  UsageRight,
  Work,
  WorkOwnershipStatus,
} from "./marketplaceTypes";

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

/** Supabase 오류 로그 */
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

/** User row → MarketplaceUser */
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

/** Offer row → Offer */
function mapOffer(row: OfferRow & { bidder: UserRow | null }): Offer {
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

/** 데모 사용자 DB upsert */
async function ensureMarketplaceUser(userId: string) {
  const user = createDemoUserFromId(userId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("marketplace_demo_users").upsert(
    {
      id: user.id,
      display_name: user.name,
      handle: user.handle,
      avatar_url: user.avatar,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

/** Work row → Work */
function mapWork(row: WorkWithRelations, includeOffers = false): Work {
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

/** 작품 목록 조회 */
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

/** 작품 생성 */
export async function createWork(input: CreateWorkInput): Promise<Work> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is not configured.");
  }

  const askingPrice =
    input.askingPrice && input.askingPrice > 0 ? input.askingPrice : null;
  const allowOffers = input.allowOffers ?? true;
  const ownerId = input.ownerId ?? input.creatorId;
  const id = input.id ?? `work-${Date.now()}`;

  try {
    const supabase = createSupabaseAdminClient();
    await ensureMarketplaceUser(input.creatorId);
    if (ownerId !== input.creatorId) {
      await ensureMarketplaceUser(ownerId);
    }

    const { data, error } = await supabase
      .from("marketplace_demo_works")
      .insert({
        id,
        title: input.title,
        description: input.description ?? "",
        image_url: input.imageUrl,
        image_id: input.imageId ?? null,
        width: input.width ?? 1000,
        height: input.height ?? 1000,
        creator_id: input.creatorId,
        owner_id: ownerId,
        ownership_status: "OWNED_BY_CREATOR",
        listing_status: resolveListingStatus(askingPrice, allowOffers),
        asking_price: askingPrice,
        last_sale_price: null,
        offer_count: 0,
        tags: input.tags ?? [],
        usage_rights: input.usageRights ?? [],
      })
      .select(WORK_BASE_SELECT)
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to create work.");
    }

    return mapWork(data as WorkWithRelations);
  } catch (error) {
    logSupabaseFallback("Failed to create work", error);
    throw error instanceof Error ? error : new Error("Failed to create work.");
  }
}

/** 작품 단건 조회 (오퍼 포함) */
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

/** 작품 삭제 (Cloudflare 이미지 포함) */
export async function deleteWork(
  id: string,
): Promise<{ success: boolean; error: string | null }> {
  if (!hasSupabaseAdminEnv()) {
    return { success: false, error: "Failed to delete work." };
  }

  try {
    const supabase = createSupabaseAdminClient();

    const work = await getWorkById(id);
    if (!work) {
      throw new Error("Work not found");
    }

    if (work.imageId) {
      await deleteImageFromCloudflare(work.imageId);
    }

    const { error } = await supabase
      .from("marketplace_demo_works")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    logSupabaseFallback(`Failed to delete work ${id}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete work.",
    };
  }
}

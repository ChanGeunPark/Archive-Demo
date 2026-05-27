import { deleteImageFromCloudflare } from "@/lib/cloudflare/images";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { resolveListingStatus } from "../artworkCreateUtils";
import type { Work } from "../marketplaceTypes";
import {
  RANDOM_WORKS_POOL_SIZE,
  WORK_BASE_SELECT,
  WORK_DETAIL_SELECT,
} from "./constants";
import { logSupabaseFallback } from "./logging";
import { mapWork } from "./mappers";
import {
  decodeWorkCursor,
  emptyWorksConnection,
  encodeWorkCursor,
} from "./pagination";
import { resolveWorkKeywordOrFilter } from "./search";
import type {
  CreateWorkInput,
  ListCreatorWorksOptions,
  ListRandomWorksOptions,
  ListWorksByUserIdOptions,
  ListWorksOptions,
  WorkEdge,
  WorkWithRelations,
  WorksConnection,
} from "./types";
import { ensureMarketplaceUser } from "./users";

function shuffleWorks<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

/** 작품 목록 조회 (cursor 기반 페이지네이션) */
export async function listWorks(
  options: ListWorksOptions = {},
): Promise<WorksConnection> {
  if (!hasSupabaseAdminEnv()) {
    return emptyWorksConnection();
  }

  const { first, after, query, buyNowOnly, minPrice, maxPrice } = options;

  try {
    const supabase = createSupabaseAdminClient();
    let dbQuery = supabase
      .from("marketplace_demo_works")
      .select(WORK_BASE_SELECT, { count: "exact" })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (after) {
      const cursor = decodeWorkCursor(after);
      if (cursor) {
        const createdAtFilter = `"${cursor.createdAt}"`;
        const idFilter = `"${cursor.id}"`;
        dbQuery = dbQuery.or(
          `created_at.lt.${createdAtFilter},and(created_at.eq.${createdAtFilter},id.lt.${idFilter})`,
        );
      }
    }

    if (buyNowOnly) {
      dbQuery = dbQuery.eq("listing_status", "LISTED").gt("asking_price", 0);
    }

    if (typeof minPrice === "number") {
      dbQuery = dbQuery.gte("asking_price", minPrice);
    }

    if (typeof maxPrice === "number") {
      dbQuery = dbQuery.lte("asking_price", maxPrice);
    }

    if (query?.trim()) {
      const workOrFilter = await resolveWorkKeywordOrFilter(supabase, query);
      if (workOrFilter) {
        dbQuery = dbQuery.or(workOrFilter);
      }
    }

    if (typeof first === "number" && first > 0) {
      dbQuery = dbQuery.limit(first + 1);
    }

    const { data, error, count } = await dbQuery;

    if (error || !data) {
      logSupabaseFallback("Failed to load works", error);
      return emptyWorksConnection();
    }

    const rows = data as WorkWithRelations[];
    const hasNextPage =
      typeof first === "number" && first > 0 && rows.length > first;
    const pageRows = hasNextPage ? rows.slice(0, first) : rows;

    const edges: WorkEdge[] = pageRows.map((row) => ({
      cursor: encodeWorkCursor(row.created_at, row.id),
      node: mapWork(row),
    }));

    const lastRow = pageRows.at(-1);

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor: lastRow
          ? encodeWorkCursor(lastRow.created_at, lastRow.id)
          : null,
      },
      totalCount: count,
    };
  } catch (error) {
    logSupabaseFallback("Failed to load works", error);
    return emptyWorksConnection();
  }
}

/** 제작자의 다른 작품 목록 조회 */
export async function listCreatorWorks(
  options: ListCreatorWorksOptions,
): Promise<Work[]> {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const { creatorId, first = 10, excludeWorkId } = options;

  try {
    const supabase = createSupabaseAdminClient();
    let dbQuery = supabase
      .from("marketplace_demo_works")
      .select(WORK_BASE_SELECT)
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(first);

    if (excludeWorkId) {
      dbQuery = dbQuery.neq("id", excludeWorkId);
    }

    const { data, error } = await dbQuery;

    if (error || !data) {
      logSupabaseFallback("Failed to load creator works", error);
      return [];
    }

    return (data as WorkWithRelations[]).map((row) => mapWork(row));
  } catch (error) {
    logSupabaseFallback("Failed to load creator works", error);
    return [];
  }
}

/** 사용자(creator 또는 owner)의 작품 목록 조회 */
export async function listWorksByUserId(
  options: ListWorksByUserIdOptions,
): Promise<Work[]> {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const { userId, first } = options;

  try {
    const supabase = createSupabaseAdminClient();
    let dbQuery = supabase
      .from("marketplace_demo_works")
      .select(WORK_BASE_SELECT)
      .or(`creator_id.eq.${userId},owner_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (typeof first === "number" && first > 0) {
      dbQuery = dbQuery.limit(first);
    }

    const { data, error } = await dbQuery;

    if (error || !data) {
      logSupabaseFallback(`Failed to load works for user ${userId}`, error);
      return [];
    }

    return (data as WorkWithRelations[]).map((row) => mapWork(row));
  } catch (error) {
    logSupabaseFallback(`Failed to load works for user ${userId}`, error);
    return [];
  }
}

/** 랜덤 작품 목록 조회 */
export async function listRandomWorks(
  options: ListRandomWorksOptions = {},
): Promise<Work[]> {
  const { first = 10, excludeWorkId } = options;
  const connection = await listWorks({ first: RANDOM_WORKS_POOL_SIZE });
  const pool = connection.edges
    .map((edge) => edge.node)
    .filter((work) => work.id !== excludeWorkId);

  return shuffleWorks(pool).slice(0, first);
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

/** 판매 희망가 변경 (현재 소유자만) */
export async function updateAskingPrice(input: {
  workId: string;
  ownerId: string;
  askingPrice: number;
}): Promise<Work> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is not configured.");
  }

  if (input.askingPrice <= 0) {
    throw new Error("Asking price must be greater than zero.");
  }

  const work = await getWorkById(input.workId);
  if (!work) {
    throw new Error("Work not found.");
  }

  if (work.owner.id !== input.ownerId) {
    throw new Error("Only the current owner can update the asking price.");
  }

  if (
    work.askingPrice &&
    work.askingPrice > 0 &&
    input.askingPrice <= work.askingPrice
  ) {
    throw new Error(
      "New asking price must be higher than the current asking price.",
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("marketplace_demo_works")
    .update({
      asking_price: input.askingPrice,
      listing_status: resolveListingStatus(input.askingPrice, false),
    })
    .eq("id", input.workId)
    .select(WORK_DETAIL_SELECT)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update asking price.");
  }

  return mapWork(data as WorkWithRelations);
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

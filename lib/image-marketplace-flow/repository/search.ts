import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { WORK_BASE_SELECT } from "./constants";
import { logSupabaseFallback } from "./logging";
import { mapWork } from "./mappers";
import type { SearchByKeywordResult, WorkWithRelations } from "./types";

function escapeIlikeTerm(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

async function getCreatorIdsMatchingKeyword(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  keyword: string,
) {
  const term = escapeIlikeTerm(keyword.trim());
  const { data } = await supabase
    .from("marketplace_demo_users")
    .select("id")
    .or(`display_name.ilike.%${term}%,handle.ilike.%${term}%`);

  return data?.map((row) => row.id) ?? [];
}

function buildWorkKeywordOrFilter(keyword: string, creatorIds: string[]) {
  const term = escapeIlikeTerm(keyword.trim());
  const filters = [`title.ilike.%${term}%`];

  if (creatorIds.length > 0) {
    filters.push(`creator_id.in.(${creatorIds.join(",")})`);
  }

  return filters.join(",");
}

export async function resolveWorkKeywordOrFilter(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  keyword: string,
) {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return null;
  }

  const creatorIds = await getCreatorIdsMatchingKeyword(supabase, trimmed);
  return buildWorkKeywordOrFilter(trimmed, creatorIds);
}

/** 키워드 자동완성 검색 (작품) */
export async function searchByKeyword(
  keyword: string,
  count = 4,
): Promise<SearchByKeywordResult> {
  const emptyResult: SearchByKeywordResult = { works: [] };

  if (!hasSupabaseAdminEnv() || !keyword.trim()) {
    return emptyResult;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const trimmed = keyword.trim();
    const workOrFilter = await resolveWorkKeywordOrFilter(supabase, trimmed);

    if (!workOrFilter) {
      return emptyResult;
    }

    const { data: workRows, error: worksError } = await supabase
      .from("marketplace_demo_works")
      .select(WORK_BASE_SELECT)
      .or(workOrFilter)
      .order("created_at", { ascending: false })
      .limit(count);

    return {
      works: worksError
        ? []
        : (workRows as WorkWithRelations[] | null)?.map((row) => mapWork(row)) ??
          [],
    };
  } catch (error) {
    logSupabaseFallback("Failed to search by keyword", error);
    return emptyResult;
  }
}

import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { createDemoUserFromId } from "../demoUsers";
import type { MarketplaceUser } from "../marketplaceTypes";
import { logSupabaseFallback } from "./logging";
import { mapUser } from "./mappers";
import type { UserRow } from "./types";

/** 데모 사용자 DB upsert */
export async function ensureMarketplaceUser(userId: string) {
  const user = createDemoUserFromId(userId);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("marketplace_demo_users").upsert(
    {
      id: user.id,
      display_name: user.name,
      handle: user.handle,
      avatar_url: user.avatar,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );

  if (error) {
    throw new Error(error.message);
  }
}

/** 사용자 단건 조회 */
export async function getUserById(
  userId: string,
): Promise<MarketplaceUser | null> {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("marketplace_demo_users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      logSupabaseFallback(`Failed to load user ${userId}`, error);
      return null;
    }

    return mapUser(data as UserRow);
  } catch (error) {
    logSupabaseFallback(`Failed to load user ${userId}`, error);
    return null;
  }
}

/** 사용자 아바타 URL 변경 */
export async function updateUserAvatar(
  userId: string,
  avatarUrl: string,
): Promise<MarketplaceUser> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is not configured.");
  }

  const trimmed = avatarUrl.trim();
  if (!trimmed) {
    throw new Error("Avatar URL is required.");
  }

  await ensureMarketplaceUser(userId);

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("marketplace_demo_users")
    .update({ avatar_url: trimmed })
    .eq("id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update avatar.");
  }

  return mapUser(data as UserRow);
}

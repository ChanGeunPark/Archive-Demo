import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { addDemoCharacter, demoCharacters, findDemoCharacter } from "./mock-data";
import type { DemoCharacter, DemoChatMessage, DemoPublicCharacter } from "./types";

type CharacterRow = {
  id: string;
  name: string;
  role: string;
  category: string | null;
  gender: string | null;
  image_url: string | null;
  image_id: string | null;
  banner_image_url: string | null;
  banner_image_id: string | null;
  image_gradient: string;
  tags: string[] | null;
  description: string;
  status_message: string | null;
  world_view: string;
  opening_message: string;
  seed_chat: string[] | null;
  sample_messages: string[] | null;
  total_chat_count: number | null;
};

type MessageRow = {
  id: string;
  room_id: string;
  character_id: string;
  role: "human" | "ai";
  content: string;
  created_at: string;
};

function mapCharacter(row: CharacterRow): DemoCharacter {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    category: row.category ?? "CHARACTER",
    gender: row.gender ?? "ETC",
    imageUrl: row.image_url,
    imageId: row.image_id,
    bannerImageUrl: row.banner_image_url,
    bannerImageId: row.banner_image_id,
    imageGradient: row.image_gradient,
    tags: row.tags ?? [],
    description: row.description,
    statusMessage: row.status_message,
    worldView: row.world_view,
    openingMessage: row.opening_message,
    seedChat: row.seed_chat ?? [],
    sampleMessages: row.sample_messages ?? [],
    totalChatCount: row.total_chat_count ?? 0,
  };
}

export function toPublicCharacter(character: DemoCharacter): DemoPublicCharacter {
  return {
    id: character.id,
    name: character.name,
    role: character.role,
    category: character.category,
    gender: character.gender,
    imageUrl: character.imageUrl,
    imageId: character.imageId,
    bannerImageUrl: character.bannerImageUrl,
    bannerImageId: character.bannerImageId,
    imageGradient: character.imageGradient,
    tags: character.tags,
    description: character.description,
    statusMessage: character.statusMessage,
    openingMessage: character.openingMessage,
    seedChat: character.seedChat,
    sampleMessages: character.sampleMessages,
    totalChatCount: character.totalChatCount,
  };
}

export async function createDemoCharacter(input: {
  id: string;
  name: string;
  role: string;
  category: string;
  gender: string;
  imageUrl: string | null;
  imageId: string | null;
  bannerImageUrl: string | null;
  bannerImageId: string | null;
  imageGradient: string;
  tags: string[];
  description: string;
  statusMessage: string | null;
  worldView: string;
  openingMessage: string;
  seedChat: string[];
  sampleMessages: string[];
}) {
  if (!hasSupabaseAdminEnv()) {
    return addDemoCharacter({
      ...input,
      totalChatCount: 0,
    } satisfies DemoCharacter);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_demo_characters")
    .insert({
      id: input.id,
      name: input.name,
      role: input.role,
      category: input.category,
      gender: input.gender,
      image_url: input.imageUrl,
      image_id: input.imageId,
      banner_image_url: input.bannerImageUrl,
      banner_image_id: input.bannerImageId,
      image_gradient: input.imageGradient,
      tags: input.tags,
      description: input.description,
      status_message: input.statusMessage,
      world_view: input.worldView,
      opening_message: input.openingMessage,
      seed_chat: input.seedChat,
      sample_messages: input.sampleMessages,
      total_chat_count: 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create character.");
  }

  return mapCharacter(data as CharacterRow);
}

function mapMessage(row: MessageRow): DemoChatMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    characterId: row.character_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

function logSupabaseFallback(scope: string, error: unknown) {
  const details =
    error && typeof error === "object"
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : String(error);

  console.warn(`[ai-demo] ${scope}. Falling back to local demo data.`, details);
}

export async function getDemoCharacters() {
  if (!hasSupabaseAdminEnv()) {
    return demoCharacters;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_demo_characters")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    logSupabaseFallback("Failed to load characters", error);
    return demoCharacters;
  }

  return (data as CharacterRow[]).map(mapCharacter);
}

export async function getDemoCharacter(characterId: string) {
  if (!hasSupabaseAdminEnv()) {
    return findDemoCharacter(characterId) ?? null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_demo_characters")
    .select("*")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !data) {
    logSupabaseFallback("Failed to load character", error);
    return findDemoCharacter(characterId) ?? null;
  }

  return mapCharacter(data as CharacterRow);
}

export async function getDemoChatHistory(roomId: string) {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_demo_chat_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    logSupabaseFallback("Failed to load chat history", error);
    return [];
  }

  return (data as MessageRow[]).map(mapMessage);
}

export async function createDemoChatRoom(input: {
  roomId: string;
  characterId: string;
}) {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { error: roomError } = await supabase.from("ai_demo_chat_rooms").upsert(
    {
      id: input.roomId,
      character_id: input.characterId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (roomError) {
    logSupabaseFallback("Failed to upsert chat room", roomError);
    return null;
  }

  return {
    id: input.roomId,
    characterId: input.characterId,
  };
}

export async function saveDemoMessage(input: {
  roomId: string;
  characterId: string;
  role: "human" | "ai";
  content: string;
}) {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  await createDemoChatRoom({
    roomId: input.roomId,
    characterId: input.characterId,
  });

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("ai_demo_chat_messages")
    .insert({
      room_id: input.roomId,
      character_id: input.characterId,
      role: input.role,
      content: input.content,
    })
    .select("*")
    .single();

  if (error || !data) {
    logSupabaseFallback("Failed to save message", error);
    return null;
  }

  return mapMessage(data as MessageRow);
}

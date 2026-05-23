import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import {
  addDemoCharacter,
  deleteDemoCharacter,
  demoCharacters,
  findDemoCharacter,
} from "./mock-data";
import type {
  DemoCharacter,
  DemoChatMessage,
  DemoPublicCharacter,
} from "./types";

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
  creator_id: string | null;
  opening_message: string;
  seed_chat: string[] | null;
  sample_messages: string[] | null;
  total_chat_count: number | null;
};

type PrivateConfigRow = {
  character_id: string;
  secret_context: string | null;
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
    secretContext: "",
    creatorId: row.creator_id ?? "admin",
    openingMessage: row.opening_message,
    seedChat: row.seed_chat ?? [],
    sampleMessages: row.sample_messages ?? [],
    totalChatCount: row.total_chat_count ?? 0,
  };
}

export function toPublicCharacter(
  character: DemoCharacter,
): DemoPublicCharacter {
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
  secretContext: string;
  creatorId: string;
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
      creator_id: input.creatorId,
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

  const character = mapCharacter(data as CharacterRow);

  if (input.secretContext) {
    const { error: privateConfigError } = await supabase
      .from("ai_demo_character_private_configs")
      .upsert(
        {
          character_id: input.id,
          secret_context: input.secretContext,
        },
        { onConflict: "character_id" },
      );

    if (privateConfigError) {
      throw new Error(
        privateConfigError.message ||
          "Failed to save private character config.",
      );
    }
  }

  return {
    ...character,
    secretContext: input.secretContext,
  };
}

export async function deleteDemoCharacterById(characterId: string) {
  if (!hasSupabaseAdminEnv()) {
    return deleteDemoCharacter(characterId);
  }

  const character = await getDemoCharacter(characterId);

  if (!character) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("ai_demo_characters")
    .delete()
    .eq("id", characterId);

  if (error) {
    throw new Error(error.message || "Failed to delete character.");
  }

  return character;
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

function normalizeRoomIdSegment(value: string, maxLength: number) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[/?#&=]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, maxLength);
}

export function buildDemoChatRoomId(input: {
  characterId: string;
  roomId: string;
}) {
  const characterId = normalizeRoomIdSegment(input.characterId, 80);
  const roomId = normalizeRoomIdSegment(input.roomId, 80);

  return [characterId, roomId].filter(Boolean).join("-");
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

  const character = mapCharacter(data as CharacterRow);
  const { data: privateConfig, error: privateConfigError } = await supabase
    .from("ai_demo_character_private_configs")
    .select("character_id, secret_context")
    .eq("character_id", characterId)
    .maybeSingle();

  if (privateConfigError) {
    logSupabaseFallback(
      "Failed to load private character config",
      privateConfigError,
    );
  }

  return {
    ...character,
    secretContext:
      (privateConfig as PrivateConfigRow | null)?.secret_context ?? "",
  };
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

  const { data: character, error: characterError } = await supabase
    .from("ai_demo_characters")
    .select("total_chat_count")
    .eq("id", input.characterId)
    .single();

  if (characterError) {
    logSupabaseFallback("Failed to load character", characterError);
    return null;
  }

  if (roomError) {
    logSupabaseFallback("Failed to upsert chat room", roomError);
    return null;
  }

  const { error: updateCharacterError } = await supabase
    .from("ai_demo_characters")
    .update({
      total_chat_count: (character.total_chat_count ?? 0) + 1,
    })
    .eq("id", input.characterId);

  if (updateCharacterError) {
    logSupabaseFallback("Failed to update character", updateCharacterError);
  }

  return {
    id: input.roomId,
    characterId: input.characterId,
  };
}

export async function deleteDemoChatRoomById(roomId: string) {
  if (!hasSupabaseAdminEnv()) {
    return { id: roomId };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("ai_demo_chat_rooms")
    .delete()
    .eq("id", roomId);

  if (error) {
    throw new Error(error.message || "Failed to delete chat room.");
  }

  return { id: roomId };
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

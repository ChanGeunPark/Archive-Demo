import { createSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { demoCharacters, findDemoCharacter } from "./mock-data";
import type { DemoCharacter, DemoChatMessage } from "./types";

type CharacterRow = {
  id: string;
  name: string;
  role: string;
  image_gradient: string;
  tags: string[] | null;
  description: string;
  world_view: string;
  opening_message: string;
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
    imageGradient: row.image_gradient,
    tags: row.tags ?? [],
    description: row.description,
    worldView: row.world_view,
    openingMessage: row.opening_message,
    sampleMessages: row.sample_messages ?? [],
    totalChatCount: row.total_chat_count ?? 0,
  };
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
    console.error("[ai-demo] Failed to load characters:", error);
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
    console.error("[ai-demo] Failed to load character:", error);
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
    console.error("[ai-demo] Failed to load chat history:", error);
    return [];
  }

  return (data as MessageRow[]).map(mapMessage);
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
    console.error("[ai-demo] Failed to upsert chat room:", roomError);
    return null;
  }

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
    console.error("[ai-demo] Failed to save message:", error);
    return null;
  }

  return mapMessage(data as MessageRow);
}

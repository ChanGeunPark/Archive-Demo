/**
 * AI 채팅 데모의 Supabase 데이터 접근 계층.
 *
 * 캐릭터·채팅방·메시지 CRUD를 담당하며, DB 행(row) ↔ 앱 도메인 타입 변환을 수행합니다.
 * Supabase 환경 변수가 없거나 쿼리가 실패하면 빈 배열/null을 반환하고 콘솔에 경고를 남깁니다.
 */
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

import type {
  DemoCharacter,
  DemoChatMessage,
  DemoPublicCharacter,
} from "./types";

// Supabase 테이블 행 타입 별칭
type CharacterRow = Tables<"ai_demo_characters">;
type PrivateConfigRow = Pick<
  Tables<"ai_demo_character_private_configs">,
  "character_id" | "secret_context"
>;
type MessageRow = Tables<"ai_demo_chat_messages">;

// DB 캐릭터 행을 앱 도메인 타입으로 변환 (secretContext는 별도 테이블에서 조회)
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

// DB 메시지 role("human" | "assistant" 등)을 앱 role("human" | "ai")로 정규화
function mapMessageRole(role: MessageRow["role"]): DemoChatMessage["role"] {
  return role === "human" ? "human" : "ai";
}

// 클라이언트에 노출해도 되는 공개 필드만 추출 (secretContext·worldView·creatorId 제외)
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

// 캐릭터 생성 — 공개 정보는 ai_demo_characters, 비밀 설정은 private_configs 테이블에 저장
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
  const supabase = createSupabaseAdminClient();
  const characterInsert: TablesInsert<"ai_demo_characters"> = {
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
  };
  const { data, error } = await supabase
    .from("ai_demo_characters")
    .insert(characterInsert)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create character.");
  }

  const character = mapCharacter(data);

  // AI 프롬프트용 비밀 컨텍스트는 별도 테이블에 upsert
  if (input.secretContext) {
    const privateConfigUpsert: TablesInsert<"ai_demo_character_private_configs"> =
      {
        character_id: input.id,
        secret_context: input.secretContext,
      };
    const { error: privateConfigError } = await supabase
      .from("ai_demo_character_private_configs")
      .upsert(privateConfigUpsert, { onConflict: "character_id" });

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

// 캐릭터 삭제 — 존재하지 않으면 null, 성공 시 삭제 직전 데이터 반환
export async function deleteDemoCharacterById(characterId: string) {
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

// DB 메시지 행을 앱 도메인 타입으로 변환
function mapMessage(row: MessageRow): DemoChatMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    characterId: row.character_id,
    role: mapMessageRole(row.role),
    content: row.content,
    createdAt: row.created_at,
  };
}

// roomId 구성 요소를 URL-safe 형태로 정규화 (공백·특수문자 → 하이픈, 길이 제한)
function normalizeRoomIdSegment(value: string, maxLength: number) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[/?#&=]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, maxLength);
}

// `{characterId}-{roomId}` 형식의 고유 채팅방 ID 생성
export function buildDemoChatRoomId(input: {
  characterId: string;
  roomId: string;
}) {
  const characterId = normalizeRoomIdSegment(input.characterId, 80);
  const roomId = normalizeRoomIdSegment(input.roomId, 80);

  return [characterId, roomId].filter(Boolean).join("-");
}

// Supabase 오류 시 경고 로그 출력 (로컬 데모 데이터로 폴백할 때 사용)
function logSupabaseFallback(scope: string, error: unknown) {
  const details =
    error && typeof error === "object"
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : String(error);

  console.warn(`[ai-demo] ${scope}. Falling back to local demo data.`, details);
}

// 캐릭터 목록 조회 (생성일 오름차순)
export async function getDemoCharacters() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_demo_characters")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    logSupabaseFallback("Failed to load characters", error);
    return [];
  }

  return data.map(mapCharacter);
}

// 단일 캐릭터 조회 — private_configs에서 secretContext를 추가로 병합
export async function getDemoCharacter(characterId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_demo_characters")
    .select("*")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !data) {
    logSupabaseFallback("Failed to load character", error);
    return null;
  }

  const character = mapCharacter(data);
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

  const privateConfigRow: PrivateConfigRow | null = privateConfig;

  return {
    ...character,
    secretContext: privateConfigRow?.secret_context ?? "",
  };
}

// 채팅방 메시지 히스토리 조회 (시간순)
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

  return data.map(mapMessage);
}

// 채팅방 생성/갱신 — upsert 후 캐릭터 total_chat_count +1
export async function createDemoChatRoom(input: {
  roomId: string;
  characterId: string;
}) {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const roomUpsert: TablesInsert<"ai_demo_chat_rooms"> = {
    id: input.roomId,
    character_id: input.characterId,
    updated_at: new Date().toISOString(),
  };
  const { error: roomError } = await supabase
    .from("ai_demo_chat_rooms")
    .upsert(roomUpsert, { onConflict: "id" });

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

// 채팅방 삭제
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

// 메시지 저장 — 채팅방이 없으면 createDemoChatRoom으로 먼저 생성
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
  const messageInsert: TablesInsert<"ai_demo_chat_messages"> = {
    room_id: input.roomId,
    character_id: input.characterId,
    role: input.role,
    content: input.content,
  };

  const { data, error } = await supabase
    .from("ai_demo_chat_messages")
    .insert(messageInsert)
    .select("*")
    .single();

  if (error || !data) {
    logSupabaseFallback("Failed to save message", error);
    return null;
  }

  return mapMessage(data);
}

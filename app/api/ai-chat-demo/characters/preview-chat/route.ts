import { randomUUID } from "node:crypto";
import {
  buildDemoCharacterWorldView,
  streamLangChainCharacterResponse,
} from "@/lib/ai-chat-demo/generator";
import type { DemoCharacter, DemoChatMessage } from "@/lib/ai-chat-demo/types";

type PreviewChatRequestBody = {
  category?: string;
  gender?: string;
  name?: string;
  statusMessage?: string;
  description?: string;
  personality?: string;
  secretContext?: string;
  openingMessage?: string;
  tags?: string;
  seedChat?: string;
  sampleMessages?: string;
  message?: string;
  history?: Array<{
    role?: "human" | "ai";
    content?: string;
  }>;
};

function safeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .replaceAll("{", "(")
    .replaceAll("}", ")")
    .replaceAll("[", "(")
    .replaceAll("]", ")");
}

function parseList(value: unknown) {
  return safeText(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPreviewHistory(
  history: PreviewChatRequestBody["history"],
  roomId: string,
  characterId: string,
): DemoChatMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (message) =>
        (message.role === "human" || message.role === "ai") &&
        safeText(message.content),
    )
    .slice(-16)
    .map((message, index) => ({
      id: `preview-history-${index}`,
      roomId,
      characterId,
      role: message.role as "human" | "ai",
      content: safeText(message.content),
      createdAt: "",
    }));
}

export async function POST(request: Request) {
  const body = (await request.json()) as PreviewChatRequestBody;
  const name = safeText(body.name).slice(0, 20);
  const category = safeText(body.category) || "CHARACTER";
  const gender = safeText(body.gender) || "ETC";
  const description = safeText(body.description).slice(0, 500);
  const personality = safeText(body.personality).slice(0, 500);
  const userMessage = safeText(body.message).slice(0, 300);

  if (!name || !description || !personality || !userMessage) {
    return Response.json(
      { error: "name, description, personality, and message are required." },
      { status: 400 },
    );
  }

  const characterId = `preview-${randomUUID()}`;
  const roomId = `preview-room-${randomUUID()}`;
  const character: DemoCharacter = {
    id: characterId,
    name,
    role: safeText(body.statusMessage).slice(0, 40) || `${category} 캐릭터`,
    category,
    gender,
    imageUrl: null,
    imageId: null,
    bannerImageUrl: null,
    bannerImageId: null,
    imageGradient: "from-[#FFE55C] via-[#FFBF5C] to-[#FF8F5C]",
    tags: parseList(body.tags).slice(0, 8),
    description,
    statusMessage: safeText(body.statusMessage).slice(0, 40) || null,
    worldView: buildDemoCharacterWorldView({
      name,
      gender,
      personality,
      description,
    }),
    secretContext: safeText(body.secretContext).slice(0, 800),
    creatorId: "preview",
    openingMessage: safeText(body.openingMessage).slice(0, 240),
    seedChat: parseList(body.seedChat).slice(0, 10),
    sampleMessages: parseList(body.sampleMessages).slice(0, 5),
    totalChatCount: 0,
  };
  const history = toPreviewHistory(body.history, roomId, characterId);
  let aiResponse = "";

  for await (const chunk of streamLangChainCharacterResponse({
    roomId,
    character,
    message: userMessage,
    history,
    cacheSession: false,
  })) {
    aiResponse += chunk;
  }

  return Response.json({ message: aiResponse });
}

import type { DemoChatMessage } from "@/lib/ai-chat-demo/types";

export function makeLocalMessage(input: {
  id?: string;
  roomId: string;
  characterId: string;
  role: "human" | "ai";
  content: string;
}): DemoChatMessage {
  return {
    id:
      input.id ??
      `${input.role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    roomId: input.roomId,
    characterId: input.characterId,
    role: input.role,
    content: input.content,
    createdAt: new Date().toISOString(),
  };
}

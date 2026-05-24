import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import ChatRoomClient from "../../_components/chat-room/ChatRoomClient";
import {
  getDemoCharacter,
  getDemoChatHistory,
  resolveDemoChatRoomId,
  toPublicCharacter,
} from "@/lib/ai-chat-demo/repository";

type ChatPageProps = {
  params: Promise<{
    characterId: string;
  }>;
  searchParams: Promise<{
    roomId?: string;
  }>;
};

export default async function CharacterChatRoomPage({
  params,
  searchParams,
}: ChatPageProps) {
  const { characterId } = await params;
  const { roomId } = await searchParams;
  const character = await getDemoCharacter(characterId);

  if (!character) {
    notFound();
  }

  const initialRoomId =
    resolveDemoChatRoomId({ characterId: character.id, roomId }) ??
    randomUUID();
  const initialMessages = await getDemoChatHistory(initialRoomId);

  // --- Render ---
  return (
    <ChatRoomClient
      key={initialRoomId}
      character={toPublicCharacter(character)}
      initialMessages={initialMessages}
      initialRoomId={initialRoomId}
    />
  );
}

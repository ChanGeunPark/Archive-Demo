import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import ChatRoomClient from "../../_components/ChatRoomClient";
import {
  getDemoCharacter,
  getDemoChatHistory,
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

  const initialRoomId = roomId || randomUUID();
  const initialMessages = await getDemoChatHistory(initialRoomId);

  return (
    <ChatRoomClient
      character={toPublicCharacter(character)}
      initialMessages={initialMessages}
      initialRoomId={initialRoomId}
    />
  );
}

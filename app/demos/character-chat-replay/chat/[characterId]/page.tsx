import { notFound } from "next/navigation";
import ChatRoomClient from "../../_components/ChatRoomClient";
import { getDemoCharacter, getDemoChatHistory } from "@/lib/ai-chat-demo/repository";

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
    roomId || `demo-${characterId}-${new Date().toISOString().slice(0, 10)}`;
  const initialMessages = await getDemoChatHistory(initialRoomId);

  return (
    <ChatRoomClient
      character={character}
      initialMessages={initialMessages}
      initialRoomId={initialRoomId}
    />
  );
}

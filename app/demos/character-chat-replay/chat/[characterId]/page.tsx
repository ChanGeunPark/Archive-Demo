import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import ChatRoomClient from "../../_components/chat-room/ChatRoomClient";
import {
  getDemoCharacter,
  getDemoChatHistory,
  resolveDemoChatRoomId,
  toPublicCharacter,
} from "@/lib/ai-chat-demo/repository";
import { buildPageMetadata } from "@/lib/seo";

type ChatPageProps = {
  params: Promise<{
    characterId: string;
  }>;
  searchParams: Promise<{
    roomId?: string;
  }>;
};

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const { characterId } = await params;
  const character = await getDemoCharacter(characterId);

  if (!character) {
    return buildPageMetadata({
      title: "캐릭터를 찾을 수 없음",
      description: "요청하신 캐릭터가 존재하지 않습니다.",
      path: `/demos/character-chat-replay/chat/${characterId}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${character.name}와 채팅`,
    description:
      character.description ??
      `${character.name}와 대화하는 CHIZU COMICS AI 채팅 데모입니다.`,
    path: `/demos/character-chat-replay/chat/${characterId}`,
    openGraph: {
      images: character.imageUrl
        ? [
            {
              url: character.imageUrl,
              alt: character.name,
            },
          ]
        : undefined,
    },
  });
}

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

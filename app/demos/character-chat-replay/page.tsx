import type { Metadata } from "next";
import CharacterSelectClient from "./_components/character-select/CharacterSelectClient";
import {
  getDemoCharacters,
  toPublicCharacter,
} from "@/lib/ai-chat-demo/repository";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "CHIZU COMICS AI Chat Demo",
  description:
    "캐릭터 선택, 생성, LangChain 스트리밍 채팅, Supabase 히스토리 저장까지 확인할 수 있는 AI 캐릭터 채팅 데모입니다.",
  path: "/demos/character-chat-replay",
  keywords: ["AI 채팅", "LangChain", "Supabase", "캐릭터 생성", "CHIZU COMICS"],
});

export default async function CharacterChatReplayDemo() {
  const characters = await getDemoCharacters();

  return (
    <CharacterSelectClient characters={characters.map(toPublicCharacter)} />
  );
}

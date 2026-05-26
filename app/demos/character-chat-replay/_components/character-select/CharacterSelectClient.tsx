"use client";

import { useState } from "react";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { useDemoCharactersQuery } from "@/lib/ai-chat-demo/api";
import { CharacterGrid } from "./CharacterGrid";
import { CharacterPreviewBottomSheet } from "./CharacterPreviewBottomSheet";
import { CharacterSelectHeader } from "./CharacterSelectHeader";
import { CharacterSelectHero } from "./CharacterSelectHero";
import Typography from "@/components/typography/Typography";

type CharacterSelectClientProps = {
  characters: DemoPublicCharacter[];
};

export default function CharacterSelectClient({
  characters,
}: CharacterSelectClientProps) {
  // --- API ---
  const { data: cachedCharacters = characters } =
    useDemoCharactersQuery(characters);

  // --- State Management ---
  const [selectedCharacter, setSelectedCharacter] =
    useState<DemoPublicCharacter | null>(null);

  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <section className="mx-auto min-h-screen w-full max-w-[620px] bg-white">
        <CharacterSelectHeader />
        <div className="px-4">
          <Typography variant="body2" color="#72777E" className="mt-2">
            Chizu Comics의 AI 캐릭터 화면 톤을 바탕으로, 캐릭터 선택에서
            채팅방까지 이어지는 Supabase 기반 데모입니다. 실제 프로젝트에선
            GraphQL을 사용하지만, 데모에선 REST API와 TanStack Query로
            재구성했습니다.
          </Typography>
        </div>
        <CharacterSelectHero />
        <CharacterGrid
          characters={cachedCharacters}
          onSelect={setSelectedCharacter}
        />
      </section>

      <CharacterPreviewBottomSheet
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </main>
  );
}

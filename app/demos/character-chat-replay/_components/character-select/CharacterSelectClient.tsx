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
        <section className="px-4" aria-label="데모 소개">
          <div className="mt-2 overflow-hidden rounded-2xl border border-[#EDEEEF] bg-linear-to-br from-amber-50/50 via-white to-zinc-50/60 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] ring-1 ring-inset ring-zinc-200/70">
            <Typography
              variant="body2"
              color="#52525B"
              className="break-keep leading-relaxed"
            >
              캐릭터 선택부터 AI 대화·히스토리 저장까지 이어지는 AI 캐릭터
              채팅 데모입니다. 목록에서 캐릭터를 탭해 정보를 확인한 뒤, 채팅
              ID를 입력하고 대화를 시작하세요. 같은 채팅 ID로 다시 들어오면
              이전 대화를 이어서 볼 수 있습니다. 우측 상단 캐릭터 만들기에서
              새 캐릭터를 등록할 수 있고, 본인이 만든 캐릭터는 삭제할 수
              있습니다.
            </Typography>
          </div>
        </section>
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

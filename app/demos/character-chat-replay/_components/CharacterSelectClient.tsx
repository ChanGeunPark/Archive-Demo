"use client";

import { useState } from "react";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { CharacterGrid } from "./CharacterGrid";
import { CharacterPreviewBottomSheet } from "./CharacterPreviewBottomSheet";
import { CharacterSelectHeader } from "./CharacterSelectHeader";
import { CharacterSelectHero } from "./CharacterSelectHero";

type CharacterSelectClientProps = {
  characters: DemoPublicCharacter[];
};

export default function CharacterSelectClient({
  characters,
}: CharacterSelectClientProps) {
  const [selectedCharacter, setSelectedCharacter] =
    useState<DemoPublicCharacter | null>(null);

  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <section className="mx-auto min-h-screen w-full max-w-[620px] bg-white">
        <CharacterSelectHeader />
        <CharacterSelectHero />
        <CharacterGrid characters={characters} onSelect={setSelectedCharacter} />
      </section>

      <CharacterPreviewBottomSheet
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </main>
  );
}

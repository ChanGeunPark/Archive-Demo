import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { CharacterCard } from "./CharacterCard";

type CharacterGridProps = {
  characters: DemoPublicCharacter[];
  onSelect: (character: DemoPublicCharacter) => void;
};

export function CharacterGrid({ characters, onSelect }: CharacterGridProps) {
  return (
    <section className="grid grid-cols-3 gap-3 bg-[#F4F5F6] px-3 py-4">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onSelect={() => onSelect(character)}
        />
      ))}
    </section>
  );
}

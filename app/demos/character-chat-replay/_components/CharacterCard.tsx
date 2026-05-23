import Image from "next/image";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";

type CharacterCardProps = {
  character: DemoPublicCharacter;
  onSelect: () => void;
};

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-[170px] flex-col items-center justify-center rounded-lg bg-white p-2 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden rounded-xl border border-[#F4F5F6]">
        {character.imageUrl ? (
          <Image
            src={character.imageUrl}
            alt={`${character.name} profile`}
            width={92}
            height={92}
            className="h-[92px] w-[92px] object-cover"
            unoptimized
          />
        ) : (
          <div
            className={`h-[92px] w-[92px] bg-gradient-to-br ${character.imageGradient}`}
          />
        )}
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center bg-black/60 py-0.5 text-[11px] font-semibold text-white">
          {character.totalChatCount.toLocaleString()}
        </div>
      </div>
      <div className="mt-2 flex h-[46px] flex-col items-center justify-center text-center">
        <h3 className="max-w-[92px] truncate text-sm font-bold">
          {character.name}
        </h3>
        <p className="mt-1 max-w-[96px] truncate text-[11px] text-[#72777E]">
          {character.tags.map((tag) => `#${tag}`).join(" ")}
        </p>
      </div>
    </button>
  );
}

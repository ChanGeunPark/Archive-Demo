import Image from "next/image";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import Typography from "@/components/typography/Typography";

type CharacterCardProps = {
  character: DemoPublicCharacter;
  onSelect: () => void;
};

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-[170px] w-full min-w-0 flex-col items-center justify-center rounded-lg bg-white p-2 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5"
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
        <Typography
          as="div"
          variant="caption"
          weight={600}
          color="white"
          align="center"
          className="absolute bottom-0 left-0 flex w-full items-center justify-center bg-black/60 py-0.5"
        >
          {character.totalChatCount.toLocaleString()}
        </Typography>
      </div>
      <div className="mt-2 flex h-[46px] w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center">
        <Typography
          variant="body2"
          weight={700}
          color="#17191C"
          truncate
          className="min-w-0"
        >
          {character.name}
        </Typography>
        <Typography
          variant="caption"
          color="#72777E"
          truncate
          className="mt-1 min-w-0"
        >
          {character.tags.map((tag) => `#${tag}`).join(" ")}
        </Typography>
      </div>
    </button>
  );
}

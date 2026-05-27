import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { CharacterAvatar } from "./CharacterAvatar";
import Typography from "@/components/typography/Typography";

type ChatLoadingDotsProps = {
  character: DemoPublicCharacter;
};

export function ChatLoadingDots({ character }: ChatLoadingDotsProps) {
  return (
    <div className="flex flex-col px-0 py-2">
      <div className="mb-2 flex items-center gap-2">
        <CharacterAvatar
          character={character}
          className="h-8 w-8 rounded-full"
        />
        <Typography as="span" variant="body2" weight={700} color="#17191C">
          {character.name}
        </Typography>
      </div>
      <div className="flex w-full items-end">
        <div className="ml-10 inline-flex rounded-lg rounded-tl-none bg-white px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#60656C]" />
          <span className="mx-1 h-2 w-2 animate-pulse rounded-full bg-[#AEB2B8]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#D8DBDE]" />
        </div>
      </div>
    </div>
  );
}

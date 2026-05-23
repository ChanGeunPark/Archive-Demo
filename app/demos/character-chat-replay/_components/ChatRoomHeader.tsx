import Link from "next/link";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { CharacterAvatar } from "./CharacterAvatar";

type ChatRoomHeaderProps = {
  character: DemoPublicCharacter;
};

export function ChatRoomHeader({ character }: ChatRoomHeaderProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#EDEEEF] bg-white px-4">
      <Link
        href="/demos/character-chat-replay"
        className="text-sm font-semibold text-[#60656C]"
      >
        Back
      </Link>
      <div className="text-center">
        <h1 className="text-base font-bold">{character.name}</h1>
        <p className="text-xs text-[#93989F]">{character.role}</p>
      </div>
      <CharacterAvatar character={character} className="h-9 w-9 rounded-full" />
    </header>
  );
}

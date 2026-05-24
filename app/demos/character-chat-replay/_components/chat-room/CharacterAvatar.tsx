import Image from "next/image";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";

type CharacterAvatarProps = {
  character: Pick<
    DemoPublicCharacter,
    "imageGradient" | "imageUrl" | "name"
  >;
  className: string;
};

export function CharacterAvatar({ character, className }: CharacterAvatarProps) {
  if (character.imageUrl) {
    return (
      <Image
        src={character.imageUrl}
        alt={`${character.name} profile`}
        width={36}
        height={36}
        className={`${className} object-cover`}
        unoptimized
      />
    );
  }

  return (
    <span
      className={`${className} bg-gradient-to-br ${character.imageGradient}`}
    />
  );
}

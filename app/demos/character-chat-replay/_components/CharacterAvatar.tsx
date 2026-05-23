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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={character.imageUrl}
        alt={`${character.name} profile`}
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} bg-gradient-to-br ${character.imageGradient}`}
    />
  );
}

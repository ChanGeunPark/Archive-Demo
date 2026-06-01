import { memo } from "react";
import type {
  DemoChatMessage,
  DemoPublicCharacter,
} from "@/lib/ai-chat-demo/types";
import { CharacterAvatar } from "./CharacterAvatar";
import Typography from "@/components/typography/Typography";

type ChatBubbleProps = {
  character: DemoPublicCharacter;
  message: DemoChatMessage;
};

export const ChatBubble = memo(function ChatBubble({
  character,
  message,
}: ChatBubbleProps) {
  const isHuman = message.role === "human";

  return (
    <div className="flex flex-col px-0 py-2">
      {!isHuman && (
        <div className="mb-2 flex cursor-pointer items-center gap-2">
          <CharacterAvatar
            character={character}
            className="h-8 w-8 rounded-full"
          />
          <Typography as="span" variant="body2" weight={700} color="#17191C">
            {character.name}
          </Typography>
        </div>
      )}
      <div className={`flex w-full items-end ${isHuman ? "justify-end" : ""}`}>
        <Typography
          as="span"
          variant="body2"
          color="#17191C"
          wordBreak="words"
          className={`relative max-w-[80%] rounded-lg px-4 py-2 ${
            isHuman
              ? "rounded-tr-none bg-[#FFED8F]"
              : "ml-10 rounded-tl-none bg-white"
          }`}
        >
          {message.content}
        </Typography>
      </div>
    </div>
  );
});

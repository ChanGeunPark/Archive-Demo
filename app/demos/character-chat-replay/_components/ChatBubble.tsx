import type {
  DemoChatMessage,
  DemoPublicCharacter,
} from "@/lib/ai-chat-demo/types";
import { CharacterAvatar } from "./CharacterAvatar";

type ChatBubbleProps = {
  character: DemoPublicCharacter;
  message: DemoChatMessage;
  streaming?: boolean;
};

export function ChatBubble({
  character,
  message,
  streaming = false,
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
          <span className="text-sm font-bold">{character.name}</span>
        </div>
      )}
      <div className={`flex w-full items-end ${isHuman ? "justify-end" : ""}`}>
        <span
          className={`relative max-w-[80%] break-words rounded-lg px-4 py-2 text-sm leading-6 ${
            isHuman
              ? "rounded-tr-none bg-[#FFED8F] text-[#17191C]"
              : "ml-10 rounded-tl-none bg-white text-[#17191C]"
          }`}
        >
          {message.content}
          {streaming && <span className="ml-0.5 animate-pulse">|</span>}
        </span>
      </div>
    </div>
  );
}

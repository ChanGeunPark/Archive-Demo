import type { RefObject } from "react";
import type {
  DemoChatMessage,
  DemoPublicCharacter,
} from "@/lib/ai-chat-demo/types";
import { ChatBubble } from "./ChatBubble";
import { ChatLoadingDots } from "./ChatLoadingDots";
import { makeLocalMessage } from "./chat-room.utils";

type ChatMessageListProps = {
  character: DemoPublicCharacter;
  loading: boolean;
  messages: DemoChatMessage[];
  roomId: string;
  scrollRef: RefObject<HTMLDivElement | null>;
  streamingText: string;
};

export function ChatMessageList({
  character,
  loading,
  messages,
  roomId,
  scrollRef,
  streamingText,
}: ChatMessageListProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
      {messages && messages.length <= 0 && (
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-[#60656C] bg-white px-4 rounded-full py-2 border border-zinc-100">
            채팅방에 입장했습니다
          </span>
        </div>
      )}

      {messages.map((message) => (
        <ChatBubble key={message.id} character={character} message={message} />
      ))}

      {streamingText && (
        <ChatBubble
          character={character}
          message={makeLocalMessage({
            roomId,
            characterId: character.id,
            role: "ai",
            content: streamingText,
          })}
          streaming
        />
      )}

      {loading && !streamingText && <ChatLoadingDots />}
    </div>
  );
}

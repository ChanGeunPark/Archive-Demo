import type { RefObject } from "react";
import type {
  DemoChatMessage,
  DemoPublicCharacter,
} from "@/lib/ai-chat-demo/types";
import { ChatBubble } from "./ChatBubble";
import { ChatLoadingDots } from "./ChatLoadingDots";
import Typography from "@/components/typography/Typography";

type ChatMessageListProps = {
  character: DemoPublicCharacter;
  awaitingFirstToken: boolean;
  messages: DemoChatMessage[];
  scrollRef: RefObject<HTMLDivElement | null>;
};

export function ChatMessageList({
  character,
  awaitingFirstToken,
  messages,
  scrollRef,
}: ChatMessageListProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
      {messages && messages.length <= 0 && (
        <div className="flex flex-col items-center justify-center">
          <Typography
            as="span"
            variant="body3"
            weight={700}
            color="#60656C"
            className="rounded-full px-4 py-1 bg-white/60"
          >
            채팅방에 입장했습니다
          </Typography>
        </div>
      )}

      {messages.map((message) => (
        <ChatBubble key={message.id} character={character} message={message} />
      ))}

      {awaitingFirstToken && <ChatLoadingDots />}
    </div>
  );
}

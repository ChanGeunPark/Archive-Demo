"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DemoChatMessage,
  DemoPublicCharacter,
} from "@/lib/ai-chat-demo/types";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageList } from "./ChatMessageList";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { SampleMessageScroller } from "./SampleMessageScroller";
import { makeLocalMessage } from "./chat-room.utils";

type ChatRoomClientProps = {
  character: DemoPublicCharacter;
  initialMessages: DemoChatMessage[];
  initialRoomId: string;
};

export default function ChatRoomClient({
  character,
  initialMessages,
  initialRoomId,
}: ChatRoomClientProps) {
  const [roomId, setRoomId] = useState(initialRoomId);
  const [messages, setMessages] = useState<DemoChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const visibleMessages = useMemo(() => {
    if (messages.length > 0) return messages;

    return [
      makeLocalMessage({
        roomId,
        characterId: character.id,
        role: "ai",
        content: character.openingMessage,
      }),
    ];
  }, [character.id, character.openingMessage, messages, roomId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages, streamingText]);

  async function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) return;

    setInputText("");
    setLoading(true);
    setStreamingText("");
    setMessages((current) => [
      ...current,
      makeLocalMessage({
        roomId,
        characterId: character.id,
        role: "human",
        content: trimmedMessage,
      }),
    ]);

    const response = await fetch("/api/ai-chat-demo/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        characterId: character.id,
        message: trimmedMessage,
      }),
    });

    if (!response.ok || !response.body) {
      setLoading(false);
      setMessages((current) => [
        ...current,
        makeLocalMessage({
          roomId,
          characterId: character.id,
          role: "ai",
          content:
            "잠시 후 다시 시도해 주세요. 서버 응답을 불러오지 못했습니다.",
        }),
      ]);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const eventType = event.match(/^event: (.+)$/m)?.[1];
        const dataText = event.match(/^data: (.+)$/m)?.[1];
        if (!dataText) continue;

        const data = JSON.parse(dataText) as {
          roomId?: string;
          token?: string;
        };

        if (eventType === "meta" && data.roomId) {
          setRoomId(data.roomId);
        }

        if (eventType === "token" && data.token) {
          completedText += data.token;
          setStreamingText(completedText);
        }
      }
    }

    setMessages((current) => [
      ...current,
      makeLocalMessage({
        roomId,
        characterId: character.id,
        role: "ai",
        content: completedText,
      }),
    ]);
    setStreamingText("");
    setLoading(false);
  }

  function handleSubmit() {
    sendMessage(inputText);
  }

  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <section className="mx-auto flex h-screen w-full max-w-[620px] flex-col bg-[#F4F5F6]">
        <ChatRoomHeader character={character} />
        <ChatMessageList
          character={character}
          loading={loading}
          messages={visibleMessages}
          roomId={roomId}
          scrollRef={scrollRef}
          streamingText={streamingText}
        />
        <SampleMessageScroller
          disabled={loading}
          onSelect={sendMessage}
          samples={character.sampleMessages}
        />
        <ChatComposer
          disabled={!inputText.trim() || loading}
          inputText={inputText}
          onChange={setInputText}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}

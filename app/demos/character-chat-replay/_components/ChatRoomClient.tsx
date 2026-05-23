"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { DemoCharacter, DemoChatMessage } from "@/lib/ai-chat-demo/types";

type ChatRoomClientProps = {
  character: DemoCharacter;
  initialMessages: DemoChatMessage[];
  initialRoomId: string;
};

function makeLocalMessage(input: {
  roomId: string;
  characterId: string;
  role: "human" | "ai";
  content: string;
}): DemoChatMessage {
  return {
    id: `${input.role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    roomId: input.roomId,
    characterId: input.characterId,
    role: input.role,
    content: input.content,
    createdAt: new Date().toISOString(),
  };
}

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
          content: "잠시 후 다시 시도해 주세요. 서버 응답을 불러오지 못했습니다.",
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

        const data = JSON.parse(dataText) as { roomId?: string; token?: string };

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(inputText);
  }

  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <section className="mx-auto flex h-screen w-full max-w-[620px] flex-col bg-[#F4F5F6]">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#EDEEEF] bg-white px-4">
          <Link href="/demos/character-chat-replay" className="text-sm font-semibold text-[#60656C]">
            Back
          </Link>
          <div className="text-center">
            <h1 className="text-base font-bold">{character.name}</h1>
            <p className="text-xs text-[#93989F]">{character.role}</p>
          </div>
          <span className="h-9 w-9 rounded-full bg-[#FFE55C]" />
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
          {visibleMessages.map((message) => (
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

          {loading && !streamingText && (
            <div className="px-4 py-2">
              <div className="ml-10 inline-flex rounded-lg rounded-tl-none bg-white px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#60656C]" />
                <span className="mx-1 h-2 w-2 animate-pulse rounded-full bg-[#AEB2B8]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#D8DBDE]" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 bg-[#F4F5F6] px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto py-2">
            {character.sampleMessages.map((sample) => (
              <button
                key={sample}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(sample)}
                className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#60656C] disabled:opacity-50"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex h-[90px] flex-shrink-0 items-center gap-2 bg-white px-4"
        >
          <input
            value={inputText}
            onChange={(event) => setInputText(event.target.value.slice(0, 300))}
            placeholder="채팅 내용 입력"
            className="min-h-12 w-full rounded-xl border-2 border-[#F4F5F6] bg-white p-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#17191C] text-sm font-bold text-white disabled:bg-[#D8DBDE]"
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}

function ChatBubble({
  character,
  message,
  streaming = false,
}: {
  character: DemoCharacter;
  message: DemoChatMessage;
  streaming?: boolean;
}) {
  const isHuman = message.role === "human";

  return (
    <div className="flex flex-col px-0 py-2">
      {!isHuman && (
        <div className="mb-2 flex cursor-pointer items-center gap-2">
          <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${character.imageGradient}`} />
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

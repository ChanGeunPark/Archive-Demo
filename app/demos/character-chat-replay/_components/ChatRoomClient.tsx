"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  aiChatDemoKeys,
  useDeleteDemoChatRoomMutation,
  useDemoChatHistoryQuery,
  useStreamingChatMutation,
} from "@/lib/ai-chat-demo/api";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const streamingChatMutation = useStreamingChatMutation();
  const deleteRoomMutation = useDeleteDemoChatRoomMutation();
  const [roomId, setRoomId] = useState(initialRoomId);
  const historyQuery = useDemoChatHistoryQuery(
    roomId,
    roomId === initialRoomId ? initialMessages : undefined,
  );
  const [localMessages, setLocalMessages] = useState<
    DemoChatMessage[] | null
  >(
    null,
  );
  const messages = localMessages ?? historyQuery.data ?? initialMessages;
  const [inputText, setInputText] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loading = streamingChatMutation.isPending;
  const deletingRoom = deleteRoomMutation.isPending;

  function setCachedMessages(
    nextRoomId: string,
    nextMessages: DemoChatMessage[],
  ) {
    queryClient.setQueryData<DemoChatMessage[]>(
      aiChatDemoKeys.history(nextRoomId),
      nextMessages,
    );
  }

  const visibleMessages = useMemo(() => {
    const openingMessage = character.openingMessage.trim();
    if (!openingMessage) return messages;

    const firstMessage = messages[0];
    if (
      firstMessage?.role === "ai" &&
      firstMessage.content.trim() === openingMessage
    ) {
      return messages;
    }

    const openingChatMessage: DemoChatMessage = {
      id: `opening-${character.id}`,
      roomId,
      characterId: character.id,
      role: "ai",
      content: openingMessage,
      createdAt: "",
    };

    return [openingChatMessage, ...messages];
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
    setStreamingText("");
    const requestRoomId = roomId;
    const humanMessage = makeLocalMessage({
      roomId: requestRoomId,
      characterId: character.id,
      role: "human",
      content: trimmedMessage,
    });
    const optimisticMessages = [...messages, humanMessage];

    setLocalMessages(optimisticMessages);
    setCachedMessages(requestRoomId, optimisticMessages);

    let response: Response;

    try {
      response = await streamingChatMutation.mutateAsync({
        roomId: requestRoomId,
        characterId: character.id,
        message: trimmedMessage,
      });
    } catch {
      setLocalMessages((current) => [
        ...(current ?? optimisticMessages),
        makeLocalMessage({
          roomId: requestRoomId,
          characterId: character.id,
          role: "ai",
          content:
            "잠시 후 다시 시도해 주세요. 서버 응답을 불러오지 못했습니다.",
        }),
      ]);
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completedText = "";
    let responseRoomId = requestRoomId;

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
          responseRoomId = data.roomId;
          setRoomId(data.roomId);
        }

        if (eventType === "token" && data.token) {
          completedText += data.token;
          setStreamingText(completedText);
        }
      }
    }

    const completedMessages = [
      ...optimisticMessages,
      makeLocalMessage({
        roomId: responseRoomId,
        characterId: character.id,
        role: "ai",
        content: completedText,
      }),
    ];

    setLocalMessages(completedMessages);
    setCachedMessages(responseRoomId, completedMessages);
    setStreamingText("");
  }

  function handleSubmit() {
    sendMessage(inputText);
  }

  async function handleDeleteRoom() {
    if (deletingRoom || loading) return;

    const confirmed = window.confirm(
      "이 채팅방을 삭제할까요? 삭제한 대화 내용은 복구할 수 없습니다.",
    );

    if (!confirmed) return;

    try {
      await deleteRoomMutation.mutateAsync(roomId);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "채팅방을 삭제하지 못했습니다.",
      );
      return;
    }

    router.push("/demos/character-chat-replay");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <section className="mx-auto flex h-screen w-full max-w-[620px] flex-col bg-[#F4F5F6]">
        <ChatRoomHeader
          character={character}
          deleteDisabled={loading || deletingRoom}
          deletingRoom={deletingRoom}
          onDeleteRoom={handleDeleteRoom}
        />
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

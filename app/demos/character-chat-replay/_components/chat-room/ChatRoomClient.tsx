"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { createSmoothStreamReveal } from "./smooth-stream-reveal";

type ChatRoomClientProps = {
  character: DemoPublicCharacter;
  initialMessages: DemoChatMessage[];
  initialRoomId: string;
};

/**
 * 캐릭터 채팅방 클라이언트.
 * 메시지 표시 우선순위: localMessages(스트림) → React Query → SSR initialMessages
 */
export default function ChatRoomClient({
  character,
  initialMessages,
  initialRoomId,
}: ChatRoomClientProps) {
  // --- Hooks ---
  const router = useRouter();
  const queryClient = useQueryClient();
  const streamingChatMutation = useStreamingChatMutation();
  const deleteRoomMutation = useDeleteDemoChatRoomMutation();

  // --- State Management ---
  const [roomId, setRoomId] = useState(initialRoomId);
  const historyQuery = useDemoChatHistoryQuery(
    roomId,
    roomId === initialRoomId ? initialMessages : undefined,
  );
  const [localMessages, setLocalMessages] = useState<DemoChatMessage[] | null>(
    null,
  );
  const messages = localMessages ?? historyQuery.data ?? initialMessages;
  const [inputText, setInputText] = useState("");
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasInitialScrollRef = useRef(false);
  const loading = streamingChatMutation.isPending || isWaitingForReply;
  const deletingRoom = deleteRoomMutation.isPending;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    });
  }, []);

  // --- Event Handlers ---
  function setCachedMessages(
    nextRoomId: string,
    nextMessages: DemoChatMessage[],
  ) {
    queryClient.setQueryData<DemoChatMessage[]>(
      aiChatDemoKeys.history(nextRoomId),
      nextMessages,
    );
  }

  // --- Normalization ---
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

  // 채팅방 진입 시 히스토리 로드 완료 후 하단으로 스크롤 (스트리밍 중에는 제외)
  useEffect(() => {
    hasInitialScrollRef.current = false;
  }, [initialRoomId]);

  useEffect(() => {
    if (hasInitialScrollRef.current) return;
    if (isWaitingForReply || localMessages) return;
    if (historyQuery.isFetching) return;

    hasInitialScrollRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom("auto");
      });
    });
  }, [
    initialRoomId,
    historyQuery.isFetching,
    historyQuery.data,
    visibleMessages.length,
    isWaitingForReply,
    localMessages,
    scrollToBottom,
  ]);

  // --- Event Handlers ---
  async function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) return;

    setInputText("");
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
    scrollToBottom();
    setIsWaitingForReply(true);
    setAwaitingFirstToken(true);

    const streamingMessageId = `ai-stream-${Date.now()}`;
    let completedText = "";
    let responseRoomId = requestRoomId;
    let streamError: string | null = null;

    function buildStreamingMessages(text: string) {
      return [
        ...optimisticMessages,
        makeLocalMessage({
          id: streamingMessageId,
          roomId: responseRoomId,
          characterId: character.id,
          role: "ai",
          content: text,
        }),
      ];
    }

    const reveal = createSmoothStreamReveal({
      onUpdate: (text) => {
        setLocalMessages(buildStreamingMessages(text));
      },
    });

    try {
      let response: Response;

      // --- API Requests ---
      try {
        response = await streamingChatMutation.mutateAsync({
          roomId: requestRoomId,
          characterId: character.id,
          message: trimmedMessage,
        });
      } catch {
        setAwaitingFirstToken(false);
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
        scrollToBottom();
        return;
      }

      // --- SSE Event Parsing ---
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      streamLoop: while (true) {
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
            error?: string;
          };

          if (eventType === "meta" && data.roomId) {
            responseRoomId = data.roomId;
            setRoomId(data.roomId);
          }

          if (eventType === "error") {
            streamError =
              data.error ?? "응답 생성에 실패했습니다. 다시 시도해 주세요.";
            setAwaitingFirstToken(false);
            break streamLoop;
          }

          if (eventType === "token" && data.token) {
            completedText += data.token;
            setAwaitingFirstToken(false);
            reveal.pushTarget(completedText);
          }
        }
      }

      const finalAiContent = streamError ?? completedText;
      if (!finalAiContent) return;

      reveal.pushTarget(finalAiContent);

      if (streamError) {
        reveal.snapToTarget();
      } else {
        await reveal.flush();
      }

      const completedMessages = buildStreamingMessages(finalAiContent);
      setLocalMessages(completedMessages);
      setCachedMessages(responseRoomId, completedMessages);
      scrollToBottom();
    } finally {
      reveal.stop();
      setAwaitingFirstToken(false);
      setIsWaitingForReply(false);
    }
  }

  function handleSubmit() {
    sendMessage(inputText);
  }

  // --- Event Handlers ---
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

  // --- Render ---
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
          awaitingFirstToken={awaitingFirstToken}
          messages={visibleMessages}
          scrollRef={scrollRef}
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

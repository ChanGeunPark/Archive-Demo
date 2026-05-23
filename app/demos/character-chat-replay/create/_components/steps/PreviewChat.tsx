import { useMemo, useState } from "react";
import Image from "next/image";
import SendFillIcon from "@/components/icons/SendFillIcon";
import type { FormState } from "../create-character.types";
import { parseSampleMessages } from "./message-utils";

export function PreviewChat({
  form,
  profilePreview,
  bannerPreview,
}: {
  form: FormState;
  profilePreview: string;
  bannerPreview: string;
}) {
  const [messages, setMessages] = useState<PreviewMessage[]>(() => {
    const openingMessage = form.openingMessage.trim();

    return openingMessage
      ? [
          {
            id: "opening",
            role: "ai",
            content: openingMessage,
          },
        ]
      : [];
  });
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const sampleMessages = useMemo(
    () => parseSampleMessages(form.sampleMessages),
    [form.sampleMessages],
  );
  const limitReached =
    messages.filter((message) => message.role === "human").length >= 5;

  async function submitPreviewMessage(message: string) {
    const content = message.trim();
    if (!content || isThinking || limitReached) return;

    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((current) => [
      ...current,
      { id: `human-${Date.now()}`, role: "human", content },
    ]);
    setInputText("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/ai-chat-demo/characters/preview-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          message: content,
          history,
        }),
      });
      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.message) {
        throw new Error(data.error || "Failed to generate preview chat.");
      }

      const aiMessage = data.message;
      setMessages((current) => [
        ...current,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: aiMessage,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: "미안해요 잘 못들었어요 다시 말해주세요.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[620px] overflow-hidden rounded-lg bg-white shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)]">
      <div className="relative h-52 bg-[#17191C]">
        {bannerPreview && (
          <Image
            src={bannerPreview}
            alt=""
            fill
            sizes="(max-width: 620px) 100vw, 620px"
            className="object-cover brightness-50"
            unoptimized
          />
        )}
        <div className="absolute inset-x-0 bottom-5 flex flex-col items-center">
          {profilePreview ? (
            <Image
              src={profilePreview}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border-4 border-white object-cover"
              unoptimized
            />
          ) : (
            <span className="h-24 w-24 rounded-full border-4 border-white bg-[#FFE55C]" />
          )}
          <h2 className="mt-2 text-xl font-bold text-white">
            {form.name || "캐릭터 이름"}
          </h2>
          <p className="text-xs font-medium text-white/60">
            {form.statusMessage || "상태 메시지"}
          </p>
        </div>
      </div>
      <div className="flex h-[calc(100vh-360px)] min-h-[360px] flex-col bg-[#F4F5F6]">
        <div className="flex h-10 items-center justify-center bg-[#17191C] px-3 text-center text-xs font-bold text-white/80">
          채팅 테스트는 최대 5회의 대화까지 가능합니다.
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <p className="rounded-lg bg-white p-4 text-sm leading-6 text-[#60656C]">
            {form.description}
          </p>
          {messages.map((message) => (
            <PreviewChatBubble
              key={message.id}
              characterName={form.name}
              message={message}
              profilePreview={profilePreview}
            />
          ))}
          {isThinking && (
            <PreviewChatBubble
              characterName={form.name}
              message={{ id: "thinking", role: "ai", content: "입력 중..." }}
              profilePreview={profilePreview}
            />
          )}
        </div>
        {sampleMessages.length > 0 && (
          <div className="border-t border-[#EDEEEF] bg-white px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              {sampleMessages.map((message) => (
                <button
                  key={message}
                  type="button"
                  disabled={isThinking || limitReached}
                  onClick={() => submitPreviewMessage(message)}
                  className="h-9 shrink-0 rounded-full border border-[#D8DBDE] px-3 text-xs font-bold text-[#17191C] disabled:text-[#AEB2B8]"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex h-[82px] items-center gap-2 bg-white px-4">
          <input
            value={inputText}
            disabled={limitReached}
            onChange={(event) => setInputText(event.target.value.slice(0, 300))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitPreviewMessage(inputText);
              }
            }}
            placeholder={
              limitReached
                ? "5회의 테스트 채팅을 완료했습니다."
                : "채팅 내용 입력"
            }
            className="h-12 min-w-0 flex-1 rounded-xl border-2 border-[#F4F5F6] bg-white px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C] disabled:bg-[#F4F5F6]"
          />
          <button
            type="button"
            disabled={!inputText.trim() || isThinking || limitReached}
            onClick={() => submitPreviewMessage(inputText)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#17191C] text-sm font-bold text-white disabled:bg-[#D8DBDE] disabled:text-[#AEB2B8]"
            aria-label="테스트 메시지 보내기"
          >
            <SendFillIcon width={24} height={24} fill="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}

type PreviewMessage = {
  id: string;
  role: "human" | "ai";
  content: string;
};

function PreviewChatBubble({
  characterName,
  message,
  profilePreview,
}: {
  characterName: string;
  message: PreviewMessage;
  profilePreview: string;
}) {
  const isHuman = message.role === "human";

  return (
    <div
      className={`flex flex-col py-1 ${isHuman ? "items-end" : "items-start"}`}
    >
      {!isHuman && (
        <div className="mb-2 flex items-center gap-2">
          {profilePreview ? (
            <Image
              src={profilePreview}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span className="h-8 w-8 rounded-full bg-[#FFE55C]" />
          )}
          <span className="text-sm font-bold">
            {characterName || "캐릭터 이름"}
          </span>
        </div>
      )}
      <p
        className={`max-w-[80%] break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
          isHuman
            ? "rounded-br-none bg-[#FFE55C] text-[#17191C]"
            : "ml-10 rounded-bl-none bg-white text-[#17191C]"
        }`}
      >
        {message.content}
      </p>
    </div>
  );
}

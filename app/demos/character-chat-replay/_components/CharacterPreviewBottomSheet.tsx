"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";

type CharacterPreviewBottomSheetProps = {
  character: DemoPublicCharacter | null;
  onClose: () => void;
};

export function CharacterPreviewBottomSheet({
  character,
  onClose,
}: CharacterPreviewBottomSheetProps) {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedRoomId = useMemo(
    () => roomId.trim().replace(/\s+/g, "-").slice(0, 80),
    [roomId],
  );

  if (!character) return null;

  async function handleStartChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!character || !normalizedRoomId || loading) return;

    setLoading(true);
    setErrorMessage("");

    const response = await fetch("/api/ai-chat-demo/rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId: character.id,
        roomId: normalizedRoomId,
      }),
    });

    const data = (await response.json()) as {
      roomId?: string;
      error?: string;
    };

    setLoading(false);

    if (!response.ok || !data.roomId) {
      setErrorMessage(data.error || "채팅방을 만들지 못했습니다.");
      return;
    }

    router.push(
      `/demos/character-chat-replay/chat/${character.id}?roomId=${encodeURIComponent(data.roomId)}`,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleStartChat}
        className="w-full max-w-[500px] rounded-t-2xl bg-white p-4 pb-6"
        onClick={(event) => event.stopPropagation()}
      >
        <CharacterPreviewHero character={character} />

        <label className="mt-4 block">
          <span className="text-sm font-bold text-[#17191C]">채팅 ID</span>
          <input
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            placeholder="예: my-first-chat"
            className="mt-2 h-12 w-full rounded-lg border-2 border-[#F4F5F6] px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
          />
          {roomId && normalizedRoomId !== roomId && (
            <span className="mt-1 block text-xs font-medium text-[#72777E]">
              공백은 `-`로 바뀌어 `{normalizedRoomId}`로 생성됩니다.
            </span>
          )}
        </label>

        {errorMessage && (
          <p className="mt-3 text-sm font-semibold text-[#EE4553]">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!normalizedRoomId || loading}
          className="mt-4 h-12 w-full rounded-full rounded-tr-none bg-[#FFE55C] text-base font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
        >
          {loading ? "채팅방 생성 중..." : `${character.name}와(과) 대화하기`}
        </button>

        <h3 className="mt-6 text-base font-bold">캐릭터 소개</h3>
        <div className="mt-2 border-l-2 border-[#EDEEEF] py-1 pl-2">
          <p className="break-words text-sm leading-6 text-[#60656C]">
            {character.description}
          </p>
        </div>
      </form>
    </div>
  );
}

function CharacterPreviewHero({
  character,
}: {
  character: DemoPublicCharacter;
}) {
  return (
    <div className="relative flex aspect-square w-full flex-col items-center justify-end overflow-hidden rounded-xl p-4">
      {character.bannerImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={character.bannerImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[40%]"
        />
      ) : (
        <div
          className={`absolute inset-0 h-full w-full bg-gradient-to-br brightness-[70%] ${character.imageGradient}`}
        />
      )}
      {character.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={character.imageUrl}
          alt={`${character.name} profile`}
          className="relative h-14 w-14 rounded-full object-cover"
        />
      ) : (
        <span
          className={`relative h-14 w-14 rounded-full bg-gradient-to-br ${character.imageGradient}`}
        />
      )}
      <h2 className="relative mt-2 text-xl font-bold text-white">
        {character.name}
      </h2>
      <p className="relative text-sm font-medium text-white/70">
        {character.statusMessage || character.role}
      </p>
    </div>
  );
}

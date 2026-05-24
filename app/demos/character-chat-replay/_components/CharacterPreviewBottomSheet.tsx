"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  useCreateDemoChatRoomMutation,
  useDeleteDemoCharacterMutation,
} from "@/lib/ai-chat-demo/api";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import Typography from "@/components/typography/Typography";

type CharacterPreviewBottomSheetProps = {
  character: DemoPublicCharacter | null;
  onClose: () => void;
};

export function CharacterPreviewBottomSheet({
  character,
  onClose,
}: CharacterPreviewBottomSheetProps) {
  const router = useRouter();
  const createRoomMutation = useCreateDemoChatRoomMutation();
  const deleteCharacterMutation = useDeleteDemoCharacterMutation();
  const [roomId, setRoomId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const loading = createRoomMutation.isPending;
  const deleteLoading = deleteCharacterMutation.isPending;
  const normalizedRoomId = useMemo(
    () => roomId.trim().replace(/\s+/g, "-").slice(0, 80),
    [roomId],
  );
  const normalizedDeleteId = useMemo(
    () => deleteId.trim().replace(/\s+/g, "-").slice(0, 80),
    [deleteId],
  );

  async function handleStartChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!character || !normalizedRoomId || loading) return;

    setErrorMessage("");

    try {
      const { roomId, characterId } = await createRoomMutation.mutateAsync({
        characterId: character.id,
        roomId: normalizedRoomId,
      });

      router.push(
        `/demos/character-chat-replay/chat/${characterId}?roomId=${encodeURIComponent(roomId)}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "채팅방을 만들지 못했습니다.",
      );
      return;
    }
  }

  async function handleDeleteCharacter() {
    if (!character || !normalizedDeleteId || deleteLoading) return;

    const confirmed = window.confirm(
      `${character.name} 캐릭터를 삭제할까요? 삭제한 캐릭터와 채팅방은 복구할 수 없습니다.`,
    );

    if (!confirmed) return;

    setDeleteMessage("");

    try {
      await deleteCharacterMutation.mutateAsync({
        characterId: character.id,
        deleteId: normalizedDeleteId,
      });
    } catch (error) {
      setDeleteMessage(
        error instanceof Error
          ? error.message
          : "캐릭터를 삭제하지 못했습니다.",
      );
      return;
    }

    onClose();
    router.refresh();
  }

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (info.offset.y > 140 || info.velocity.y > 600) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {character && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onClick={onClose}
          />
          <motion.form
            onSubmit={handleStartChat}
            className="fixed bottom-0 left-1/2 z-50 max-h-[80vh] w-full max-w-[500px] overflow-y-auto rounded-t-2xl bg-white p-4 pb-6 shadow-[0_-12px_40px_rgba(0,0,0,0.16)]"
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={handleDragEnd}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky -top-4 z-10 -mt-4 mb-3 flex h-9 items-center justify-center bg-white ">
              <span className="h-1 w-12 rounded-full bg-[#D8DBDE]" />
            </div>
            <CharacterPreviewHero character={character} />

            <label className="mt-4 block">
              <Typography as="span" variant="body2" weight={700} color="#17191C">
                채팅 ID
              </Typography>
              <input
                value={roomId}
                onChange={(event) => setRoomId(event.target.value)}
                placeholder="예: my-first-chat"
                className="mt-2 h-12 w-full rounded-lg border-2 border-[#F4F5F6] px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
              />
              {roomId && normalizedRoomId !== roomId && (
                <Typography
                  as="span"
                  variant="body3"
                  weight={500}
                  color="#72777E"
                  className="mt-1 block"
                >
                  공백은 `-`로 바뀌어 `{normalizedRoomId}`로 생성됩니다.
                </Typography>
              )}
            </label>

            {errorMessage && (
              <Typography
                variant="body2"
                weight={600}
                color="#EE4553"
                className="mt-3"
              >
                {errorMessage}
              </Typography>
            )}

            <motion.button
              type="submit"
              disabled={!normalizedRoomId || loading}
              whileTap={
                !normalizedRoomId || loading ? undefined : { scale: 0.97 }
              }
              whileHover={
                !normalizedRoomId || loading ? undefined : { scale: 1.01 }
              }
              transition={{ duration: 0.16 }}
              className="mt-4 h-12 w-full rounded-full rounded-tr-none bg-[#FFE55C] text-base font-bold text-[#17191C] transition-colors disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
            >
              <Typography as="span" variant="body1" weight={700} color="inherit">
                {loading
                  ? "채팅방 생성 중..."
                  : `${character.name}와(과) 대화하기`}
              </Typography>
            </motion.button>

            <Typography variant="body1" weight={700} color="#17191C" className="mt-6">
              캐릭터 소개
            </Typography>
            <div className="mt-2 border-l-2 border-[#EDEEEF] py-1 pl-2">
              <Typography variant="body2" color="#60656C" wordBreak="words">
                {character.description}
              </Typography>
            </div>

            {character.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {character.tags.map((tag) => (
                  <Typography
                    as="span"
                    variant="body3"
                    weight={600}
                    color="#72777E"
                    key={tag}
                    className="rounded-full bg-[#F4F5F6] px-2.5 py-1"
                  >
                    #{tag.replace(/^#/, "")}
                  </Typography>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-xl border border-[#F1D5D8] bg-[#FFF8F8] p-3">
              <Typography variant="body2" weight={700} color="#9B1C27">
                캐릭터 삭제
              </Typography>
              <Typography variant="body3" color="#8A555A" className="mt-1">
                생성할 때 입력한 ID 또는 관리자 ID를 입력하면 캐릭터가
                삭제됩니다. 실제 프러덕트에선 UserID를 확인하여 캐릭터 삭제
                권한을 확인합니다.
              </Typography>
              <label className="mt-3 block">
                <Typography as="span" variant="body3" weight={700} color="#9B1C27">
                  삭제 ID
                </Typography>
                <input
                  value={deleteId}
                  onChange={(event) => setDeleteId(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleDeleteCharacter();
                    }
                  }}
                  placeholder="생성 ID 또는 관리자 ID"
                  className="mt-2 h-11 w-full rounded-lg border-2 border-[#F1D5D8] bg-white px-3 text-sm outline-none placeholder:text-[#C39A9E] focus:border-[#EE4553]"
                />
                {deleteId && normalizedDeleteId !== deleteId && (
                  <Typography
                    as="span"
                    variant="body3"
                    weight={500}
                    color="#8A555A"
                    className="mt-1 block"
                  >
                    공백은 `-`로 바뀌어 `{normalizedDeleteId}`로 확인됩니다.
                  </Typography>
                )}
              </label>
              {deleteMessage && (
                <Typography
                  variant="body3"
                  weight={600}
                  color="#EE4553"
                  className="mt-2"
                >
                  {deleteMessage}
                </Typography>
              )}
              <button
                type="button"
                disabled={!normalizedDeleteId || deleteLoading}
                onClick={handleDeleteCharacter}
                className="mt-3 h-10 w-full rounded-full bg-[#EE4553] text-sm font-bold text-white disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
              >
                <Typography as="span" variant="body2" weight={700} color="inherit">
                  {deleteLoading ? "삭제 중..." : "캐릭터 삭제하기"}
                </Typography>
              </button>
            </div>
          </motion.form>
        </>
      )}
    </AnimatePresence>
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
        <Image
          src={character.bannerImageUrl}
          alt=""
          fill
          sizes="(max-width: 500px) 100vw, 500px"
          className="object-cover brightness-[40%]"
          unoptimized
        />
      ) : (
        <div
          className={`absolute inset-0 h-full w-full bg-gradient-to-br brightness-[70%] ${character.imageGradient}`}
        />
      )}
      <div className="relative flex w-full justify-end">
        <Typography
          as="span"
          variant="body3"
          weight={700}
          color="white"
          className="rounded-full border border-white/35 bg-black/35 px-2.5 py-1 backdrop-blur-sm"
        >
          채팅 {formatChatCount(character.totalChatCount)}
        </Typography>
      </div>
      <div className="flex flex-1 items-end" />
      {character.imageUrl ? (
        <Image
          src={character.imageUrl}
          alt={`${character.name} profile`}
          width={80}
          height={80}
          className="relative h-20 w-20 rounded-full object-cover"
          unoptimized
        />
      ) : (
        <span
          className={`relative h-20 w-20 rounded-full bg-gradient-to-br ${character.imageGradient}`}
        />
      )}
      <Typography variant="h3" color="white" className="relative mt-2">
        {character.name}
      </Typography>
      <Typography
        variant="body2"
        weight={500}
        color="rgba(255,255,255,0.7)"
        className="relative"
      >
        {character.statusMessage || character.role}
      </Typography>
    </div>
  );
}

function formatChatCount(count: number) {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(count % 10000 === 0 ? 0 : 1)}만`;
  }

  return count.toLocaleString("ko-KR");
}

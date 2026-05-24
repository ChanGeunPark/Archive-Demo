"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { CharacterAvatar } from "./CharacterAvatar";
import Typography from "@/components/typography/Typography";

type ChatRoomHeaderProps = {
  character: DemoPublicCharacter;
  deleteDisabled?: boolean;
  deletingRoom?: boolean;
  onDeleteRoom: () => void | Promise<void>;
};

export function ChatRoomHeader({
  character,
  deleteDisabled = false,
  deletingRoom = false,
  onDeleteRoom,
}: ChatRoomHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node) || !menuRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  function handleDeleteClick() {
    setMenuOpen(false);
    void onDeleteRoom();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#EDEEEF] bg-white px-4">
      <Link href="/demos/character-chat-replay">
        <Typography as="span" variant="body2" weight={600} color="#60656C">
          Back
        </Typography>
      </Link>
      <div className="text-center">
        <Typography variant="body1" weight={700} color="#17191C">
          {character.name}
        </Typography>
        <Typography variant="body3" color="#93989F">
          {character.role}
        </Typography>
      </div>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="채팅방 옵션 열기"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-full outline-none ring-[#FFE55C] transition-transform active:scale-95 focus-visible:ring-2"
        >
          <CharacterAvatar
            character={character}
            className="h-9 w-9 rounded-full"
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl border border-[#EDEEEF] bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
            <button
              type="button"
              disabled={deleteDisabled}
              onClick={handleDeleteClick}
              className="w-full px-4 py-3 text-left text-sm font-bold text-[#EE4553] transition-colors hover:bg-[#FFF4F5] disabled:text-[#C6C9CE] disabled:hover:bg-white"
            >
              <Typography
                as="span"
                variant="body2"
                weight={700}
                color="inherit"
              >
                {deletingRoom ? "삭제 중..." : "채팅방 삭제"}
              </Typography>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { cls } from "@/lib/client/utils";
import {
  useSyncMarketplaceUser,
  useUpdateUserAvatar,
} from "@/lib/image-marketplace-flow/graphql/hooks";
import { uploadMarketplaceAvatarImage } from "@/lib/image-marketplace-flow/marketplaceApiClient";
import {
  MARKETPLACE_AVATAR_PRESETS,
  resolveMarketplaceAvatar,
} from "@/lib/image-marketplace-flow/marketplaceAvatar";
import { useMarketplaceStore } from "@/lib/image-marketplace-flow/marketplaceStore";
import type { MarketplaceUser } from "@/lib/image-marketplace-flow/marketplaceTypes";

type MarketplaceUserMenuProps = {
  user: MarketplaceUser;
};

export default function MarketplaceUserMenu({ user }: MarketplaceUserMenuProps) {
  useSyncMarketplaceUser();

  const logout = useMarketplaceStore((state) => state.logout);
  const currentUser = useMarketplaceStore((state) => state.currentUser) ?? user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputId = useId();

  const { updateUserAvatar, loading: updatingAvatar } = useUpdateUserAvatar({
    onCompleted: () => {
      setNotice("프로필 이미지를 변경했습니다.");
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const avatarSrc = resolveMarketplaceAvatar(currentUser.avatar);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setAvatarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAvatarOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handlePresetSelect = async (avatarUrl: string) => {
    setNotice("");
    await updateUserAvatar({
      userId: currentUser.id,
      avatarUrl,
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setNotice("");
      const upload = await uploadMarketplaceAvatarImage({
        file,
        userId: currentUser.id,
      });
      await updateUserAvatar({
        userId: currentUser.id,
        avatarUrl: upload.url,
      });
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
      );
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={() => {
          setMenuOpen((open) => !open);
          if (menuOpen) {
            setAvatarOpen(false);
          }
        }}
        className={cls(
          "inline-flex h-10 items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 shadow-sm transition",
          menuOpen
            ? "border-[#141416] bg-white ring-2 ring-[#141416]/10"
            : "border-zinc-200/80 bg-zinc-50 hover:border-zinc-300",
        )}
      >
        <Image
          src={avatarSrc}
          alt={`${currentUser.name} profile`}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white"
        />
        <div className="hidden min-w-0 max-w-[120px] text-left sm:block">
          <p className="truncate text-xs font-bold text-gray-900">
            {currentUser.name}
          </p>
          <p className="truncate text-[10px] font-medium text-gray-500">
            @{currentUser.handle}
          </p>
        </div>
        <IoChevronDown
          size={14}
          aria-hidden
          className={cls(
            "shrink-0 text-gray-500 transition-transform",
            menuOpen && "rotate-180",
          )}
        />
      </button>

      {menuOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,280px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_16px_40px_rgba(20,20,22,0.12)]"
        >
          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <Image
                src={avatarSrc}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  @{currentUser.handle}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              aria-expanded={avatarOpen}
              onClick={() => setAvatarOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-800 transition hover:bg-zinc-50"
            >
              프로필 이미지 변경
              <IoChevronDown
                size={16}
                aria-hidden
                className={cls(
                  "text-gray-400 transition-transform",
                  avatarOpen && "rotate-180",
                )}
              />
            </button>

            {avatarOpen ? (
              <div className="space-y-3 px-3 pb-2">
                <div className="flex flex-wrap gap-2">
                  {MARKETPLACE_AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={updatingAvatar}
                      onClick={() => handlePresetSelect(preset)}
                      className={cls(
                        "rounded-full p-0.5 transition",
                        avatarSrc === preset
                          ? "ring-2 ring-[#141416]"
                          : "ring-1 ring-zinc-200 hover:ring-zinc-400",
                        updatingAvatar && "opacity-60",
                      )}
                    >
                      <Image
                        src={preset}
                        alt=""
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={updatingAvatar}
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor={fileInputId}
                    className={cls(
                      "inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-full border border-[#D8DBDE] bg-white text-xs font-bold text-[#3F444B] transition hover:border-[#17191C]",
                      updatingAvatar && "pointer-events-none opacity-60",
                    )}
                  >
                    {updatingAvatar ? "변경 중..." : "이미지 업로드"}
                  </label>
                </div>
              </div>
            ) : null}

            {notice ? (
              <p className="mx-3 mb-2 rounded-lg bg-[#FFF8D7] px-3 py-2 text-[11px] font-semibold leading-5 text-[#6F5600]">
                {notice}
              </p>
            ) : null}

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                logout();
                setMenuOpen(false);
                setAvatarOpen(false);
              }}
              className="mt-1 flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold text-red-500 transition hover:bg-red-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

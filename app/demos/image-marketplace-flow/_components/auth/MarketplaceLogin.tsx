"use client";

import Image from "next/image";
import { useState } from "react";
import {
  hydrateMarketplaceAuthFromStorage,
  useMarketplaceStore,
} from "@/lib/image-marketplace-flow/marketplaceStore";
import { resolveMarketplaceAvatar } from "@/lib/image-marketplace-flow/marketplaceAvatar";
import MarketplaceUserMenu from "./MarketplaceUserMenu";

type MarketplaceLoginProps = {
  variant?: "compact" | "panel";
};

export default function MarketplaceLogin({
  variant = "compact",
}: MarketplaceLoginProps) {
  const currentUser = useMarketplaceStore((state) => state.currentUser);
  const loginWithId = useMarketplaceStore((state) => state.loginWithId);
  const logout = useMarketplaceStore((state) => state.logout);
  const [loginId, setLoginId] = useState("");

  hydrateMarketplaceAuthFromStorage();

  if (currentUser) {
    const avatarSrc = resolveMarketplaceAvatar(currentUser.avatar);

    if (variant === "panel") {
      return (
        <section className="rounded-[1.25rem] border border-[#ECEEF0] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)]">
          <MarketplaceUserMenu user={currentUser} />
          <div className="mt-4 flex items-center gap-3">
            <Image
              src={avatarSrc}
              alt={`${currentUser.name} profile`}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-[#C39A00]">
                Logged in
              </p>
              <h2 className="truncate text-xl font-black text-[#17191C]">
                {currentUser.name}
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#656B73]">
            헤더의 프로필 메뉴에서 아바타를 변경하거나 로그아웃할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 h-11 w-full rounded-full border border-[#D8DBDE] text-sm font-black text-[#3F444B] transition hover:border-[#17191C] lg:hidden"
          >
            로그아웃
          </button>
        </section>
      );
    }

    return <MarketplaceUserMenu user={currentUser} />;
  }

  if (variant === "panel") {
    return (
      <section className="rounded-[1.25rem] border border-[#ECEEF0] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-8">
        <p className="text-sm font-black uppercase text-[#C39A00]">Login</p>
        <h2 className="mt-2 text-2xl font-black">작품 등록 로그인</h2>
        <p className="mt-3 text-sm leading-6 text-[#656B73]">
          작품을 등록하려면 먼저 ID로 로그인해 주세요. 입력한 ID는
          localStorage에 저장됩니다.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            loginWithId(loginId);
            setLoginId("");
          }}
        >
          <input
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            placeholder="artist-id"
            className="h-12 w-full rounded-xl border-2 border-[#ECEEF0] bg-white px-4 text-base outline-none transition placeholder:text-[#A7ABB0] focus:border-[#17191C]"
          />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-[#17191C] text-sm font-black text-white"
          >
            로그인
          </button>
        </form>
      </section>
    );
  }

  return (
    <form
      className="flex items-center"
      onSubmit={(event) => {
        event.preventDefault();
        loginWithId(loginId);
        setLoginId("");
      }}
    >
      <input
        value={loginId}
        onChange={(event) => setLoginId(event.target.value)}
        placeholder="ID 입력"
        className="h-10 w-18 rounded-l-full border border-[#D8DBDE] bg-white px-3 text-sm outline-none transition placeholder:text-[#A7ABB0] focus:border-[#17191C]"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center rounded-r-full bg-[#17191C] px-4 text-xs font-bold text-white transition hover:bg-[#2a2a2e]"
      >
        로그인
      </button>
    </form>
  );
}

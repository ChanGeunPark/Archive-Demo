"use client";

import { useState } from "react";
import { useMarketplaceStore, hydrateMarketplaceAuthFromStorage } from "@/lib/image-marketplace-flow/marketplaceStore";

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
    if (variant === "panel") {
      return (
        <section className="rounded-[1.25rem] border border-[#ECEEF0] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)]">
          <p className="text-sm font-black uppercase text-[#C39A00]">Logged in</p>
          <h2 className="mt-2 text-2xl font-black">{currentUser.id}</h2>
          <p className="mt-2 text-sm leading-6 text-[#656B73]">
            이 ID로 작품을 등록합니다. 다른 계정으로 바꾸려면 로그아웃 후 다시
            로그인하세요.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 h-11 w-full rounded-full border border-[#D8DBDE] text-sm font-black text-[#3F444B]"
          >
            로그아웃
          </button>
        </section>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-36 truncate text-sm font-bold text-[#3F444B] sm:block">
          {currentUser.id}
        </span>
        <button
          type="button"
          onClick={logout}
          className="h-10 rounded-md border border-[#D8DBDE] bg-white px-3 text-sm font-bold text-[#3F444B] transition hover:border-[#17191C]"
        >
          로그아웃
        </button>
      </div>
    );
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
      className="flex items-center gap-2"
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
        className="hidden h-10 w-32 rounded-md border border-[#D8DBDE] bg-white px-3 text-sm outline-none transition placeholder:text-[#A7ABB0] focus:border-[#17191C] sm:block"
      />
      <button
        type="submit"
        className="h-10 rounded-md bg-[#17191C] px-4 text-sm font-bold text-white"
      >
        로그인
      </button>
    </form>
  );
}

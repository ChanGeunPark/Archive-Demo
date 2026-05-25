"use client";

import { useState } from "react";
import { useMarketplaceStore } from "@/lib/image-marketplace-flow/marketplaceStore";

export default function MarketplaceLogin() {
  const currentUser = useMarketplaceStore((state) => state.currentUser);
  const loginWithId = useMarketplaceStore((state) => state.loginWithId);
  const logout = useMarketplaceStore((state) => state.logout);
  const [loginId, setLoginId] = useState("");

  if (currentUser) {
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

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        loginWithId(loginId || "demo-buyer");
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

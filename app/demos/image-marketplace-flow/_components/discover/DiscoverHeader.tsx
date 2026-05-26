"use client";

import CreateArtworkLink from "../auth/CreateArtworkLink";
import MarketplaceLogin from "../auth/MarketplaceLogin";
import MarketplaceHeaderShell from "../layout/MarketplaceHeaderShell";

type DiscoverHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function DiscoverHeader({
  query,
  onQueryChange,
}: DiscoverHeaderProps) {
  return (
    <MarketplaceHeaderShell
      backHref="/"
      backLabel="Archive"
      center={
        <label className="hidden h-10 w-full max-w-lg items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-4 shadow-sm transition focus-within:border-[#141416] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#141416]/10 md:flex">
          <span className="text-lg text-[#777D84]" aria-hidden>
            ⌕
          </span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="작품, 아티스트, 태그 검색"
            className="h-full w-full bg-transparent text-sm text-[#17191C] outline-none placeholder:text-[#A7ABB0]"
          />
        </label>
      }
      trailing={
        <>
          <CreateArtworkLink />
          <MarketplaceLogin />
        </>
      }
    />
  );
}

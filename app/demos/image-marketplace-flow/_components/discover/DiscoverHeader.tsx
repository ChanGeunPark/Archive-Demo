"use client";

import { FormEvent, useRef, useState } from "react";
import CreateArtworkLink from "../auth/CreateArtworkLink";
import MarketplaceLogin from "../auth/MarketplaceLogin";
import MarketplaceHeaderShell from "../layout/MarketplaceHeaderShell";
import DiscoverSearchDropdown from "./DiscoverSearchDropdown";
import { IoSearch } from "react-icons/io5";

type DiscoverHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function DiscoverHeader({
  query,
  onQueryChange,
}: DiscoverHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftQuery, setDraftQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const applySearch = (value: string) => {
    const trimmed = value.trim();
    onQueryChange(trimmed);
    setDraftQuery(trimmed);
    closeDropdown();
    inputRef.current?.blur();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch(draftQuery);
  };

  const showResults = showDropdown && draftQuery.trim().length > 0;

  return (
    <MarketplaceHeaderShell
      backHref="/"
      backLabel="Archive"
      center={
        <form
          onSubmit={handleSubmit}
          className="relative hidden w-full max-w-lg md:block"
        >
          <label
            className={`flex h-10 w-full items-center gap-2 rounded-full border bg-zinc-50/80 px-3 shadow-sm transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#141416]/10 ${
              isFocused
                ? "border-[#141416]"
                : "border-zinc-200 focus-within:border-[#141416]"
            }`}
          >
            <span className="text-lg text-[#777D84]" aria-hidden>
              <IoSearch />
            </span>
            <input
              ref={inputRef}
              value={draftQuery}
              onFocus={() => {
                setIsFocused(true);
                if (draftQuery.trim()) {
                  setShowDropdown(true);
                }
              }}
              onBlur={() => {
                if (draftQuery.trim().length === 0) {
                  setIsFocused(false);
                }
              }}
              onChange={(event) => {
                const value = event.target.value;
                setDraftQuery(value);
                setShowDropdown(value.trim().length > 0);
                setIsFocused(value.trim().length > 0 || isFocused);
              }}
              placeholder="작품 검색"
              autoComplete="off"
              className="h-full w-full bg-transparent text-sm text-[#17191C] outline-none placeholder:text-[#A7ABB0]"
            />
            {isFocused && draftQuery ? (
              <button
                type="button"
                aria-label="검색어 지우기"
                className="text-sm text-[#939FB6] transition hover:text-[#17191C]"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setDraftQuery("");
                  setShowDropdown(false);
                  setIsFocused(false);
                  inputRef.current?.focus();
                }}
              >
                ✕
              </button>
            ) : null}
          </label>

          {showResults ? (
            <>
              <div className="absolute left-1/2 top-[calc(100%+0.75rem)] z-[60] max-h-[80vh] w-full -translate-x-1/2 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-[0px_10px_32px_rgba(0,0,0,0.12)]">
                <div className="max-h-[80vh] overflow-y-auto">
                  <DiscoverSearchDropdown
                    keyword={draftQuery}
                    onNavigate={closeDropdown}
                  />
                </div>
              </div>
              <button
                type="button"
                aria-label="검색 닫기"
                className="fixed inset-0 z-[49] cursor-default bg-transparent"
                onMouseDown={(event) => event.preventDefault()}
                onClick={closeDropdown}
              />
            </>
          ) : null}
        </form>
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

"use client";

import { FormEvent, useRef, useState } from "react";
import DiscoverSearchDropdown from "./DiscoverSearchDropdown";

type DiscoverMobileSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function DiscoverMobileSearch({
  query,
  onQueryChange,
}: DiscoverMobileSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftQuery, setDraftQuery] = useState(query);
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
    <form onSubmit={handleSubmit} className="relative mb-4 md:hidden">
      <div className="flex h-11 items-center rounded-full border border-[#D8DBDE] bg-white px-3">
        <span className="mr-2 text-[#777D84]">⌕</span>
        <input
          ref={inputRef}
          value={draftQuery}
          onFocus={() => {
            if (draftQuery.trim()) {
              setShowDropdown(true);
            }
          }}
          onChange={(event) => {
            const value = event.target.value;
            setDraftQuery(value);
            setShowDropdown(value.trim().length > 0);
          }}
          placeholder="작품 검색"
          autoComplete="off"
          className="h-full w-full bg-transparent text-sm outline-none"
        />
        {draftQuery ? (
          <button
            type="button"
            aria-label="검색어 지우기"
            className="text-sm text-[#939FB6]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setDraftQuery("");
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        ) : null}
      </div>

      {showResults ? (
        <>
          <div className="absolute top-[calc(100%+0.5rem)] z-[60] max-h-[60vh] w-full overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-[0px_10px_32px_rgba(0,0,0,0.12)]">
            <div className="max-h-[60vh] overflow-y-auto">
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
  );
}

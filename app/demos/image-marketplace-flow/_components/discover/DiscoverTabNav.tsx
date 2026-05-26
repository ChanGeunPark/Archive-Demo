"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cls } from "@/lib/client/utils";
import {
  formatPriceFilterLabel,
  hasActivePriceFilter,
  isSamePriceRange,
  PRICE_FILTER_OPTIONS,
  type PriceFilterRange,
} from "./discoverPriceFilter";

function FilterIcon({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9.5 16a.68.68 0 0 1-.5-.146.68.68 0 0 1-.146-.5v-4.729L4.104 4.812a.49.49 0 0 1-.052-.531A.47.47 0 0 1 4.5 4h11a.47.47 0 0 1 .448.281.49.49 0 0 1-.052.531L11 10.771V15.5a.68.68 0 0 1-.146.354.68.68 0 0 1-.354.146h-1ZM10 9.625 13.375 5.5H6.604L10 9.625Z"
        fill={active ? "#F3CC00" : "#6B7280"}
      />
    </svg>
  );
}

type DiscoverTabNavProps = {
  priceFilter: PriceFilterRange;
  onPriceFilterChange: (range: PriceFilterRange) => void;
};

export default function DiscoverTabNav({
  priceFilter,
  onPriceFilterChange,
}: DiscoverTabNavProps) {
  const menuId = useId();
  const filterRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const isFilterActive = hasActivePriceFilter(priceFilter);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handlePresetSelect = (range: PriceFilterRange) => {
    onPriceFilterChange(range);
    setCustomMin("");
    setCustomMax("");
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    const minPrice = customMin.trim()
      ? Number(customMin.replace(/,/g, ""))
      : undefined;
    const maxPrice = customMax.trim()
      ? Number(customMax.replace(/,/g, ""))
      : undefined;

    if (
      (customMin.trim() && (!Number.isFinite(minPrice) || minPrice! < 0)) ||
      (customMax.trim() && (!Number.isFinite(maxPrice) || maxPrice! < 0))
    ) {
      return;
    }

    if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
      return;
    }

    onPriceFilterChange({
      minPrice: minPrice != null && minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice != null && maxPrice > 0 ? maxPrice : undefined,
    });
    setIsOpen(false);
  };

  return (
    <section className="mx-auto mb-5 w-full">
      <nav className="flex w-full justify-between">
        <div className="flex w-full flex-col content-center items-start justify-between xl:flex-row">
          <section className="flex w-full items-center justify-between border-b border-zinc-100">
            <nav className="flex h-10 w-full items-center overflow-hidden overflow-x-auto">
              <div className="relative flex h-full items-center justify-center text-center">
                <span className="relative flex h-full cursor-default items-center justify-center break-keep px-3 text-center text-[13px] font-semibold whitespace-nowrap text-gray-700">
                  <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-zinc-800" />
                  작품
                </span>
              </div>
            </nav>

            <div ref={filterRef} className="relative shrink-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls={menuId}
                onClick={() => setIsOpen((open) => !open)}
                className={cls(
                  "flex h-8 w-fit max-w-[150px] shrink-0 items-center justify-center gap-1 rounded-md border px-4 text-[13px] font-semibold transition-all max-lg:w-[30px] max-lg:p-0",
                  isFilterActive || isOpen
                    ? "border-[#F3CC00]"
                    : "border-[#D5DBE4] hover:border-gray-700",
                )}
              >
                <FilterIcon
                  active={isFilterActive || isOpen}
                  className="shrink-0"
                />
                <span
                  className={cls(
                    "shrink-0 whitespace-nowrap max-lg:hidden",
                    isFilterActive || isOpen
                      ? "text-[#F3CC00]"
                      : "text-gray-500",
                  )}
                >
                  Filter
                </span>
              </button>

              {isOpen ? (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute top-[calc(100%+4px)] right-0 z-40 w-[240px] rounded-lg border border-zinc-100 bg-white p-3 shadow-lg"
                >
                  <p className="mb-2 text-xs font-bold text-gray-500">가격</p>
                  <ul className="space-y-1">
                    {PRICE_FILTER_OPTIONS.map((option) => {
                      const selected = isSamePriceRange(
                        option.range,
                        priceFilter,
                      );
                      return (
                        <li key={option.id}>
                          <button
                            type="button"
                            role="menuitemradio"
                            aria-checked={selected}
                            onClick={() => handlePresetSelect(option.range)}
                            className={cls(
                              "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-[13px] font-semibold transition-colors",
                              selected
                                ? "bg-[#FFF9D6] text-gray-800"
                                : "text-gray-600 hover:bg-zinc-50",
                            )}
                          >
                            {option.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-3 border-t border-zinc-100 pt-3">
                    <p className="mb-2 text-xs font-bold text-gray-500">
                      직접 설정 (원)
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="최소"
                        value={customMin}
                        onChange={(event) => setCustomMin(event.target.value)}
                        className="h-8 w-full rounded-md border border-zinc-200 px-2 text-[13px] outline-none focus:border-[#F3CC00]"
                      />
                      <span className="text-xs text-gray-400">~</span>
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="최대"
                        value={customMax}
                        onChange={(event) => setCustomMax(event.target.value)}
                        className="h-8 w-full rounded-md border border-zinc-200 px-2 text-[13px] outline-none focus:border-[#F3CC00]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCustomApply}
                      className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center rounded-md bg-[#F3CC00] text-[13px] font-bold text-gray-800 transition-opacity hover:opacity-90"
                    >
                      적용
                    </button>
                  </div>

                  {isFilterActive ? (
                    <p className="mt-2 text-center text-[11px] font-medium text-gray-400">
                      {formatPriceFilterLabel(priceFilter)}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </nav>
    </section>
  );
}

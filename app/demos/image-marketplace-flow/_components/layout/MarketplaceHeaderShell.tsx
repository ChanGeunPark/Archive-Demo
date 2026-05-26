"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";

type MarketplaceHeaderShellProps = {
  backHref: string;
  backLabel?: string;
  center?: ReactNode;
  trailing: ReactNode;
};

export default function MarketplaceHeaderShell({
  backHref,
  backLabel = "뒤로가기",
  center,
  trailing,
}: MarketplaceHeaderShellProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100/90 bg-white/90 shadow-[0_1px_0_rgba(20,20,22,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 lg:gap-5 lg:px-10">
        <Link
          href={backHref}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-semibold text-[#3F444B] transition hover:bg-zinc-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 transition group-hover:bg-zinc-200">
            <KeyboardArrowLeftIcon />
          </span>
          <span className="text-base">{backLabel}</span>
        </Link>

        {center ? (
          <div className="flex min-w-0 flex-1 justify-center">{center}</div>
        ) : (
          <div className="flex-1" aria-hidden />
        )}

        <div className="flex shrink-0 items-center gap-2">{trailing}</div>
      </div>
    </header>
  );
}

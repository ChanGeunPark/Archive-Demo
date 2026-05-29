"use client";

import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import KeyboardArrowDownIcon from "@/components/icons/arrow/KeyboardArrowDownIcon";
import KeyboardArrowUpIcon from "@/components/icons/arrow/KeyboardArrowUpIcon";
import { cls } from "@/lib/client/utils";
import type { EpisodeDetail } from "@/lib/webtoon-demo/types";

type EpisodeHeaderProps = {
  opened: boolean;
  episodeData: EpisodeDetail;
  startRef: RefObject<HTMLDivElement | null>;
  finishRef: RefObject<HTMLDivElement | null>;
};

export default function EpisodeHeader({
  opened,
  episodeData,
  startRef,
  finishRef,
}: EpisodeHeaderProps) {
  const router = useRouter();

  return (
    <>
      <header
        className={cls(
          "fixed left-0 top-0 z-10 w-full overflow-hidden  bg-white px-4 transition-all lg:!h-[64px]",
        )}
        style={{ height: opened ? "72px" : "0" }}
      >
        <div className="mx-auto flex h-full max-w-[620px] items-center justify-between">
          <button
            type="button"
            className="flex h-full items-center pr-4"
            onClick={() => router.push("/demos/webtoon")}
          >
            <KeyboardArrowLeftIcon className="fill-gray-800" />
            <h5 className="ml-2 text-sm font-bold text-gray-800">
              {episodeData.title}
            </h5>
          </button>
        </div>
      </header>

      <div
        className={cls(
          "fixed right-4 top-[calc(72px+16px)] z-10 space-y-2 transition-all duration-300",
          opened ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="맨 위로"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-sm backdrop-blur"
          onClick={() =>
            startRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <KeyboardArrowUpIcon className="h-5 w-5 fill-gray-800" />
        </button>
        <button
          type="button"
          aria-label="맨 아래로"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-sm backdrop-blur"
          onClick={() =>
            finishRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <KeyboardArrowDownIcon className="h-5 w-5 fill-gray-800" />
        </button>
      </div>
    </>
  );
}

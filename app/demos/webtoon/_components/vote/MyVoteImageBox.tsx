"use client";

import type { RefObject } from "react";
import type { EpisodeDetail, VoteCandidate } from "@/lib/webtoon-demo/types";

type MyVoteImageBoxProps = {
  captureRef?: RefObject<HTMLDivElement | null>;
  voted: VoteCandidate;
  episode: EpisodeDetail;
};

export default function MyVoteImageBox({
  captureRef,
  voted,
  episode,
}: MyVoteImageBoxProps) {
  return (
    <div className="mx-auto w-[300px] shadow-elevation02">
      <div
        ref={captureRef}
        className="relative flex w-[300px] flex-col overflow-hidden rounded-xl border-2 border-gray-100 bg-white"
      >
        <div className="absolute top-[22px] -left-[35px] z-[1] w-[140px] -rotate-45 bg-primaryMain py-[4px] text-center">
          <p className="font-bold text-gray-900">MY PICK!</p>
        </div>

        <section className="w-[300px] border-t border-gray-100 bg-white p-[10px] px-[20px] text-center">
          <p className="mb-[8px] text-[13px] font-normal text-gray-900 opacity-50">
            {episode.series.title}
          </p>
          <h5 className="text-[20px] font-bold leading-normal text-gray-800">
            {voted.title}
          </h5>
        </section>
      </div>
    </div>
  );
}

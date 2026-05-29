"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cls } from "@/lib/client/utils";
import { dateFormatting } from "@/lib/webtoon-demo/formatters";
import type { Episode } from "@/lib/webtoon-demo/types";
import EpisodeVotedCount from "./EpisodeVotedCount";
import EpisodeVotedList from "./EpisodeVotedList";

function parseThumbnail(imageStr: string): string {
  try {
    const parsed = JSON.parse(imageStr) as { default?: string };
    return parsed.default ?? "/images/webtoon/thumb.jpg";
  } catch {
    return "/images/webtoon/thumb.jpg";
  }
}

type EpisodeListItemProps = {
  episode: Episode;
  isViewed?: boolean;
  onClick?: () => void;
};

export default function EpisodeListItem({
  episode,
  isViewed,
  onClick,
}: EpisodeListItemProps) {
  const [showVote, setShowVote] = useState(false);

  const { sortVoteResult, totalSum, winnerIndex } = useMemo(() => {
    const voteResult = [...(episode.voteResult ?? [])].sort(
      (a, b) => a.selectionNumber - b.selectionNumber
    );
    const sum = voteResult.reduce((acc, item) => acc + (item.voteSum ?? 0), 0);
    let maxIndex = 0;
    let maxValue = 0;
    voteResult.forEach((item, index) => {
      if ((item.voteSum ?? 0) > maxValue) {
        maxValue = item.voteSum ?? 0;
        maxIndex = index;
      }
    });
    return { sortVoteResult: voteResult, totalSum: sum, winnerIndex: maxIndex };
  }, [episode.voteResult]);

  const isVoting =
    episode.voteExpireAt && new Date(episode.voteExpireAt) > new Date();

  if (!episode.id || !episode.title) return null;

  return (
    <section
      className={cls(
        "relative mb-0.5 flex h-fit cursor-pointer flex-wrap items-end justify-between rounded-md py-2",
        isViewed ? "bg-gray-25" : "bg-white"
      )}
    >
      <button
        type="button"
        className="flex flex-1 items-end text-left"
        onClick={onClick}
      >
        <div
          className={cls(
            "relative mx-2 h-[60px] w-[80px] shrink-0 overflow-hidden rounded-md border-[1.5px] border-gray-50"
          )}
        >
          <Image
            src={parseThumbnail(episode.thumbnailImages)}
            alt={`${episode.title} thumbnail`}
            width={80}
            height={60}
            className="h-full w-full bg-gray-50 object-cover"
          />
        </div>

        <div className="flex h-[60px] w-full flex-col justify-between">
          <h5
            className={cls(
              "text-sm font-bold leading-5",
              isViewed ? "text-gray-400" : "text-gray-900"
            )}
          >
            {episode.title}
          </h5>
          <p
            className={cls(
              "text-xs font-normal leading-4",
              isViewed ? "text-gray-300" : "text-gray-500"
            )}
          >
            {episode.beginAt
              ? dateFormatting({
                  time: episode.beginAt,
                  customOptions: { dateStyle: "medium" },
                })
              : "-"}
          </p>
        </div>
      </button>

      <div className="absolute right-0 top-[52px] flex">
        <EpisodeVotedCount
          episodeType={episode.episodeType}
          isVoting={Boolean(isVoting)}
          isViewed={isViewed}
          sortVoteResult={sortVoteResult}
          showVote={showVote}
          setShowVote={setShowVote}
          totalSum={totalSum}
        />
      </div>

      {showVote ? (
        <EpisodeVotedList
          sortVoteResult={sortVoteResult}
          totalSum={totalSum}
          winnerIndex={winnerIndex}
          showVote={showVote}
        />
      ) : null}
    </section>
  );
}

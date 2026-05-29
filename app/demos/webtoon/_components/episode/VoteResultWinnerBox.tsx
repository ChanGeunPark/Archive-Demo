"use client";

import Image from "next/image";
import { useMemo } from "react";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import { parseThumbnail } from "@/lib/webtoon-demo/episodeHelpers";
import type { Episode, EpisodeDetail } from "@/lib/webtoon-demo/types";
import EpisodeVotedList from "../series/EpisodeVotedList";

type VoteResultWinnerBoxProps = {
  episodeData: EpisodeDetail;
};

export default function VoteResultWinnerBox({ episodeData }: VoteResultWinnerBoxProps) {
  const { sortVoteResult, totalSum, winnerIndex, winner } = useMemo(() => {
    const voteResult = [...(episodeData.voteResult ?? [])].sort(
      (a, b) => a.selectionNumber - b.selectionNumber,
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
    return {
      sortVoteResult: voteResult,
      totalSum: sum,
      winnerIndex: maxIndex,
      winner: voteResult[maxIndex],
    };
  }, [episodeData.voteResult]);

  if (!winner) return null;

  return (
    <div id="result" className="relative mx-auto w-full max-w-[620px] px-3 pb-10 lg:px-0">
      <Image
        src={parseThumbnail(episodeData.thumbnailImages)}
        alt="vote result image"
        width={620}
        height={404}
        className="h-auto w-full rounded-xl"
      />
      <Typography
        variant="h4"
        align="center"
        className="mt-4 border-2 border-gray-900 px-2 py-4 !text-gray-900"
      >
        {winner.title}
      </Typography>
      <EpisodeVotedList
        sortVoteResult={sortVoteResult}
        totalSum={totalSum}
        winnerIndex={winnerIndex}
        showVote
      />
    </div>
  );
}

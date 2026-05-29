"use client";

import Image from "next/image";
import { useMemo } from "react";
import { cls } from "@/lib/client/utils";
import { buildVoteSumData } from "@/lib/webtoon-demo/voteHelpers";
import MinimumVotingButton from "./MinimumVotingButton";
import type { VotingEpisodeBoxProps } from "./FullPageVoteLayout";

export default function MinimumPageVoteLayout({
  voteCandidates,
  currentVoteId,
  remainingVoteCount,
  selectHandler,
  selectionNumber,
  isVoted,
  showBottomSheetToggler,
}: VotingEpisodeBoxProps) {
  const voteSumData = useMemo(
    () => buildVoteSumData(voteCandidates),
    [voteCandidates],
  );

  return (
    <div
      className="grid w-full auto-rows-auto grid-flow-row grid-rows-1 gap-4 p-4"
      style={{ gridTemplateColumns: `repeat(${voteCandidates.length}, minmax(0, 1fr))` }}
    >
      {voteSumData.map((vote, index) => (
        <div key={vote.id}>
          <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl border-2 border-gray-50">
            <button
              type="button"
              className="h-full w-full"
              onClick={() => {
                if (isVoted) return;
                selectHandler(vote.id);
              }}
            >
              <Image
                src={vote.voteImage}
                alt="vote image"
                width={620}
                height={620}
                className={cls(
                  "h-full w-full object-cover object-center",
                  currentVoteId && vote.id !== currentVoteId && "brightness-[0.8]",
                )}
              />
            </button>
          </div>

          <MinimumVotingButton
            voteTitle={vote.title}
            voteId={vote.id}
            currentVoteId={currentVoteId}
            currentVotePercentage={vote.percentage}
            selfAndWinOrSecondVote={vote.selfAndWinOrSecondVote}
            isVoted={isVoted}
            isSelected={selectionNumber === index + 1}
            isWinner={vote.isWinner}
            className="!w-full text-right"
            onClick={() => selectHandler(vote.id)}
            showBottomSheetToggler={showBottomSheetToggler}
          />
        </div>
      ))}
    </div>
  );
}

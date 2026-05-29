"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import { buildVoteSumData } from "@/lib/webtoon-demo/voteHelpers";
import type { VoteCandidate } from "@/lib/webtoon-demo/types";
import { IoEye, IoEyeOff } from "react-icons/io5";
import VoteQuestionButton from "./VoteQuestionButton";

export type VotingEpisodeBoxProps = {
  voteCandidates: VoteCandidate[];
  currentVoteId?: string;
  remainingVoteCount: number;
  selectHandler: (voteId: string) => void;
  selectionNumber?: number;
  isVoted: boolean;
  showBottomSheetToggler: () => void;
};

export default function FullPageVoteLayout({
  voteCandidates,
  currentVoteId,
  remainingVoteCount,
  selectHandler,
  selectionNumber,
  isVoted,
  showBottomSheetToggler,
}: VotingEpisodeBoxProps) {
  const [showVote, setShowVote] = useState(true);

  const voteSumData = useMemo(
    () => buildVoteSumData(voteCandidates),
    [voteCandidates],
  );

  const selectedImage = voteCandidates.find((vote) => vote.id === currentVoteId)?.voteImage;
  const completeVote = isVoted && remainingVoteCount === 0;

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        {selectedImage && currentVoteId ? (
          <Image
            src={selectedImage}
            alt="vote image"
            width={620}
            height={620}
            className="min-h-[300px] w-full border-y-4 border-gray-900 object-cover object-center"
          />
        ) : (
          <div className="aspect-square w-full border-y-4 border-gray-900 bg-gray-100">
            <Image
              src="/images/default/img_vote_default.png"
              alt="vote default"
              width={620}
              height={620}
              className="h-auto w-full object-contain opacity-50"
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 flex w-full flex-col space-y-3 px-4 py-6">
        <div className="flex items-center justify-between space-x-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
            onClick={() => setShowVote((prev) => !prev)}
          >
            {showVote ? (
              <IoEye className="text-white" aria-hidden />
            ) : (
              <IoEyeOff className="text-white" aria-hidden />
            )}
          </button>

          {!showVote ? (
            <div className="flex items-center space-x-2">
              {voteSumData.map((vote, index) => (
                <button
                  key={vote.id}
                  type="button"
                  className={cls(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white lg:h-10 lg:w-10",
                    vote.id === currentVoteId && "!border-gray-900 !bg-primaryMain",
                  )}
                  onClick={() => {
                    if (completeVote) return;
                    showBottomSheetToggler();
                    if (!isVoted) selectHandler(vote.id);
                  }}
                >
                  <Typography
                    variant="h5"
                    className={vote.id === currentVoteId ? "!text-gray-900" : "!text-gray-400"}
                  >
                    {index + 1}
                  </Typography>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {showVote
          ? voteSumData.map((vote, index) => (
              <VoteQuestionButton
                key={vote.id}
                voteTitle={vote.title}
                voteId={vote.id}
                currentVoteId={currentVoteId}
                currentVotePercentage={vote.percentage}
                selfAndWinOrSecondVote={vote.selfAndWinOrSecondVote}
                isVoted={isVoted}
                isSelected={selectionNumber === index + 1}
                isWinner={vote.isWinner}
                completeVote={completeVote}
                className="!w-full text-right"
                onClick={() => selectHandler(vote.id)}
                showBottomSheetToggler={showBottomSheetToggler}
              />
            ))
          : null}
      </div>
    </div>
  );
}

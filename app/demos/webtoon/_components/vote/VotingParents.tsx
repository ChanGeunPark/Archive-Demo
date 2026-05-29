"use client";

import { useEffect, useState } from "react";
import { cls } from "@/lib/client/utils";
import { useVoteDemo } from "@/lib/webtoon-demo/hooks/useVoteDemo";
import type { EpisodeDetail } from "@/lib/webtoon-demo/types";
import ChizuButton from "../dashboard/ui/ChizuButton";
import { IoShareOutline } from "react-icons/io5";
import VoteDownloadBottomSheet from "./VoteDownloadBottomSheet";
import VotedModal from "./VotedModal";
import VotingBottomLine from "./VotingBottomLine";
import VotingEpisodeBox from "./VotingEpisodeBox";

type VotingParentsProps = {
  seoId: string;
  episode: EpisodeDetail;
};

export default function VotingParents({ seoId, episode }: VotingParentsProps) {
  const {
    hydrated,
    voteCandidates,
    userVote,
    sessionInfo,
    isVoted,
    submitVote,
  } = useVoteDemo(episode.id, episode.series.cakePrice);

  const [currentVoteId, setCurrentVoteId] = useState<string | undefined>();
  const [showVotingBottomSheet, setShowVotingBottomSheet] = useState(false);
  const [showVoteDownloadBottomSheet, setShowVoteDownloadBottomSheet] = useState(false);
  const [showVotedModal, setShowVotedModal] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userVote?.voteId) {
      setCurrentVoteId(userVote.voteId);
    }
  }, [userVote?.voteId]);

  if (!hydrated || voteCandidates.length === 0) return null;

  const selectedVote = voteCandidates.find((vote) => vote.id === currentVoteId);

  const handleSubmit = async () => {
    if (!currentVoteId) return;
    setLoading(true);
    try {
      await submitVote(currentVoteId, ticketCount);
      setShowVotingBottomSheet(false);
      setShowVotedModal(true);
      setTicketCount(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "UNKNOWN";
      if (message === "NOT_ENOUGH_CAKE") {
        alert("케이크가 부족합니다. 충전 후 다시 시도해 주세요.");
      } else {
        alert("투표에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center bg-white">
        <VotingEpisodeBox
          voteCandidates={voteCandidates}
          currentVoteId={currentVoteId}
          remainingVoteCount={sessionInfo.remainingVoteCount}
          isVoted={isVoted}
          selectionNumber={userVote?.selectionNumber}
          selectHandler={setCurrentVoteId}
          showBottomSheetToggler={() => setShowVotingBottomSheet(true)}
        />

        <div className={cls("mb-20 mt-10 flex w-full items-end justify-center space-x-4 max-lg:px-4")}>
          {isVoted && sessionInfo.remainingVoteCount > 0 ? (
            <ChizuButton
              buttonSize="MEDIUM"
              buttonStyle="OUTLINED"
              className="!border-gray-100 !text-gray-600"
              icon={<IoShareOutline className="h-[14px] w-[14px]" aria-hidden />}
              onClick={() => setShowVoteDownloadBottomSheet(true)}
            >
              내 투표 공유하기
            </ChizuButton>
          ) : null}
        </div>
      </div>

      <VotingBottomLine
        episodeData={episode}
        voteData={sessionInfo}
        showBottomSheet={showVotingBottomSheet}
        showBottomSheetToggler={setShowVotingBottomSheet}
        voted={selectedVote}
        ticketCount={ticketCount}
        setTicketCount={setTicketCount}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {selectedVote ? (
        <VoteDownloadBottomSheet
          showBottomSheet={showVoteDownloadBottomSheet}
          showBottomSheetToggler={setShowVoteDownloadBottomSheet}
          voted={selectedVote}
          episode={episode}
          seoId={seoId}
        />
      ) : null}

      <VotedModal
        showModal={showVotedModal}
        showModalToggler={setShowVotedModal}
        selectionNumber={userVote?.selectionNumber}
        onShare={() => {
          setShowVotedModal(false);
          setShowVoteDownloadBottomSheet(true);
        }}
      />
    </>
  );
}

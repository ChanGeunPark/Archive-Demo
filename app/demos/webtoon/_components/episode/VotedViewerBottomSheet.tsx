"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import type { EpisodeDetail } from "@/lib/webtoon-demo/types";
import BottomSheet from "../dashboard/ui/BottomSheet";
import EpisodeVotedList from "../series/EpisodeVotedList";

type VotedViewerBottomSheetProps = {
  episodeData: EpisodeDetail;
  showBottomSheet: boolean;
  showBottomSheetToggler: (open: boolean) => void;
};

export default function VotedViewerBottomSheet({
  episodeData,
  showBottomSheet,
  showBottomSheetToggler,
}: VotedViewerBottomSheetProps) {
  const { sortVoteResult, totalSum, winnerIndex } = useMemo(() => {
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
    return { sortVoteResult: voteResult, totalSum: sum, winnerIndex: maxIndex };
  }, [episodeData.voteResult]);

  return (
    <BottomSheet
      showBottomSheet={showBottomSheet}
      showBottomSheetToggler={showBottomSheetToggler}
      title="투표결과"
    >
      <div className="px-4 pt-2">
        <Typography variant="h5" align="center" className="mb-4">
          {episodeData.series.title} {episodeData.episodeIndex}화
        </Typography>
        <EpisodeVotedList
          sortVoteResult={sortVoteResult}
          totalSum={totalSum}
          winnerIndex={winnerIndex}
          showVote
        />
      </div>
    </BottomSheet>
  );
}

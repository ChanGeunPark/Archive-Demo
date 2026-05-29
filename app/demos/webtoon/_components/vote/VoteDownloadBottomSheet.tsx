"use client";

import { useRef } from "react";
import Typography from "@/components/typography/Typography";
import type { EpisodeDetail, VoteCandidate } from "@/lib/webtoon-demo/types";
import BottomSheet from "../dashboard/ui/BottomSheet";
import ChizuButton from "../dashboard/ui/ChizuButton";
import MyVoteImageBox from "./MyVoteImageBox";

type VoteDownloadBottomSheetProps = {
  showBottomSheet: boolean;
  showBottomSheetToggler: (open: boolean) => void;
  voted: VoteCandidate;
  episode: EpisodeDetail;
  seoId: string;
};

export default function VoteDownloadBottomSheet({
  showBottomSheet,
  showBottomSheetToggler,
  voted,
  episode,
  seoId,
}: VoteDownloadBottomSheetProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/demos/webtoon/${seoId}/${episode.episodeIndex}/vote-completed?vote=${voted.selectionNumber}`
      : "";

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    alert("공유 URL이 복사되었습니다.");
  };

  return (
    <BottomSheet
      showBottomSheet={showBottomSheet}
      showBottomSheetToggler={showBottomSheetToggler}
      title="내 투표 공유하기"
    >
      <div className="w-full px-4 py-6">
        <MyVoteImageBox captureRef={captureRef} voted={voted} episode={episode} />
      </div>

      <div className="mx-auto flex max-w-[400px] flex-col gap-2 px-4 pb-4">
        <ChizuButton buttonStyle="OUTLINED" buttonSize="FULL" onClick={copyShareUrl}>
          URL 복사하기
        </ChizuButton>
        <Typography variant="caption" color={500} align="center">
          {shareUrl}
        </Typography>
      </div>
    </BottomSheet>
  );
}

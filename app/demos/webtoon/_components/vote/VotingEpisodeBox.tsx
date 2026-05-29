"use client";

import type { VoteCandidate } from "@/lib/webtoon-demo/types";
import FullPageVoteLayout, { type VotingEpisodeBoxProps } from "./FullPageVoteLayout";
import MinimumPageVoteLayout from "./MinimumPageVoteLayout";

export default function VotingEpisodeBox(props: VotingEpisodeBoxProps) {
  const layoutType = props.voteCandidates[0]?.type ?? "FULL";

  if (layoutType === "MINIMUM") {
    return <MinimumPageVoteLayout {...props} />;
  }

  return <FullPageVoteLayout {...props} />;
}

export type { VoteCandidate };

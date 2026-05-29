import type { VoteCandidate } from "./types";

export const MAX_VOTE_COUNT = 100;
export const CAKE_PER_TICKET = 3;
export const DEFAULT_USER_CAKE = 48;

const voteCandidatesByEpisode: Record<string, VoteCandidate[]> = {
  "ep-8": [
    {
      id: "v8-1",
      selectionNumber: 1,
      title: "민호의 고백",
      voteImage: "/images/webtoon/ep8.jpg",
      voteSum: 1240,
      type: "FULL",
    },
    {
      id: "v8-2",
      selectionNumber: 2,
      title: "서윤의 선택",
      voteImage: "/images/webtoon/ep7.jpg",
      voteSum: 980,
      type: "FULL",
    },
    {
      id: "v8-3",
      selectionNumber: 3,
      title: "별똥별 소원",
      voteImage: "/images/webtoon/ep6.jpg",
      voteSum: 627,
      type: "FULL",
    },
  ],
  "ep-5": [
    {
      id: "v5-1",
      selectionNumber: 1,
      title: "손을 잡는다",
      voteImage: "/images/webtoon/ep5.jpg",
      voteSum: 2100,
      type: "MINIMUM",
      status: "WIN",
    },
    {
      id: "v5-2",
      selectionNumber: 2,
      title: "거리를 둔다",
      voteImage: "/images/webtoon/ep4.jpg",
      voteSum: 890,
      type: "MINIMUM",
      status: "LOSE",
    },
  ],
  "ep-7": [
    {
      id: "v7-1",
      selectionNumber: 1,
      title: "편지를 읽는다",
      voteImage: "/images/webtoon/ep7.jpg",
      voteSum: 1560,
      type: "MINIMUM",
      status: "WIN",
    },
    {
      id: "v7-2",
      selectionNumber: 2,
      title: "편지를 찢는다",
      voteImage: "/images/webtoon/ep6.jpg",
      voteSum: 420,
      type: "MINIMUM",
      status: "LOSE",
    },
  ],
};

export function getVoteCandidates(episodeId: string): VoteCandidate[] {
  const base = voteCandidatesByEpisode[episodeId];
  if (!base) return [];
  return base.map((candidate) => ({ ...candidate }));
}

export function hasActiveVote(episodeId: string): boolean {
  return Boolean(voteCandidatesByEpisode[episodeId]);
}

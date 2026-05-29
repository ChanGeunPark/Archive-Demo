import type {
  BestCommentItem,
  DemoDashboardData,
  VoteHistoryItem,
} from "@/app/demos/webtoon/_components/dashboard/dashboard.types";
import { demoBadgeInfo } from "./mockData";
import type { BadgeInfo } from "./types";

const profilePool = [
  "/images/marketplace/profile/profile_default_180x180_00.jpg",
  "/images/marketplace/profile/profile_default_180x180_01.jpg",
  "/images/marketplace/profile/betidraws-cute-7920120_1920.jpg",
  "/images/marketplace/profile/betidraws-fairy-tale-9502808_1920.jpg",
  "/images/marketplace/profile/mimosaai-ai-generated-8203396_1920.jpg",
  "/images/marketplace/profile/dg-ra-anime-7397617_1920.png",
  "/images/marketplace/profile/arl_dlt-girl-7432855_1920.jpg",
];

export const demoUserVoteHistory: VoteHistoryItem[] = [
  { episode: 1, cake: 3 },
  { episode: 2, cake: 5 },
  { episode: 3, cake: 2 },
  { episode: 4, cake: 8 },
  { episode: 5, cake: 12 },
  { episode: 6, cake: 4 },
  { episode: 7, cake: 9 },
  { episode: 8, cake: 15 },
];

export const demoBestCommentInfo: BestCommentItem[] = [
  {
    commentId: "comment-1",
    episodeIndex: 5,
    content: "손 잡는 장면에서 진짜 심장 멎는 줄...\\n다음 화가 벌써 기다려져요!",
  },
  {
    commentId: "comment-2",
    episodeIndex: 7,
    content: "편지 내용 보고 울었습니다.\\n민호의 진심이 너무 잘 전해졌어요.",
  },
];

export function createDemoDashboardData(
  badgeInfo: BadgeInfo = demoBadgeInfo,
): DemoDashboardData {
  return {
    user: {
      id: "demo-user-1",
      nickname: "별빛독자",
      profileImage: "/images/marketplace/profile/profile_default_180x180_00.jpg",
      level: 12,
      currentExp: 840,
      expPercentage: 68,
    },
    contributionInfo: {
      achievementPoint: 120,
      seriesPoint: 280,
    },
    userVoteHistory: demoUserVoteHistory,
    cakeUseAmount: 58,
    voteInfo: {
      sameChoiceUserProfile: profilePool.slice(0, 8),
      sameChoiceUserNumber: 14,
    },
    activityInfo: {
      likeCount: { lastMonth: 18 },
    },
    likeCount: 28,
    bestCommentInfo: demoBestCommentInfo,
    badgeInfo,
    currentBadges: [
      "FIRST_COMMENT",
      "SUBSCRIBER",
      "CAKE_100",
      "LIKE_LOVER",
      "HARD_VOTER",
    ],
  };
}

export const initialDemoDashboardData = createDemoDashboardData();

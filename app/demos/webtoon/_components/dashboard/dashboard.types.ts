import type { BadgeInfo } from "@/lib/webtoon-demo/types";

export type BadgeType =
  | "FIRST_COMMENT"
  | "LIKE_LOVER"
  | "SUBSCRIBER"
  | "HEAVY_COMMENTER"
  | "CELEBRITY"
  | "HARD_VOTER"
  | "CAKE_100"
  | "CAKE_300"
  | "CAKE_1000";

export type achievementsBadgeType = {
  badgeId: BadgeType;
  name: string;
  fullName: string;
  description: string;
  notReadyDescription: string;
  getCakeCount: number;
};

export const usingCakeTitle = (cake: number) => {
  if (cake === 0) return "뉴비가 나타났다!";
  if (cake < 10) return "치즈케이크학과 새내기";
  if (cake < 25) return "치즈케이크학과 새내기";
  if (cake < 50) return "중요한 건 꺾이지 않는 케이크";
  if (cake < 75) return "싸늘하다... 가슴에 조각이 날아와 꽂힌다";
  if (cake < 100) return "내가 케이크를 사용했던 건 추진력을 얻기 위함이었다!";
  if (cake < 150) return "치즈요? 내가 아는 독자 중에 최고였어요.";
  if (cake < 200) return "이때까지 이런 맛은 없었다. 이것은 치즈인가 케이크인가";
  if (cake < 300) return "케이크 묻고 더블로 가!";
  return "고대 치즈케이크 화석";
};

export const achievementsBadge: achievementsBadgeType[] = [
  {
    badgeId: "FIRST_COMMENT",
    name: "첫 댓글",
    fullName: "첫 댓글 작성!",
    description:
      "댓글로 만들어진 따뜻한 문화 덕분에\\n친구들이 더 기분좋게 하루를 보낼 수 있을거예요.",
    notReadyDescription: "획득방법: \\n 첫 댓글을 작성해주세요.",
    getCakeCount: 1,
  },
  {
    badgeId: "LIKE_LOVER",
    name: "사랑꾼",
    fullName: "사랑꾼",
    description: "50번의 좋아요!\\n당신... 너무 따뜻하다구―☆",
    notReadyDescription: "획득방법: \\n마음에 드는 댓글 혹은 답글에 좋아요 (×50)",
    getCakeCount: 1,
  },
  {
    badgeId: "SUBSCRIBER",
    name: "구독자",
    fullName: "독자독자 구독자",
    description: "작품에 구독을 했어요.\\n누구보다 빠르게 업데이트를 즐겨요!",
    notReadyDescription: "획득방법: \\n작품을 구독해주세요.",
    getCakeCount: 1,
  },
  {
    badgeId: "HEAVY_COMMENTER",
    name: "토론왕",
    fullName: "토론왕",
    description: "당신은 토론왕의 자격이 있습니다.\\n이구역의 토론은 내가 제패한다!",
    notReadyDescription: "획득방법: \\n댓글 또는 답글 작성 (×15)",
    getCakeCount: 3,
  },
  {
    badgeId: "CELEBRITY",
    name: "인기왕",
    fullName: "인기왕",
    description: "나를 좋아하는 사람이 벌써 20명!\\n내 댓글은 사랑받는 중❤︎",
    notReadyDescription: "획득방법: \\n내 댓글 또는 답글에 좋아요 받기 (×20)",
    getCakeCount: 3,
  },
  {
    badgeId: "HARD_VOTER",
    name: "성실왕",
    fullName: "성실한 투표왕",
    description: "연속 5회차 투표를 했어요.\\n투표를 즐길 줄 아시는군요!",
    notReadyDescription: "획득방법: \\n빼먹지 않고 5회차를 연속으로 투표",
    getCakeCount: 3,
  },
  {
    badgeId: "CAKE_100",
    name: "모범시민",
    fullName: "이세계의 모범시민",
    description: "100조각을 투표했어요!\\n이세계의 민주주의, 당신이 지켰어...",
    notReadyDescription: "획득방법: \\n누적 100케이크를 투표에 사용",
    getCakeCount: 5,
  },
  {
    badgeId: "CAKE_300",
    name: "역사적 존재",
    fullName: "역사적 존재",
    description: "300조각을 투표했어요!\\n이 세계의 역사는 내가 썼다구―☆",
    notReadyDescription: "획득방법: \\n누적 300케이크를 투표에 사용",
    getCakeCount: 7,
  },
  {
    badgeId: "CAKE_1000",
    name: "신",
    fullName: "신",
    description: "1000조각을 투표했어요!\\n당이 떨어진 당신은 이제 신",
    notReadyDescription: "획득방법: \\n누적 1000케이크를 투표에 사용",
    getCakeCount: 9,
  },
];

export type DemoDashboardUser = {
  id: string;
  nickname: string;
  profileImage: string;
  level: number;
  currentExp: number;
  expPercentage: number;
};

export type VoteHistoryItem = {
  episode: number;
  cake: number;
};

export type BestCommentItem = {
  commentId: string;
  episodeIndex: number;
  content: string;
};

export type DemoDashboardData = {
  user: DemoDashboardUser;
  contributionInfo: {
    achievementPoint: number;
    seriesPoint: number;
  };
  userVoteHistory: VoteHistoryItem[];
  cakeUseAmount: number;
  voteInfo: {
    sameChoiceUserProfile: string[];
    sameChoiceUserNumber: number;
  };
  activityInfo: {
    likeCount: { lastMonth: number };
  };
  likeCount: number;
  bestCommentInfo: BestCommentItem[];
  badgeInfo: BadgeInfo;
  currentBadges: BadgeType[];
};

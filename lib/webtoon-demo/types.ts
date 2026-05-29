export type SeriesStatus = "ONGOING" | "PAUSED" | "ENDED" | "COMINGSOON";

export type IntervalType =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type SeriesGenre =
  | "ROMANCE"
  | "FANTASY"
  | "ACTION"
  | "COMEDY"
  | "THRILLER"
  | "DAILY";

export type CensorshipType = "ALL" | "15" | "19";

export type EpisodeType = "SELECTABLE" | "ORDINARY";

export type SeriesNotificationType = "ALL" | "SERIES" | "SERIALIZATION";

export type BadgeStatus = "READY" | "RECEIVED" | "LOCKED";

export interface Author {
  id: string;
  name: string;
  bio?: string;
}

export interface VoteOption {
  selectionNumber: number;
  title: string;
  voteSum: number;
}

export interface Episode {
  id: string;
  title: string;
  episodeIndex: number;
  thumbnailImages: string;
  beginAt: string;
  episodeType: EpisodeType;
  voteExpireAt?: string;
  voteResult?: VoteOption[];
  voterCount?: number;
  likeCount?: number;
  contentImageCount?: number;
  contentImages?: string[];
  authorComment?: string;
  commentCount?: number;
}

export type CommentFilterType = "POPULAR" | "VOTER" | "ALL";

export interface CommentUser {
  id: string;
  nickname: string;
  profileImage?: string;
}

export interface Comment {
  id: string;
  content: string;
  config?: string;
  user: CommentUser;
  voteSelection?: number;
  bestRank?: number;
  likeCount: number;
  likedByMe?: boolean;
  childCommentCount: number;
  parentCommentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TabMenu = "EPISODE" | "DASHBOARD" | "INFO" | "NOTICE";

export type VoteType = "FULL" | "MINIMUM";

export type VoteStatusType = "WIN" | "LOSE" | "DRAW" | "PENDING";

export interface VoteCandidate {
  id: string;
  selectionNumber: number;
  title: string;
  content?: string;
  voteImage: string;
  voteSum: number;
  type: VoteType;
  status?: VoteStatusType;
}

export interface UserVote {
  voteId: string;
  selectionNumber: number;
}

export interface VoteSessionInfo {
  remainingVoteCount: number;
  userCakeCount: number;
  seriesCakePrice: number;
}

export interface EpisodeDetail extends Episode {
  series: Series;
  voteCandidates?: VoteCandidate[];
  maxVoteCount?: number;
}

export interface SeriesNotification {
  id: string;
  type?: SeriesNotificationType;
  title?: string;
  content?: string;
  beginAt?: string;
  updatedAt?: string;
  isRecent?: boolean;
}

export interface VoteBannerSeries {
  id: string;
  seoId: string;
  title: string;
  thumbnailImages: string;
  currentVoteExpireAt: string;
  currentEpisodeIndex: number;
  genre: SeriesGenre[];
}

export interface Series {
  id: string;
  title: string;
  seoId: string;
  description: string;
  shortDescription?: string;
  bannerImage: string;
  thumbnailImages: string;
  cakePrice: number;
  totalIPCount: number;
  authors: Author[];
  authorsRole: string;
  genre: SeriesGenre[];
  censorship: CensorshipType;
  tagString?: string;
  intervalType: IntervalType[];
  episodeCount: number;
  currentEpisodeIndex?: number;
  currentVoteExpireAt?: string;
  status: SeriesStatus;
  voterCount?: number;
  likeCount?: number;
  subscriptionCount?: number;
  beginAt?: string;
}

export interface BadgeInfo {
  FIRST_COMMENT?: BadgeStatus;
  LIKE_LOVER?: BadgeStatus;
  SUBSCRIBER?: BadgeStatus;
  HEAVY_COMMENTER?: BadgeStatus;
  CELEBRITY?: BadgeStatus;
  HARD_VOTER?: BadgeStatus;
  CAKE_100?: BadgeStatus;
  CAKE_300?: BadgeStatus;
  CAKE_1000?: BadgeStatus;
  freeCakeCount?: number;
}

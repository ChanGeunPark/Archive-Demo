import type {
  BadgeInfo,
  Episode,
  Series,
  SeriesNotification,
  VoteBannerSeries,
} from "./types";

const BANNER = "/images/webtoon/banner.jpg";
const THUMB = "/images/webtoon/thumb.jpg";
const VOTE_BANNER = "/images/webtoon/vote-banner.jpg";

export const demoSeries: Series = {
  id: "series-demo-001",
  title: "별빛 아래, 우리",
  seoId: "starlight-us",
  description:
    "밤하늘을 좋아하는 대학생 '서윤'은 우연히 옥상에서 만난 남자 '민호'와 별자리 이야기를 나누게 된다.\\n\\n서로 다른 꿈을 향해 달려가던 두 사람은 매주 금요일 밤, 같은 옥상에서 만나며 점점 가까워진다.\\n하지만 민호에게는 서윤에게 말하지 못한 비밀이 있고, 서윤 또한 숨겨둔 과거가 있다.\\n\\n별빛 아래에서 시작된 우연한 만남이, 두 사람의 인생을 바꿔놓기 시작한다.",
  shortDescription: "밤하늘 아래에서 시작된 로맨스",
  bannerImage: BANNER,
  thumbnailImages: JSON.stringify({
    default: THUMB,
    voteBanner: VOTE_BANNER,
  }),
  cakePrice: 3,
  totalIPCount: 12,
  authors: [
    {
      id: "author-1",
      name: "김하늘",
      bio: "로맨스와 일상 장르를 주로 그립니다.\\n'별빛 아래, 우리'는 대학생 시절의 추억에서 영감을 받아 시작한 작품입니다.",
    },
    {
      id: "author-2",
      name: "이달",
      bio: "캐릭터 디자인과 배경 작화를 담당합니다.\\n밤하늘과 도시의 분위기를 표현하는 것을 좋아합니다.",
    },
  ],
  authorsRole: JSON.stringify({
    글: ["김하늘"],
    그림: ["이달"],
  }),
  genre: ["ROMANCE", "DAILY"],
  censorship: "15",
  tagString: "#로맨스 #대학생 #밤하늘 #투표형",
  intervalType: ["FRIDAY"],
  episodeCount: 8,
  currentEpisodeIndex: 8,
  currentVoteExpireAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
  status: "ONGOING",
  voterCount: 2847,
  likeCount: 12500,
  subscriptionCount: 8934,
  beginAt: "2024-03-15T00:00:00.000Z",
};

export const demoEpisodes: Episode[] = [
  {
    id: "ep-8",
    title: "8화 - 별빛 아래 약속",
    episodeIndex: 8,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep8.jpg" }),
    beginAt: "2025-05-23T12:00:00.000Z",
    episodeType: "SELECTABLE",
    voteExpireAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    voteResult: [
      { selectionNumber: 1, title: "민호의 고백", voteSum: 1240 },
      { selectionNumber: 2, title: "서윤의 선택", voteSum: 980 },
      { selectionNumber: 3, title: "별똥별 소원", voteSum: 627 },
    ],
    voterCount: 2847,
    likeCount: 892,
  },
  {
    id: "ep-7",
    title: "7화 - 숨겨진 편지",
    episodeIndex: 7,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep7.jpg" }),
    beginAt: "2025-05-16T12:00:00.000Z",
    episodeType: "SELECTABLE",
    voteExpireAt: "2025-05-22T12:00:00.000Z",
    voteResult: [
      { selectionNumber: 1, title: "편지를 읽는다", voteSum: 1560 },
      { selectionNumber: 2, title: "편지를 찢는다", voteSum: 420 },
    ],
    voterCount: 1980,
    likeCount: 756,
  },
  {
    id: "ep-6",
    title: "6화 - 비 오는 금요일",
    episodeIndex: 6,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep6.jpg" }),
    beginAt: "2025-05-09T12:00:00.000Z",
    episodeType: "ORDINARY",
    likeCount: 634,
  },
  {
    id: "ep-5",
    title: "5화 - 첫 번째 투표",
    episodeIndex: 5,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep5.jpg" }),
    beginAt: "2025-05-02T12:00:00.000Z",
    episodeType: "SELECTABLE",
    voteExpireAt: "2025-05-08T12:00:00.000Z",
    voteResult: [
      { selectionNumber: 1, title: "손을 잡는다", voteSum: 2100 },
      { selectionNumber: 2, title: "거리를 둔다", voteSum: 890 },
    ],
    voterCount: 2990,
    likeCount: 1102,
  },
  {
    id: "ep-4",
    title: "4화 - 옥상의 비밀",
    episodeIndex: 4,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep4.jpg" }),
    beginAt: "2025-04-25T12:00:00.000Z",
    episodeType: "ORDINARY",
    likeCount: 521,
  },
  {
    id: "ep-3",
    title: "3화 - 별자리 지도",
    episodeIndex: 3,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep3.jpg" }),
    beginAt: "2025-04-18T12:00:00.000Z",
    episodeType: "ORDINARY",
    likeCount: 489,
  },
  {
    id: "ep-2",
    title: "2화 - 두 번째 만남",
    episodeIndex: 2,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep2.jpg" }),
    beginAt: "2025-04-11T12:00:00.000Z",
    episodeType: "ORDINARY",
    likeCount: 412,
  },
  {
    id: "ep-1",
    title: "1화 - 우연한 시작",
    episodeIndex: 1,
    thumbnailImages: JSON.stringify({ default: "/images/webtoon/ep1.jpg" }),
    beginAt: "2025-04-04T12:00:00.000Z",
    episodeType: "ORDINARY",
    likeCount: 380,
  },
];

export const demoNotifications: SeriesNotification[] = [
  {
    id: "notice-1",
    type: "SERIALIZATION",
    title: "8화 업데이트 및 투표 안내",
    content:
      "안녕하세요, '별빛 아래, 우리' 제작팀입니다.\\n\\n8화가 업데이트되었습니다. 이번 화에서는 민호와 서윤의 관계에 중요한 전환점이 찾아옵니다.\\n\\n투표는 5월 30일(금) 자정까지 진행됩니다. 여러분의 선택이 다음 화의 전개를 결정합니다!",
    beginAt: "2025-05-23T12:00:00.000Z",
    updatedAt: "2025-05-23T12:00:00.000Z",
    isRecent: true,
  },
  {
    id: "notice-2",
    type: "SERIES",
    title: "굿즈 출시 안내",
    content:
      "시리즈 1주년을 기념하여 한정판 굿즈를 출시합니다.\\n\\n- 별빛 아크릴 스탠드\\n- 캐릭터 엽서 세트\\n- 옥상 일러스트 포스터\\n\\n자세한 내용은 공식 스토어에서 확인해 주세요.",
    beginAt: "2025-05-10T09:00:00.000Z",
    updatedAt: "2025-05-10T09:00:00.000Z",
    isRecent: false,
  },
  {
    id: "notice-3",
    type: "ALL",
    title: "서비스 점검 안내",
    content:
      "5월 1일 새벽 2시~4시 서비스 점검이 예정되어 있습니다.\\n점검 시간 동안 일부 기능 이용이 제한될 수 있습니다.",
    beginAt: "2025-04-28T09:00:00.000Z",
    updatedAt: "2025-04-28T09:00:00.000Z",
    isRecent: false,
  },
];

export const demoHasRecentNotice = demoNotifications.some((notice) => notice.isRecent);

export const demoVoteBanners: VoteBannerSeries[] = [
  {
    id: demoSeries.id,
    seoId: demoSeries.seoId,
    title: demoSeries.title,
    thumbnailImages: demoSeries.thumbnailImages,
    currentVoteExpireAt: demoSeries.currentVoteExpireAt!,
    currentEpisodeIndex: demoSeries.currentEpisodeIndex!,
    genre: demoSeries.genre,
  },
];

export const demoBadgeInfo: BadgeInfo = {
  SUBSCRIBER: "RECEIVED",
  LIKE_LOVER: "READY",
  HARD_VOTER: "READY",
  FIRST_COMMENT: "RECEIVED",
  HEAVY_COMMENTER: "LOCKED",
  CELEBRITY: "LOCKED",
  CAKE_100: "RECEIVED",
  CAKE_300: "LOCKED",
  CAKE_1000: "LOCKED",
  freeCakeCount: 2,
};

export const demoHasReadyBadge = Object.values(demoBadgeInfo).some(
  (item) => item === "READY",
);

export const demoViewedEpisodeIds = new Set(["ep-8", "ep-7", "ep-6", "ep-5"]);

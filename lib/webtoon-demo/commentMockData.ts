import type { Comment, CommentFilterType } from "./types";
import { DEMO_USER } from "./coreStaticData";

const baseComments: Record<string, Comment[]> = {
  "ep-8": [
    {
      id: "c-8-1",
      content: "민호 고백 장면 진짜 심장 터질 뻔... 다음 화 너무 기대돼요!",
      user: { id: "u-1", nickname: "별빛러버", profileImage: "/images/character/like_character1.png" },
      voteSelection: 1,
      likeCount: 89,
      childCommentCount: 2,
      createdAt: "2025-05-24T10:30:00.000Z",
    },
    {
      id: "c-8-2",
      content: " ",
      config: JSON.stringify({ emoji: "chizu_emoji_3" }),
      user: { id: "u-2", nickname: "투표왕", profileImage: "/images/character/like_character5.png" },
      voteSelection: 2,
      likeCount: 56,
      childCommentCount: 0,
      createdAt: "2025-05-24T11:00:00.000Z",
    },
    {
      id: "c-8-3",
      content: "서윤이 선택하는 장면에서 눈물 났어요 ㅠㅠ",
      user: { id: "u-3", nickname: "감성충", profileImage: "/images/character/like_character7.png" },
      voteSelection: 2,
      likeCount: 42,
      childCommentCount: 1,
      createdAt: "2025-05-24T12:15:00.000Z",
    },
    {
      id: "c-8-4",
      content: "별똥별 소원 선택지 너무 로맨틱한데요?",
      user: { id: "u-4", nickname: "옥상지기", profileImage: "/images/character/like_character9.png" },
      voteSelection: 3,
      likeCount: 31,
      childCommentCount: 0,
      createdAt: "2025-05-24T14:00:00.000Z",
    },
  ],
  "ep-7": [
    {
      id: "c-7-1",
      content: "편지 읽는 장면 연출 미쳤다... 작가님 천재",
      user: { id: "u-5", nickname: "편지러버", profileImage: "/images/character/like_character2.png" },
      voteSelection: 1,
      likeCount: 72,
      childCommentCount: 1,
      createdAt: "2025-05-17T09:00:00.000Z",
    },
    {
      id: "c-7-2",
      content: "편지 찢는 선택지도 궁금했는데 다행히 읽었네요",
      user: { id: "u-6", nickname: "호기심많은", profileImage: "/images/character/like_character4.png" },
      voteSelection: 1,
      likeCount: 45,
      childCommentCount: 0,
      createdAt: "2025-05-17T10:30:00.000Z",
    },
  ],
  "ep-5": [
    {
      id: "c-5-1",
      content: "첫 투표 회차라 긴장하면서 봤는데 손 잡는 선택지 GO!",
      user: { id: "u-7", nickname: "투표첫회", profileImage: "/images/character/like_character6.png" },
      voteSelection: 1,
      likeCount: 95,
      childCommentCount: 3,
      createdAt: "2025-05-03T08:00:00.000Z",
    },
    {
      id: "c-5-2",
      content: " ",
      config: JSON.stringify({ emoji: "chizu_emoji_1" }),
      user: { id: "u-8", nickname: "이모지마스터", profileImage: "/images/character/like_character8.png" },
      voteSelection: 1,
      likeCount: 68,
      childCommentCount: 0,
      createdAt: "2025-05-03T09:30:00.000Z",
    },
  ],
};

const replyComments: Record<string, Comment[]> = {
  "c-8-1": [
    {
      id: "r-8-1-1",
      content: "저도 1번 선택했어요! 민호 화이팅",
      user: { id: "u-10", nickname: "1번파", profileImage: "/images/character/like_character10.png" },
      likeCount: 12,
      childCommentCount: 0,
      parentCommentId: "c-8-1",
      createdAt: "2025-05-24T10:45:00.000Z",
    },
    {
      id: "r-8-1-2",
      content: "다음 화까지 어떻게 기다려 ㅠㅠ",
      user: DEMO_USER,
      likeCount: 8,
      likedByMe: true,
      childCommentCount: 0,
      parentCommentId: "c-8-1",
      createdAt: "2025-05-24T11:00:00.000Z",
    },
  ],
  "c-8-3": [
    {
      id: "r-8-3-1",
      content: "저도요 ㅠㅠ 작가님 감정선 표현 대박",
      user: { id: "u-11", nickname: "감동받음", profileImage: "/images/character/like_character11.png" },
      likeCount: 5,
      childCommentCount: 0,
      parentCommentId: "c-8-3",
      createdAt: "2025-05-24T12:30:00.000Z",
    },
  ],
  "c-7-1": [
    {
      id: "r-7-1-1",
      content: "진짜 연출 레전드...",
      user: { id: "u-12", nickname: "연출덕후", profileImage: "/images/character/like_character2.png" },
      likeCount: 15,
      childCommentCount: 0,
      parentCommentId: "c-7-1",
      createdAt: "2025-05-17T09:30:00.000Z",
    },
  ],
  "c-5-1": [
    {
      id: "r-5-1-1",
      content: "손 잡기 2100표 ㄷㄷ",
      user: { id: "u-13", nickname: "통계왕", profileImage: "/images/character/like_character4.png" },
      likeCount: 22,
      childCommentCount: 0,
      parentCommentId: "c-5-1",
      createdAt: "2025-05-03T08:30:00.000Z",
    },
    {
      id: "r-5-1-2",
      content: "저는 거리 두기 선택했는데 후회 중...",
      user: { id: "u-14", nickname: "후회많은", profileImage: "/images/character/like_character6.png" },
      likeCount: 18,
      childCommentCount: 0,
      parentCommentId: "c-5-1",
      createdAt: "2025-05-03T09:00:00.000Z",
    },
    {
      id: "r-5-1-3",
      content: "다음 투표도 기대!",
      user: DEMO_USER,
      likeCount: 10,
      likedByMe: true,
      childCommentCount: 0,
      parentCommentId: "c-5-1",
      createdAt: "2025-05-03T09:15:00.000Z",
    },
  ],
};

export function getCommentsByFilter(
  episodeId: string,
  filter: CommentFilterType,
): Comment[] {
  const comments = [...(baseComments[episodeId] ?? [])];

  if (filter === "VOTER") {
    return comments.filter((comment) => comment.voteSelection);
  }

  if (filter === "POPULAR") {
    return [...comments].sort((a, b) => b.likeCount - a.likeCount);
  }

  return comments;
}

export function getReplies(parentCommentId: string): Comment[] {
  return [...(replyComments[parentCommentId] ?? [])];
}

export function createComment(input: {
  episodeId: string;
  content: string;
  parentCommentId?: string;
  emojiNumber?: number | null;
}): Comment {
  const emoji =
    input.emojiNumber != null
      ? `chizu_emoji_${input.emojiNumber}`
      : undefined;

  return {
    id: `c-new-${Date.now()}`,
    content: emoji && input.content.trim() === "" ? " " : input.content,
    config: emoji ? JSON.stringify({ emoji }) : undefined,
    user: DEMO_USER,
    likeCount: 0,
    likedByMe: false,
    childCommentCount: 0,
    parentCommentId: input.parentCommentId,
    createdAt: new Date().toISOString(),
  };
}

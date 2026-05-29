import {
  demoEpisodes,
  demoSeries,
  demoViewedEpisodeIds,
} from "./mockData";
import { getVoteCandidates } from "./voteMockData";
import type { Episode, EpisodeDetail } from "./types";

export function parseThumbnail(imageStr: string): string {
  try {
    const parsed = JSON.parse(imageStr) as { default?: string };
    return parsed.default ?? "/images/webtoon/thumb.jpg";
  } catch {
    return "/images/webtoon/thumb.jpg";
  }
}

function buildContentImages(episodeIndex: number): string[] {
  const baseIndex = ((episodeIndex - 1) % 12) + 1;
  const count = 3 + (episodeIndex % 3);
  return Array.from({ length: count }, (_, i) => {
    const mockIndex = ((baseIndex + i - 1) % 12) + 1;
    return `/images/mock/moc${mockIndex}.jpg`;
  });
}

export function getEpisodeDetail(
  seoId: string,
  episodeIndex: number,
): EpisodeDetail | null {
  if (seoId !== demoSeries.seoId) return null;

  const episode = demoEpisodes.find((item) => item.episodeIndex === episodeIndex);
  if (!episode) return null;

  const contentImages = buildContentImages(episodeIndex);

  return {
    ...episode,
    contentImageCount: contentImages.length,
    contentImages,
    authorComment: getAuthorComment(episodeIndex),
    commentCount: getCommentCount(episode.id),
    voteCandidates: getVoteCandidates(episode.id),
    maxVoteCount: 100,
    series: demoSeries,
  };
}

function getAuthorComment(episodeIndex: number): string {
  const comments: Record<number, string> = {
    1: "첫 만남 장면을 그리면서 저도 설레는 마음으로 작업했어요.\\n여러분은 어떤 장면이 가장 기억에 남으셨나요?",
    5: "드디어 첫 투표 회차입니다!\\n여러분의 선택이 이야기의 방향을 바꿉니다.",
    7: "7화는 감정선이 가장 깊은 회차 중 하나예요.\\n편지 장면에 많은 공을 들였습니다.",
    8: "8화 투표 마감 전까지 많은 참여 부탁드려요!\\n민호와 서윤, 누구의 선택이 이길까요?",
  };
  return comments[episodeIndex] ?? "재미있게 봐주셔서 감사합니다!";
}

function getCommentCount(episodeId: string): number {
  const counts: Record<string, number> = {
    "ep-8": 47,
    "ep-7": 38,
    "ep-5": 52,
    "ep-6": 21,
    "ep-4": 15,
    "ep-3": 12,
    "ep-2": 9,
    "ep-1": 6,
  };
  return counts[episodeId] ?? 0;
}

export function getPublishedEpisodes(): Episode[] {
  return demoEpisodes.filter(
    (episode) => new Date(episode.beginAt).getTime() <= Date.now(),
  );
}

export { demoViewedEpisodeIds };

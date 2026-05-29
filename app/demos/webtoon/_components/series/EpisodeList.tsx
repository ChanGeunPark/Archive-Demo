"use client";

import { useRouter } from "next/navigation";
import Typography from "@/components/typography/Typography";
import { demoSeries } from "@/lib/webtoon-demo/mockData";
import type { Episode } from "@/lib/webtoon-demo/types";
import EpisodeListItem from "./EpisodeListItem";

type EpisodeListProps = {
  episodes: Episode[];
  viewedEpisodeIds: Set<string>;
};

export default function EpisodeList({ episodes, viewedEpisodeIds }: EpisodeListProps) {
  const router = useRouter();
  const latestViewed = episodes.find((ep) => viewedEpisodeIds.has(ep.id));

  const goToEpisode = (episode: Episode) => {
    router.push(`/demos/webtoon/${demoSeries.seoId}/${episode.episodeIndex}`);
  };

  return (
    <div className="mb-10 flex-1">
      {latestViewed ? (
        <button
          type="button"
          className="mb-4 w-full rounded-xl border border-primaryMain/30 bg-primaryMain/10 px-4 py-3 text-left"
          onClick={() => goToEpisode(latestViewed)}
        >
          <Typography variant="caption" color={600}>
            이어보기
          </Typography>
          <Typography variant="body2" weight={600}>
            {latestViewed.title}
          </Typography>
        </button>
      ) : null}

      {episodes.map((episode) => (
        <EpisodeListItem
          key={episode.id}
          episode={episode}
          isViewed={viewedEpisodeIds.has(episode.id)}
          onClick={() => goToEpisode(episode)}
        />
      ))}
    </div>
  );
}

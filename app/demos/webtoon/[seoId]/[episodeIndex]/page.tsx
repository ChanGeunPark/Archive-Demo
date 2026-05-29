import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EpisodeDetailClient from "../../_components/episode/EpisodeDetailClient";
import { getEpisodeDetail } from "@/lib/webtoon-demo/episodeHelpers";
import { buildPageMetadata } from "@/lib/seo";

type EpisodePageProps = {
  params: Promise<{ seoId: string; episodeIndex: string }>;
};

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const { seoId, episodeIndex } = await params;
  const episode = getEpisodeDetail(seoId, Number(episodeIndex));

  if (!episode) {
    return buildPageMetadata({
      title: "에피소드를 찾을 수 없습니다",
      path: `/demos/webtoon/${seoId}/${episodeIndex}`,
    });
  }

  return buildPageMetadata({
    title: `${episode.series.title} ${episode.title}`,
    description: episode.authorComment ?? "CHIZU COMICS 웹툰 데모 에피소드",
    path: `/demos/webtoon/${seoId}/${episodeIndex}`,
  });
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { seoId, episodeIndex } = await params;
  const episode = getEpisodeDetail(seoId, Number(episodeIndex));

  if (!episode) notFound();

  return <EpisodeDetailClient seoId={seoId} episodeData={episode} />;
}

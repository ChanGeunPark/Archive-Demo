import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommentsClient from "../../../_components/comment/CommentsClient";
import { getEpisodeDetail } from "@/lib/webtoon-demo/episodeHelpers";
import { buildPageMetadata } from "@/lib/seo";

type CommentsPageProps = {
  params: Promise<{ seoId: string; episodeIndex: string }>;
};

export async function generateMetadata({ params }: CommentsPageProps): Promise<Metadata> {
  const { seoId, episodeIndex } = await params;
  const episode = getEpisodeDetail(seoId, Number(episodeIndex));

  if (!episode) {
    return buildPageMetadata({
      title: "댓글",
      path: `/demos/webtoon/${seoId}/${episodeIndex}/comments`,
    });
  }

  return buildPageMetadata({
    title: `${episode.series.title} ${episode.title} 댓글`,
    description: "에피소드 댓글 페이지",
    path: `/demos/webtoon/${seoId}/${episodeIndex}/comments`,
  });
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { seoId, episodeIndex } = await params;
  const episode = getEpisodeDetail(seoId, Number(episodeIndex));

  if (!episode) notFound();

  return (
    <div className="min-h-screen bg-white">
      <CommentsClient seoId={seoId} episodeData={episode} />
    </div>
  );
}

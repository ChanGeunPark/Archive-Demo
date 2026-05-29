import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEpisodeDetail } from "@/lib/webtoon-demo/episodeHelpers";
import VoteCompletedClient from "./VoteCompletedClient";

type VoteCompletedPageProps = {
  params: Promise<{ seoId: string; episodeIndex: string }>;
};

export default async function VoteCompletedPage({ params }: VoteCompletedPageProps) {
  const { seoId, episodeIndex } = await params;
  const episode = getEpisodeDetail(seoId, Number(episodeIndex));

  if (!episode) notFound();

  return (
    <Suspense fallback={null}>
      <VoteCompletedClient seoId={seoId} episodeIndex={Number(episodeIndex)} />
    </Suspense>
  );
}

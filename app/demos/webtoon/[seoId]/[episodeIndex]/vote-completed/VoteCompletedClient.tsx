"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Typography from "@/components/typography/Typography";
import ChizuButton from "@/app/demos/webtoon/_components/dashboard/ui/ChizuButton";
import MyVoteImageBox from "@/app/demos/webtoon/_components/vote/MyVoteImageBox";
import { getEpisodeDetail } from "@/lib/webtoon-demo/episodeHelpers";

type VoteCompletedClientProps = {
  seoId: string;
  episodeIndex: number;
};

export default function VoteCompletedClient({
  seoId,
  episodeIndex,
}: VoteCompletedClientProps) {
  const searchParams = useSearchParams();
  const voteSelection = Number(searchParams.get("vote") ?? "1");
  const episode = getEpisodeDetail(seoId, episodeIndex);
  const voted = episode?.voteCandidates?.find(
    (candidate) => candidate.selectionNumber === voteSelection,
  );

  if (!episode || !voted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Typography variant="body1">투표 정보를 찾을 수 없습니다.</Typography>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-25 px-4 py-10">
      <Typography variant="h3" className="mb-6">
        투표 완료!
      </Typography>
      <MyVoteImageBox voted={voted} episode={episode} />
      <div className="mt-8 flex w-full max-w-[320px] flex-col gap-2">
        <Link href={`/demos/webtoon/${seoId}/${episodeIndex}`}>
          <ChizuButton buttonStyle="PRIMARY" buttonSize="FULL" className="w-full">
            다시 보러가기
          </ChizuButton>
        </Link>
        <Link href="/demos/webtoon" className="text-center text-sm text-gray-500">
          시리즈 홈으로
        </Link>
      </div>
    </div>
  );
}

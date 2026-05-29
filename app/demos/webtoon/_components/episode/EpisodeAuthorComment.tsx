"use client";

import type { RefObject } from "react";
import Typography from "@/components/typography/Typography";
import { formatAuthors } from "@/lib/webtoon-demo/formatters";
import { enterTextFormatter } from "@/lib/webtoon-demo/formatters";
import type { EpisodeDetail } from "@/lib/webtoon-demo/types";

type EpisodeAuthorCommentProps = {
  episode: EpisodeDetail;
  finishRef: RefObject<HTMLDivElement | null>;
};

export default function EpisodeAuthorComment({
  episode,
  finishRef,
}: EpisodeAuthorCommentProps) {
  const authorRoles = formatAuthors(episode.series.authorsRole);

  return (
    <div ref={finishRef} className="relative mx-auto w-full max-w-[620px] px-3 lg:px-0">
      <div className="flex items-center justify-between p-4">
        {authorRoles.map((role, index) => (
          <div className="my-2 flex" key={index}>
            <Typography variant="body3" color={400}>
              {Object.keys(role)[0]}
            </Typography>
            <Typography variant="body2" weight={600} className="ml-2">
              {Array.isArray(role.value) ? role.value.join(", ") : String(role.value)}
            </Typography>
          </div>
        ))}
      </div>

      {episode.authorComment ? (
        <div className="mx-4 border-t border-gray-100 py-4">
          <Typography variant="body3" color={600}>
            {episode.title}
            <span className="ml-2 font-normal">작가 한마디</span>
          </Typography>
          <Typography variant="body2" weight={500} className="mt-2 whitespace-pre-line">
            {enterTextFormatter(episode.authorComment)}
          </Typography>
        </div>
      ) : null}
    </div>
  );
}

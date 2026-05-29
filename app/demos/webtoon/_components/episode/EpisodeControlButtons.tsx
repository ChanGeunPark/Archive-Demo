"use client";

import { useRouter } from "next/navigation";
import ArrowLeftIcon from "@/components/icons/arrow/ArrowLeftIcon";
import ArrowRightIcon from "@/components/icons/arrow/ArrowRightIcon";
import { cls } from "@/lib/client/utils";
import type { Episode, EpisodeDetail } from "@/lib/webtoon-demo/types";
import { IoMenu } from "react-icons/io5";

type EpisodeControlButtonsProps = {
  seoId: string;
  episodeData: EpisodeDetail;
  episodeList: Episode[];
  showEpisodeListDropDown: boolean;
  setShowEpisodeListDropDown: (open: boolean) => void;
};

export default function EpisodeControlButtons({
  seoId,
  episodeData,
  episodeList,
  showEpisodeListDropDown,
  setShowEpisodeListDropDown,
}: EpisodeControlButtonsProps) {
  const router = useRouter();

  const episodeIndex = episodeData.episodeIndex;
  const publishedEpisodes = episodeList.filter(
    (episode) => new Date(episode.beginAt).getTime() <= Date.now(),
  );
  const episodeTotalCount = publishedEpisodes.length;
  const minIndex = 1;

  return (
    <div className="flex flex-1 items-center justify-end">
      <div
        className={cls(
          "flex transition-opacity duration-300",
          showEpisodeListDropDown ? "opacity-0" : "opacity-100",
        )}
      >
        <button
          type="button"
          className={cls(
            "flex flex-col items-center justify-center rounded-xl px-4 py-2",
            episodeIndex === minIndex ? "cursor-default opacity-20" : "opacity-100 hover:bg-gray-50",
          )}
          onClick={() => {
            if (episodeIndex > minIndex) {
              router.push(`/demos/webtoon/${seoId}/${episodeIndex - 1}`);
            }
          }}
        >
          <ArrowLeftIcon className="mb-[2px] h-5 w-5 fill-gray-500" />
          <p className="caption-500 text-gray-500">이전</p>
        </button>

        <button
          type="button"
          className="mx-2 flex cursor-pointer flex-col items-center justify-center rounded-xl px-4 py-2 hover:bg-gray-50"
          onClick={() => setShowEpisodeListDropDown(!showEpisodeListDropDown)}
        >
          <IoMenu className="mb-[2px] h-5 w-5 text-gray-500" aria-hidden />
          <p className="caption-500 text-gray-500">회차</p>
        </button>
      </div>

      <button
        type="button"
        className={cls(
          "flex flex-col items-center justify-center rounded-xl px-4 py-2",
          showEpisodeListDropDown ? "!opacity-0" : "opacity-100",
          episodeIndex >= episodeTotalCount
            ? "cursor-default opacity-20"
            : "opacity-100 hover:bg-gray-50",
        )}
        onClick={() => {
          if (episodeIndex < episodeTotalCount) {
            router.push(`/demos/webtoon/${seoId}/${episodeIndex + 1}`);
          }
        }}
      >
        <ArrowRightIcon className="mb-[2px] h-5 w-5 fill-gray-900" />
        <p className="caption-500 text-gray-900">다음</p>
      </button>
    </div>
  );
}

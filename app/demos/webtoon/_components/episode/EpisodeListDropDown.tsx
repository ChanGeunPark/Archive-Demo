"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cls } from "@/lib/client/utils";
import { dateFormatting } from "@/lib/webtoon-demo/formatters";
import { parseThumbnail } from "@/lib/webtoon-demo/episodeHelpers";
import type { Episode } from "@/lib/webtoon-demo/types";
import { IoClose } from "react-icons/io5";
import Typography from "@/components/typography/Typography";

type EpisodeListDropDownProps = {
  seoId: string;
  episodeList: Episode[];
  viewedEpisodeIds: Set<string>;
  showEpisodeListDropDown: boolean;
  setShowEpisodeListDropDown: (open: boolean) => void;
};

export default function EpisodeListDropDown({
  seoId,
  episodeList,
  viewedEpisodeIds,
  showEpisodeListDropDown,
  setShowEpisodeListDropDown,
}: EpisodeListDropDownProps) {
  const router = useRouter();

  if (!showEpisodeListDropDown) return null;

  const routeEpisode = (episodeIndex: number) => {
    setShowEpisodeListDropDown(false);
    router.push(`/demos/webtoon/${seoId}/${episodeIndex}`);
  };

  return (
    <div
      className={cls(
        "absolute bottom-0 right-0 z-[51] max-h-[calc(90vh-80px)] w-[190px] overflow-y-auto rounded-xl",
        "bg-[rgba(255,255,255,0.9)] backdrop-blur-md",
      )}
    >
      <ul className="relative w-[190px] max-w-[190px] pt-2 shadow-lg">
        {episodeList.map((item) => {
          const isViewed = viewedEpisodeIds.has(item.id);
          const thumbnailImage = parseThumbnail(item.thumbnailImages);

          return (
            <li className={cls("w-full", isViewed ? "opacity-30" : "")} key={item.id}>
              <button
                type="button"
                className="flex h6 w-full cursor-pointer flex-col justify-between overflow-hidden px-4 py-2"
                onClick={() => routeEpisode(item.episodeIndex)}
              >
                <figure className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={thumbnailImage}
                    alt="episode list image"
                    width={200}
                    height={200}
                    className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                  />
                </figure>
                <Typography variant="h5" className="mt-1 px-2">
                  {item.episodeIndex}화
                </Typography>
                <p className="px-2 text-[12px] font-normal text-gray-400">
                  {item.beginAt
                    ? dateFormatting({
                        time: item.beginAt,
                        customOptions: { dateStyle: "medium" },
                      })
                    : null}
                </p>
              </button>
            </li>
          );
        })}

        <li className="sticky bottom-0 flex h-[65px] items-center justify-center">
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
            onClick={() => setShowEpisodeListDropDown(false)}
          >
            <IoClose className="h-6 w-6 text-gray-900" aria-hidden />
          </button>
        </li>
      </ul>
    </div>
  );
}

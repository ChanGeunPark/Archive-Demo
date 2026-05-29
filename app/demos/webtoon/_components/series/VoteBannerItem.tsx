import Image from "next/image";
import { cls } from "@/lib/client/utils";
import BasicTimer from "../ui/BasicTimer";

type VoteBannerItemProps = {
  title?: string;
  image?: string;
  currentEpisodeIndex?: number;
  genre?: string;
  voteExpireAt?: number;
  onClick?: () => void;
};

export default function VoteBannerItem({
  title,
  image,
  currentEpisodeIndex,
  genre,
  voteExpireAt,
  onClick,
}: VoteBannerItemProps) {
  return (
    <div className="p-4">
      <div
        className={cls(
          "w-full rounded-xl border-[1.5px] border-gray-50 bg-white shadow-elevation01",
        )}
      >
        <button
          type="button"
          className="relative flex w-full w-full items-end justify-between text-left"
          onClick={onClick}
        >
          <div className="absolute bottom-0 left-0 h-full w-[100px] overflow-hidden rounded-l-lg ">
            {image ? (
              <Image
                src={image}
                alt="vote banner image"
                className="pointer-events-none h-auto w-full object-contain"
                width={100}
                height={80}
              />
            ) : null}
          </div>

          <div
            className={cls(
              "my-3 ml-[100px] flex w-full flex-1 items-start space-y-1 truncate px-4",
              "max-lg:flex-col lg:items-center lg:justify-between",
            )}
          >
            <div>
              <p className="truncate text-[13px] font-normal text-gray-900 lg:text-base lg:font-bold">
                {title} {currentEpisodeIndex}화
              </p>
              {genre ? (
                <div className="mt-1 hidden space-x-2 lg:flex">
                  <p className="text-xs font-medium text-gray-600">
                    {genre}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-base font-bold text-gray-800">
                투표 종료까지
              </span>
              {voteExpireAt ? (
                <BasicTimer
                  endTime={voteExpireAt}
                  dayTitle="일"
                  isBanner
                  finishTitle="finish"
                  className="mr-1 text-right text-base font-bold text-alertSub"
                />
              ) : null}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

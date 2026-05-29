"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import { cls } from "@/lib/client/utils";
import { formatAuthors, formatIntervalType } from "@/lib/webtoon-demo/formatters";
import type { Series } from "@/lib/webtoon-demo/types";
import SubscribeSeriesButton from "./SubscribeSeriesButton";

type SeriesTitleBannerProps = {
  seriesItem: Series;
  isSubscribed: boolean;
  onSubscribeChange: (state: boolean) => void;
};

export default function SeriesTitleBanner({
  seriesItem,
  isSubscribed,
  onSubscribeChange,
}: SeriesTitleBannerProps) {
  const defaultImage = "/images/webtoon/banner.jpg";

  return (
    <div className="w-full lg:px-4">
      <div
        className={cls(
          "relative h-[300px] w-full overflow-hidden text-white",
          "lg:!rounded-bl-xl lg:!rounded-br-xl"
        )}
      >
        <Image
          src={seriesItem.bannerImage || defaultImage}
          alt={`${seriesItem.title} banner`}
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
          priority
        />

        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent to-black opacity-80" />

        <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-end p-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-full"
          >
            <KeyboardArrowLeftIcon className="-ml-1 h-6 w-6 fill-white" />
            <p className="text-xl font-bold leading-7">{seriesItem.title}</p>
          </Link>

          <div className="flex w-full items-center justify-between pl-5">
            <div className="flex items-center">
              <h6 className="text-sm font-bold leading-5">
                <span className="mr-1 text-[13px] font-normal text-gray-200">
                  연재일
                </span>
                {seriesItem.intervalType.map(
                  (week, index) =>
                    `${index > 0 ? " ," : ""}${formatIntervalType(week)}`
                )}
              </h6>
              <div className="mx-2 h-[10px] w-px bg-white opacity-50" />
              {formatAuthors(seriesItem.authorsRole).map((role, index) => (
                <h6 className="my-2 flex" key={index}>
                  <span className="mr-1 text-[13px] font-normal text-gray-200">
                    {Object.keys(role)[0]}
                  </span>
                  <span className="mr-2 text-sm font-bold leading-5">
                    {String(role["value"])}
                  </span>
                </h6>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative flex items-center justify-end space-x-1"
            >
              <SubscribeSeriesButton
                type="TEXT"
                title="구독하기"
                className="!bg-[rgba(0,0,0,0.8)]"
                isSubscribed={isSubscribed}
                onToggle={() => onSubscribeChange(!isSubscribed)}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { formatGenreType } from "@/lib/webtoon-demo/formatters";
import type { VoteBannerSeries } from "@/lib/webtoon-demo/types";
import VoteBannerItem from "./VoteBannerItem";

type VoteBannerSliderProps = {
  seoId?: string;
  banners: VoteBannerSeries[];
};

export default function VoteBannerSlider({ seoId, banners }: VoteBannerSliderProps) {
  const router = useRouter();

  if (!banners.length) return null;

  return (
    <div className="relative w-full">
      <Swiper loop autoplay={{ delay: 3000 }} speed={500} modules={[Autoplay]}>
        {banners.map((item) => {
          const image = item.thumbnailImages
            ? (JSON.parse(item.thumbnailImages) as { voteBanner?: string }).voteBanner
            : "";
          const voteExpireAt = new Date(item.currentVoteExpireAt).getTime();
          const genres = item.genre.reduce(
            (acc, cur) => `${acc} #${formatGenreType(cur)}`,
            "",
          );

          return (
            <SwiperSlide
              key={`vote_banner_${item.seoId}`}
              className={seoId && seoId !== item.seoId ? "hidden" : ""}
            >
              <VoteBannerItem
                title={item.title}
                image={image}
                currentEpisodeIndex={item.currentEpisodeIndex}
                voteExpireAt={voteExpireAt}
                genre={genres}
                onClick={() => {
                  router.push(
                    `/demos/webtoon/${item.seoId}/${item.currentEpisodeIndex}`,
                  );
                }}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

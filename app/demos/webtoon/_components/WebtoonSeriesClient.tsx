"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import KeyboardArrowDownIcon from "@/components/icons/arrow/KeyboardArrowDownIcon";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import {
  demoEpisodes,
  demoHasReadyBadge,
  demoHasRecentNotice,
  demoNotifications,
  demoSeries,
  demoViewedEpisodeIds,
  demoVoteBanners,
} from "@/lib/webtoon-demo/mockData";
import type { TabMenu } from "@/lib/webtoon-demo/types";
import WebtoonDemoShell from "./layout/WebtoonDemoShell";
import DashboardParents from "./dashboard/DashboardParents";
import EpisodeList from "./series/EpisodeList";
import NoticeList from "./series/NoticeList";
import SeriesInfoDetail from "./series/SeriesInfoDetail";
import SeriesTitleBanner from "./series/SeriesTitleBanner";
import SubscribeSeriesButton from "./series/SubscribeSeriesButton";
import VoteBannerSlider from "./series/VoteBannerSlider";
import GrayBox from "./ui/GrayBox";
import Tabs from "./ui/Tabs";

const selectableTabMenus = [
  { menu: "EPISODE", title: "회차" },
  { menu: "DASHBOARD", title: "웹툰일지" },
  { menu: "INFO", title: "정보" },
  { menu: "NOTICE", title: "공지" },
] as const;

export default function WebtoonSeriesClient() {
  const [tabMenu, setTabMenu] = useState<TabMenu>("EPISODE");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  const handleSubscribeChange = (subscribed: boolean) => {
    setIsSubscribed(subscribed);
    if (subscribed) {
      setShowDescription(false);
    }
  };

  return (
    <WebtoonDemoShell>
      <div className="relative h-full w-full">
        <SeriesTitleBanner
          seriesItem={demoSeries}
          isSubscribed={isSubscribed}
          onSubscribeChange={handleSubscribeChange}
        />

        <VoteBannerSlider seoId={demoSeries.seoId} banners={demoVoteBanners} />

        <section className="px-4">
          <GrayBox py="0" px={4}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-3"
              onClick={() => setShowDescription((prev) => !prev)}
            >
              <Typography variant="h5">줄거리</Typography>
              <KeyboardArrowDownIcon
                className={cls(
                  "h-4 w-4 fill-gray-600 transition-all duration-300",
                  showDescription ? "rotate-180" : "",
                )}
              />
            </button>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: showDescription ? "auto" : 0 }}
              className="overflow-hidden"
            >
              <Typography
                variant="body3"
                color={800}
                className="whitespace-pre-line"
              >
                {demoSeries.description.replace(/\\n/g, "\n")}
              </Typography>
              <div className="mt-4 flex justify-end pb-4">
                {!isSubscribed ? (
                  <SubscribeSeriesButton
                    type="TEXT"
                    title="구독하고 케이크 받기"
                    isSubscribed={isSubscribed}
                    onToggle={() => handleSubscribeChange(true)}
                  />
                ) : null}
              </div>
            </motion.div>
          </GrayBox>
        </section>

        <section className="flex justify-center">
          <div className="relative inline-block">
            <Tabs
              className="mt-2 w-auto! justify-center self-start"
              menu={tabMenu}
              alert={{
                alertIndex: demoHasRecentNotice ? 3 : demoHasReadyBadge ? 1 : 0,
                state: demoHasRecentNotice || demoHasReadyBadge,
              }}
              selectableMenus={[...selectableTabMenus]}
              onClick={(e) => {
                const menu = (e.currentTarget as HTMLElement).id as TabMenu;
                if (selectableTabMenus.some((item) => item.menu === menu)) {
                  setTabMenu(menu);
                }
              }}
            />
          </div>
        </section>

        {demoSeries.episodeCount > 0 ? (
          <div className="my-6 min-h-[calc(100vh-350px-64px-104px)] px-4">
            {tabMenu === "EPISODE" ? (
              <EpisodeList
                episodes={demoEpisodes}
                viewedEpisodeIds={demoViewedEpisodeIds}
              />
            ) : null}

            {tabMenu === "DASHBOARD" ? (
              <DashboardParents
                seriesData={demoSeries}
                isSubscribed={isSubscribed}
                onSubscribe={() => handleSubscribeChange(true)}
              />
            ) : null}

            {tabMenu === "INFO" ? (
              <SeriesInfoDetail seriesItem={demoSeries} />
            ) : null}

            {tabMenu === "NOTICE" ? (
              <NoticeList notifications={demoNotifications} />
            ) : null}
          </div>
        ) : null}
      </div>
    </WebtoonDemoShell>
  );
}

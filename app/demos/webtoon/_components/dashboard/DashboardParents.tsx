"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { cls } from "@/lib/client/utils";
import {
  createDemoDashboardData,
  initialDemoDashboardData,
} from "@/lib/webtoon-demo/dashboardMockData";
import type { Series } from "@/lib/webtoon-demo/types";
import CardBox from "../ui/CardBox";
import { RefreshIcon } from "./icons/DashboardIcons";
import DashboardAchievements from "./achievements/DashboardAchievements";
import DashBoardContribution from "./cards/DashBoardContribution";
import DashboardBestComment from "./cards/DashboardBestComment";
import DashboardCommentLike from "./cards/DashboardCommentLike";
import DashboardSameVoteUsers from "./cards/DashboardSameVoteUsers";
import DashboardVoteHistory from "./cards/DashboardVoteHistory";
import LevelSystemGraph from "./level/LevelSystemGraph";
import MyRewardBox from "./reward/MyRewardBox";
import { achievementsBadge, type BadgeType } from "./dashboard.types";

type DashboardParentsProps = {
  seriesData: Series;
  isSubscribed: boolean;
  onSubscribe: () => void;
  isLoggedIn?: boolean;
};

export default function DashboardParents({
  seriesData,
  isSubscribed,
  onSubscribe,
  isLoggedIn = true,
}: DashboardParentsProps) {
  const [refreshAni, setRefreshAni] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(initialDemoDashboardData);

  const maxWidth = "max-w-[350px] mx-auto w-full";

  const handleRefresh = useCallback(() => {
    setRefreshAni(true);
    setLoading(true);
    window.setTimeout(() => {
      setDashboardData(createDemoDashboardData());
      setLoading(false);
      setRefreshAni(false);
    }, 700);
  }, []);

  const handleClaimReward = useCallback((badgeId: BadgeType) => {
    setDashboardData((prev) => {
      const badgeMeta = prev.currentBadges.includes(badgeId)
        ? prev.currentBadges
        : [...prev.currentBadges, badgeId];
      const rewardCount =
        achievementsBadge.find((badge) => badge.badgeId === badgeId)?.getCakeCount ?? 1;

      return {
        ...prev,
        currentBadges: badgeMeta,
        badgeInfo: {
          ...prev.badgeInfo,
          [badgeId]: "RECEIVED",
          freeCakeCount: (prev.badgeInfo.freeCakeCount ?? 0) + rewardCount,
        },
      };
    });
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center p-4">
        <div className={cls("relative", maxWidth)}>
          <div className="w-full rounded-xl border border-gray-100">
            <Image
              src="/images/webtoon/dashboard/img_achievement_loggedout_light.png"
              alt="achievement preview"
              className="h-auto w-full"
              width={750}
              height={996}
            />
          </div>
          <div className="absolute bottom-0 left-0 h-[50%] w-full bg-gradient-to-t from-white to-transparent" />
        </div>
        <p className="m-8 text-center text-lg font-bold leading-[1.6] text-gray-700">
          지금 로그인해서 작품에 기여하고
          <br /> 업적을 쌓아보세요!
        </p>
      </div>
    );
  }

  return (
    <article className="relative space-y-4">
      <div className="absolute -top-12 right-0 z-10">
        <button
          type="button"
          disabled={refreshAni}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-elevation01"
          onClick={handleRefresh}
        >
          <RefreshIcon
            className={cls("h-5 w-5 fill-gray-600", refreshAni ? "animate-spin" : "")}
          />
        </button>
      </div>

      <CardBox px={4} className="relative !overflow-visible">
        <Image
          alt="user profile image"
          src={dashboardData.user.profileImage}
          width={100}
          height={100}
          className="mx-auto h-12 w-12 rounded-full bg-white object-cover"
        />
        <h2 className="mt-2 text-center text-lg font-bold text-gray-900">
          {dashboardData.user.nickname}
        </h2>
        <LevelSystemGraph
          className="mx-auto mt-4 max-w-[350px] rounded-lg bg-gray-25 p-4"
          level={dashboardData.user.level}
          currentExp={dashboardData.user.currentExp}
          expPercentage={dashboardData.user.expPercentage}
          onRefresh={handleRefresh}
        />
        <MyRewardBox maxWidth={maxWidth} />
      </CardBox>

      <DashBoardContribution
        maxWidth={maxWidth}
        achievementPoint={dashboardData.contributionInfo.achievementPoint}
        seriesPoint={dashboardData.contributionInfo.seriesPoint}
      />

      <DashboardAchievements
        maxWidth={maxWidth}
        badgeInfo={dashboardData.badgeInfo}
        currentBadges={dashboardData.currentBadges}
        loading={loading}
        onClaimReward={handleClaimReward}
      />

      <DashboardVoteHistory
        cakeUseAmount={dashboardData.cakeUseAmount}
        userVoteHistory={dashboardData.userVoteHistory}
        maxWidth={maxWidth}
      />

      <DashboardSameVoteUsers
        maxWidth={maxWidth}
        sameChoiceUserProfile={dashboardData.voteInfo.sameChoiceUserProfile}
        sameChoiceUserNumber={dashboardData.voteInfo.sameChoiceUserNumber}
        isSubscribed={isSubscribed}
        onSubscribe={onSubscribe}
      />

      <DashboardCommentLike
        maxWidth={maxWidth}
        likeCount={dashboardData.likeCount}
        lastMonthLikeCount={dashboardData.activityInfo.likeCount.lastMonth}
      />

      <DashboardBestComment
        bestCommentInfo={dashboardData.bestCommentInfo}
        maxWidth={maxWidth}
      />
    </article>
  );
}

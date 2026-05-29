"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { cls } from "@/lib/client/utils";
import type { BadgeInfo } from "@/lib/webtoon-demo/types";
import CardBox from "../../ui/CardBox";
import { achievementsBadge, type BadgeType } from "../dashboard.types";
import { CakeIcon, GiftIcon } from "../icons/DashboardIcons";
import AchievementsBottomSheet from "./AchievementsBottomSheet";

type SelectedBadge = {
  selectId: BadgeType;
  selectStatus: BadgeInfo[BadgeType] | null;
};

type DashboardAchievementsProps = {
  maxWidth: string;
  badgeInfo: BadgeInfo;
  currentBadges: BadgeType[];
  loading?: boolean;
  onClaimReward: (badgeId: BadgeType) => void;
};

export default function DashboardAchievements({
  maxWidth,
  badgeInfo,
  currentBadges,
  loading = false,
  onClaimReward,
}: DashboardAchievementsProps) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selected, setSelected] = useState<SelectedBadge>();

  if (loading) {
    return (
      <CardBox>
        <h4 className="my-6 text-center text-lg font-bold text-gray-900">나의 업적</h4>
        <div className="flex h-full w-full justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primaryMain" />
        </div>
      </CardBox>
    );
  }

  return (
    <>
      <CardBox>
        <h4 className="mb-2 mt-6 text-center text-lg font-bold text-gray-900">나의 업적</h4>
        <p className="body3-400 mb-8 text-center text-gray-700">
          빙고를 달성하면 추가 케이크를 받을 수 있어요!
        </p>

        <div
          className={cls(
            "grid w-full grid-flow-row grid-cols-3 gap-6 px-4 lg:mx-auto lg:gap-10",
            maxWidth
          )}
        >
          {achievementsBadge.map((badge, index) => {
            const isBadge = currentBadges.includes(badge.badgeId);
            const selectStatus = badgeInfo[badge.badgeId] ?? null;

            return (
              <button
                key={badge.badgeId}
                type="button"
                className="flex flex-col items-center space-y-2"
                onClick={() => {
                  setShowBottomSheet(true);
                  setSelected({ selectId: badge.badgeId, selectStatus });
                }}
              >
                <figure className="relative aspect-square w-full rounded-[35px]">
                  {selectStatus === "READY" ? (
                    <GiftIcon className="absolute right-0 top-0 z-10 h-6 w-6" />
                  ) : null}

                  {isBadge ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="inline-block h-auto w-full overflow-hidden rounded-[35%]"
                    >
                      <Image
                        src={`/images/webtoon/achievement_badge/${badge.badgeId.toLowerCase()}.png`}
                        alt={`badge_image_${badge.badgeId}`}
                        width={200}
                        height={200}
                        className="h-auto w-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <div className="inline-block h-auto w-full overflow-hidden rounded-[35%]">
                      <Image
                        src={`/images/webtoon/achievement_badge/${badge.badgeId.toLowerCase()}_none.png`}
                        alt=""
                        width={200}
                        height={200}
                        className="block h-auto w-full object-cover"
                      />
                    </div>
                  )}
                </figure>
                <h6 className="text-sm font-bold text-gray-900">{badge.name}</h6>
              </button>
            );
          })}
        </div>

        <div
          className={cls(
            "mx-auto mt-10 flex w-full justify-between border-t border-gray-50 px-4 pt-4",
            maxWidth
          )}
        >
          <p className="text-[13px] font-medium text-gray-800">받은 케이크</p>
          <div className="flex items-center justify-center">
            <CakeIcon />
            <h6 className="mx-0.5 text-base font-bold text-gray-800">
              {badgeInfo.freeCakeCount || 0}
            </h6>
          </div>
        </div>
      </CardBox>

      <AchievementsBottomSheet
        showBottomSheet={showBottomSheet}
        showBottomSheetToggler={setShowBottomSheet}
        selected={selected}
        onClaimReward={(badgeId) => {
          onClaimReward(badgeId);
          setShowBottomSheet(false);
        }}
      />
    </>
  );
}

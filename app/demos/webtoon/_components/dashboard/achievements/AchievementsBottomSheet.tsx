"use client";

import Image from "next/image";
import { enterTextFormatter } from "@/lib/webtoon-demo/formatters";
import { cls } from "@/lib/client/utils";
import type { BadgeInfo } from "@/lib/webtoon-demo/types";
import { achievementsBadge, type BadgeType } from "../dashboard.types";
import { CakeIcon } from "../icons/DashboardIcons";
import BottomSheet from "../ui/BottomSheet";
import ChizuButton from "../ui/ChizuButton";

type SelectedBadge = {
  selectId: BadgeType;
  selectStatus: BadgeInfo[BadgeType] | null;
};

type AchievementsBottomSheetProps = {
  showBottomSheet: boolean;
  showBottomSheetToggler: (open: boolean) => void;
  selected?: SelectedBadge;
  onClaimReward: (badgeId: BadgeType) => void;
};

export default function AchievementsBottomSheet({
  showBottomSheet,
  showBottomSheetToggler,
  selected,
  onClaimReward,
}: AchievementsBottomSheetProps) {
  const badgeData = achievementsBadge.find((badge) => badge.badgeId === selected?.selectId);
  const underway = !selected?.selectStatus;

  return (
    <BottomSheet
      showBottomSheet={showBottomSheet}
      showBottomSheetToggler={showBottomSheetToggler}
    >
      <div className={cls("flex flex-col items-center space-y-2 px-4 pt-6 lg:px-8")}>
        <div className="h-20 w-20 overflow-hidden rounded-[30px] lg:h-[150px] lg:w-[150px] lg:rounded-[80px]">
          {selected?.selectStatus && selected.selectId ? (
            <Image
              src={`/images/webtoon/achievement_badge/${selected.selectId.toLowerCase()}.png`}
              alt={`badge_image_${selected.selectId.toLowerCase()}`}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          ) : selected?.selectId ? (
            <Image
              src={`/images/webtoon/achievement_badge/${selected.selectId.toLowerCase()}_none.png`}
              alt={`badge_image_${selected.selectId.toLowerCase()}`}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <h4 className="pt-2 text-lg font-bold text-gray-900">{badgeData?.fullName}</h4>
        <p className="whitespace-pre-line pb-6 text-center text-sm font-normal text-gray-900">
          {underway
            ? enterTextFormatter(String(badgeData?.notReadyDescription))
            : enterTextFormatter(String(badgeData?.description))}
        </p>
        <ChizuButton
          buttonStyle="PRIMARY"
          disabled={selected?.selectStatus !== "READY"}
          buttonSize="FULL"
          onClick={() => {
            if (!selected?.selectId || underway) return;
            onClaimReward(selected.selectId);
          }}
        >
          {selected?.selectStatus === "READY" ? (
            <span className="flex items-center justify-center">
              <CakeIcon className="mr-0.5" /> {badgeData?.getCakeCount}개 먹기
            </span>
          ) : null}
          {selected?.selectStatus === "RECEIVED" ? "케이크 소화 완료" : null}
          {underway ? (
            <span className="flex items-center text-gray-500 opacity-70">
              업적 달성 보상:
              <CakeIcon className="mx-1 h-4 w-4" />
              {badgeData?.getCakeCount}
            </span>
          ) : null}
        </ChizuButton>
      </div>
    </BottomSheet>
  );
}

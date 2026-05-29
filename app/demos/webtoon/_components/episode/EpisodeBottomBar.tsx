"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cls } from "@/lib/client/utils";
import {
  demoViewedEpisodeIds,
  getPublishedEpisodes,
} from "@/lib/webtoon-demo/episodeHelpers";
import type { EpisodeDetail } from "@/lib/webtoon-demo/types";
import ChizuButton from "../dashboard/ui/ChizuButton";
import { IoChatbubbleOutline, IoStarOutline } from "react-icons/io5";
import EpisodeControlButtons from "./EpisodeControlButtons";
import EpisodeListDropDown from "./EpisodeListDropDown";
import VotedViewerBottomSheet from "./VotedViewerBottomSheet";

type EpisodeBottomBarProps = {
  seoId: string;
  episodeData: EpisodeDetail;
  opened: boolean;
  isVoteOver: boolean;
};

export default function EpisodeBottomBar({
  seoId,
  episodeData,
  opened,
  isVoteOver,
}: EpisodeBottomBarProps) {
  const router = useRouter();
  const [showEpisodeListDropDown, setShowEpisodeListDropDown] = useState(false);
  const [showVotedViewerBottomSheet, setShowVotedViewerBottomSheet] =
    useState(false);
  const episodeList = getPublishedEpisodes();

  return (
    <>
      <div
        className={cls(
          "fixed bottom-0 right-0 z-50 w-full transition-all duration-300 ease-in-out",
          "max-lg:border-t max-lg:border-gray-50 max-lg:pb-[env(safe-area-inset-bottom)]",
          "lg:bottom-4 lg:left-1/2 lg:max-w-[580px] lg:-translate-x-1/2 lg:rounded-xl lg:shadow-elevation01",
          showEpisodeListDropDown ? "max-lg:w-[190px] rounded-xl" : "",
          opened
            ? "h-[64px] translate-y-0 lg:bottom-4"
            : "pointer-events-none h-[64px] translate-y-full lg:!-bottom-20 lg:translate-y-0 lg:!h-0",
        )}
      >
        <div
          className={cls(
            "relative flex h-[64px] w-full items-center justify-between pl-6 pr-2 transition-all duration-300 ease-in-out",
            showEpisodeListDropDown
              ? "rounded-xl"
              : "bg-[rgba(255,255,255,0.9)] backdrop-blur-md",
            "lg:rounded-xl",
          )}
        >
          <div
            className={cls(
              "flex items-center space-x-2",
              showEpisodeListDropDown ? "opacity-0" : "opacity-100",
            )}
          >
            <ChizuButton
              buttonStyle="OUTLINED"
              buttonSize="SMALL"
              onClick={() =>
                router.push(
                  `/demos/webtoon/${seoId}/${episodeData.episodeIndex}/comments`,
                )
              }
              icon={
                <IoChatbubbleOutline className="text-gray-500" aria-hidden />
              }
            >
              {episodeData.commentCount ?? 0}
            </ChizuButton>
            {isVoteOver ? (
              <ChizuButton
                buttonStyle="OUTLINED"
                buttonSize="SMALL"
                onClick={() => setShowVotedViewerBottomSheet(true)}
                icon={
                  <IoStarOutline
                    className="h-4 w-4 text-gray-500"
                    aria-hidden
                  />
                }
              >
                결과
              </ChizuButton>
            ) : null}
          </div>

          <EpisodeControlButtons
            seoId={seoId}
            episodeData={episodeData}
            episodeList={episodeList}
            showEpisodeListDropDown={showEpisodeListDropDown}
            setShowEpisodeListDropDown={setShowEpisodeListDropDown}
          />
        </div>

        <EpisodeListDropDown
          seoId={seoId}
          episodeList={episodeList}
          viewedEpisodeIds={demoViewedEpisodeIds}
          showEpisodeListDropDown={showEpisodeListDropDown}
          setShowEpisodeListDropDown={setShowEpisodeListDropDown}
        />
      </div>

      {showEpisodeListDropDown ? (
        <button
          type="button"
          aria-label="닫기"
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setShowEpisodeListDropDown(false)}
        />
      ) : null}

      {showVotedViewerBottomSheet ? (
        <VotedViewerBottomSheet
          episodeData={episodeData}
          showBottomSheet={showVotedViewerBottomSheet}
          showBottomSheetToggler={setShowVotedViewerBottomSheet}
        />
      ) : null}
    </>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import { CAKE_PER_TICKET } from "@/lib/webtoon-demo/voteMockData";
import type { EpisodeDetail, VoteCandidate, VoteSessionInfo } from "@/lib/webtoon-demo/types";
import { CakeIcon } from "../dashboard/icons/DashboardIcons";
import { IoClose } from "react-icons/io5";
import ChizuButton from "../dashboard/ui/ChizuButton";
import VoteTicketCounter from "./VoteTicketCounter";

type VotingBottomLineProps = {
  episodeData: EpisodeDetail;
  voteData: VoteSessionInfo;
  showBottomSheet: boolean;
  showBottomSheetToggler: (open: boolean) => void;
  voted?: VoteCandidate;
  ticketCount: number;
  setTicketCount: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => Promise<void>;
  loading: boolean;
};

export default function VotingBottomLine({
  episodeData,
  voteData,
  showBottomSheet,
  showBottomSheetToggler,
  voted,
  ticketCount,
  setTicketCount,
  onSubmit,
  loading,
}: VotingBottomLineProps) {
  const remainingVoteCount = voteData.remainingVoteCount;
  const cost = CAKE_PER_TICKET * ticketCount;
  const notEnoughCake = cost > voteData.userCakeCount;

  return (
    <AnimatePresence>
      {showBottomSheet && voted ? (
        <motion.div
          initial={{ transform: "translateY(100%)" }}
          animate={{ transform: "translateY(0%)" }}
          exit={{ transform: "translateY(100%)" }}
          className={cls(
            "fixed bottom-0 left-0 z-[60] !h-fit w-full bg-white",
            "shadow-[0px_-5px_10px_0px_rgba(0,0,0,0.10)]",
          )}
        >
          <div className="relative mx-auto pb-6 pt-4 lg:max-w-[700px]">
            <div className="flex justify-between px-4">
              <div className="flex items-center space-x-2">
                <Typography variant="body3" weight={500}>
                  {100 - remainingVoteCount}
                  <span className="text-gray-400">장 투표 완료</span>
                </Typography>
                <div className="h-[10px] w-[1px] bg-gray-200" />
                <Typography variant="body3" weight={500}>
                  {remainingVoteCount}
                  <span className="mr-2 text-gray-400">장 투표 가능</span>
                </Typography>
              </div>
              <button type="button" onClick={() => showBottomSheetToggler(false)}>
                <IoClose className="text-gray-500" aria-hidden />
              </button>
            </div>

            <div className="mt-1 flex flex-col content-center justify-between px-2 max-sm:flex-col max-sm:items-end max-sm:space-y-2">
              <div className="flex items-center space-x-8 rounded-full border-2 border-primaryMain bg-white pl-2 pr-6 max-sm:w-full max-sm:justify-between max-sm:py-1">
                <VoteTicketCounter
                  min={1}
                  max={remainingVoteCount}
                  ticketCount={ticketCount}
                  setTicketCount={setTicketCount}
                  className="!rounded-full border-none [&_button]:!rounded-full"
                />
                <div className="flex items-center">
                  <CakeIcon className="h-6 w-6" />
                  <Typography variant="h5" className="ml-1">
                    {cost}
                    <span className="text-xs font-normal text-gray-500">
                      {" "}
                      / {voteData.userCakeCount}
                    </span>
                  </Typography>
                </div>
              </div>

              {notEnoughCake ? (
                <ChizuButton
                  buttonStyle="BLACK"
                  className="!w-[200px] lg:w-[150px]"
                  onClick={() => alert("데모: 케이크 충전 기능은 준비 중입니다.")}
                >
                  충전 후 투표하기
                </ChizuButton>
              ) : (
                <ChizuButton
                  buttonStyle="PRIMARY"
                  disabled={loading}
                  className="!w-[200px] lg:w-[150px]"
                  onClick={() => void onSubmit()}
                >
                  {loading ? "투표 중..." : `${voted.selectionNumber}번에 투표하기`}
                </ChizuButton>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { cls } from "@/lib/client/utils";
import InfiniteLikeAnimation from "./InfiniteLikeAnimation";

type VoteQuestionButtonProps = {
  voteTitle: string;
  voteId: string;
  currentVoteId?: string;
  currentVotePercentage?: number;
  selfAndWinOrSecondVote?: {
    self?: number;
    second?: number;
    win?: number;
  };
  isWinner?: boolean;
  isVoted: boolean;
  isSelected: boolean;
  completeVote: boolean;
  className?: string;
  onClick?: () => void;
  showBottomSheetToggler?: () => void;
};

export default function VoteQuestionButton({
  voteTitle,
  voteId,
  currentVoteId,
  currentVotePercentage = 0,
  selfAndWinOrSecondVote,
  isWinner,
  isVoted,
  isSelected,
  completeVote,
  className,
  onClick,
  showBottomSheetToggler,
}: VoteQuestionButtonProps) {
  return (
    <section className="w-full">
      <div className="relative flex w-full items-center justify-end space-x-2">
        <button
          type="button"
          className={cls(
            "relative w-full break-keep rounded-xl border-2 text-[0.95rem] tracking-wide transition-all duration-100 lg:text-[1.2rem]",
            currentVoteId === voteId
              ? "border-gray-900 bg-primaryMain font-bold text-gray-900"
              : "border-gray-300 bg-white font-medium text-gray-600",
            isSelected
              ? "!border-gray-900 !bg-white !text-gray-900"
              : isVoted
                ? "!border-gray-100 !bg-[rgba(255,255,255,0.8)] !text-gray-300 backdrop-blur-lg"
                : "",
            className,
          )}
          onClick={() => {
            if (completeVote) return;
            showBottomSheetToggler?.();
            if (isVoted) return;
            onClick?.();
          }}
        >
          {isSelected ? (
            <InfiniteLikeAnimation
              className="absolute -top-3 z-40"
              style={{
                left:
                  currentVotePercentage > 90
                    ? `calc(${currentVotePercentage}% - 50px)`
                    : currentVotePercentage < 10
                      ? "0"
                      : `calc(${currentVotePercentage}% - 30px)`,
              }}
            />
          ) : null}

          <div className="flex content-center">
            <div className="relative block w-full px-2 py-2 text-center">
              {isVoted ? (
                <div
                  className={cls(
                    "absolute left-0 top-0 h-full overflow-hidden rounded-l-[10px]",
                    "animate-radient bg-gradient-to-r from-[#FFDC60] via-[#FFA18C] to-[#8CCFFF] bg-[length:400%_400%]",
                    isSelected ? "opacity-100" : "opacity-20",
                  )}
                  style={{ width: `${currentVotePercentage}%` }}
                >
                  {currentVotePercentage < 100 ? (
                    <div
                      className={cls(
                        "absolute -right-[1px] top-0 z-[1] h-full w-10 rotate-180 bg-gradient-to-r",
                        isSelected ? "from-white" : "from-gray-100",
                      )}
                    />
                  ) : null}
                </div>
              ) : null}
              <span className={cls("relative z-[2]", currentVoteId === voteId && "text-left")}>
                {voteTitle}
              </span>
            </div>
          </div>
        </button>
      </div>

      {isSelected ? (
        <div className="flex w-full items-center justify-between pb-1 pt-0.5 text-xs font-medium">
          <div className="rounded-full bg-[rgba(0,0,0,0.5)] px-2 py-[2px] text-white backdrop-blur-lg">
            {isWinner ? (
              Number(selfAndWinOrSecondVote?.self ?? 0) ===
              Number(selfAndWinOrSecondVote?.second ?? 0) ? (
                "현재 동점!"
              ) : (
                <span>
                  🥳 이기고 있어요{" "}
                  <span className="opacity-50">
                    (+
                    {Number(selfAndWinOrSecondVote?.self ?? 0) -
                      Number(selfAndWinOrSecondVote?.second ?? 0)}
                    표)
                  </span>
                </span>
              )
            ) : Number(selfAndWinOrSecondVote?.self ?? 0) ===
              Number(selfAndWinOrSecondVote?.win ?? 0) ? (
              "현재 동점!"
            ) : (
              <span>
                🥹 지고 있어요{" "}
                <span className="opacity-50">
                  (
                  {Number(selfAndWinOrSecondVote?.win ?? 0) -
                    Number(selfAndWinOrSecondVote?.self ?? 0)}
                  표)
                </span>
              </span>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

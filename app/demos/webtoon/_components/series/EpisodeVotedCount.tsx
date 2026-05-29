import { cls } from "@/lib/client/utils";
import type { VoteOption } from "@/lib/webtoon-demo/types";
import KeyboardArrowDownIcon from "@/components/icons/arrow/KeyboardArrowDownIcon";
import VoteOutlinedIcon from "../icons/VoteOutlinedIcon";

type EpisodeVotedCountProps = {
  isVoting?: boolean;
  isViewed?: boolean;
  sortVoteResult?: VoteOption[];
  showVote?: boolean;
  setShowVote: React.Dispatch<React.SetStateAction<boolean>>;
  totalSum?: number;
  episodeType?: string;
};

export default function EpisodeVotedCount({
  isVoting,
  isViewed,
  sortVoteResult,
  showVote,
  setShowVote,
  episodeType,
}: EpisodeVotedCountProps) {
  return (
    <button
      type="button"
      className="flex items-center px-2"
      onClick={(e) => {
        e.stopPropagation();
        if (isViewed && sortVoteResult?.length) {
          setShowVote((prev) => !prev);
        }
      }}
    >
      {episodeType !== "ORDINARY" ? (
        <>
          <VoteOutlinedIcon
            className={cls(
              "mr-1 h-4 w-4 shrink-0 -translate-y-px",
              isViewed ? "fill-gray-300" : "fill-gray-400",
              showVote ? "!fill-gray-700" : ""
            )}
          />
          <p
            className={cls(
              "text-xs font-medium",
              isViewed ? "text-gray-300" : "text-gray-500",
              showVote ? "!text-gray-700" : ""
            )}
          >
            {isVoting ? "투표 중" : "투표 완료"}
          </p>
        </>
      ) : null}
      {sortVoteResult?.length && isViewed ? (
        <KeyboardArrowDownIcon
          className={cls(
            "h-3 w-3 fill-gray-400 transition-all duration-300",
            showVote ? "rotate-180 fill-gray-700" : ""
          )}
        />
      ) : null}
    </button>
  );
}

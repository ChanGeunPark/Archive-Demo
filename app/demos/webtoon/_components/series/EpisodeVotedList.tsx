import { cls } from "@/lib/client/utils";
import type { VoteOption } from "@/lib/webtoon-demo/types";

type EpisodeVotedListProps = {
  sortVoteResult?: VoteOption[];
  totalSum?: number;
  winnerIndex?: number;
  showVote?: boolean;
};

export default function EpisodeVotedList({
  sortVoteResult,
  totalSum,
  winnerIndex,
  showVote,
}: EpisodeVotedListProps) {
  if (!sortVoteResult?.length) return null;

  return (
    <div
      className={cls(
        "mt-3 w-full flex-col border-t border-gray-100 px-2 pt-4",
        showVote ? "flex" : "hidden"
      )}
    >
      {sortVoteResult.map((item, index) => {
        const percentage =
          item.voteSum && totalSum
            ? Math.round((item.voteSum / totalSum) * 100)
            : 0;
        const winner = index === winnerIndex;

        return (
          <div
            className="mb-1.5 flex w-full items-center justify-between text-gray-400"
            key={item.selectionNumber}
          >
            <p
              className={cls(
                "text-xs font-normal",
                winner ? "text-tertiaryDark" : "text-gray-400"
              )}
            >
              {index + 1}. {item.title}
            </p>
            <p
              className={cls(
                "text-xs font-medium",
                winner ? "text-tertiaryDark" : "text-gray-400"
              )}
            >
              {percentage}%
            </p>
          </div>
        );
      })}
    </div>
  );
}

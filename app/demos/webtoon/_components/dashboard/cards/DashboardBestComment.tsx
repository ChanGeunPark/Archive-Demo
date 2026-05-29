import Typography from "@/components/typography/Typography";
import ArrowRightIcon from "@/components/icons/arrow/ArrowRightIcon";
import { cls } from "@/lib/client/utils";
import { enterTextFormatter } from "@/lib/webtoon-demo/formatters";
import type { BestCommentItem } from "../dashboard.types";
import CardBox from "../../ui/CardBox";
import { GoldTiaraIcon } from "../icons/DashboardIcons";

type DashboardBestCommentProps = {
  bestCommentInfo: BestCommentItem[];
  maxWidth: string;
};

export default function DashboardBestComment({
  bestCommentInfo,
  maxWidth,
}: DashboardBestCommentProps) {
  if (!bestCommentInfo.length) return null;

  return (
    <CardBox>
      <div className={maxWidth}>
        <GoldTiaraIcon className="mt-4 h-6 w-8 fill-primaryDark" />
        <Typography variant="h3" className="mb-4">
          내가 적은
          <br />
          명예의 인기댓글
        </Typography>

        {bestCommentInfo.map((item, index) => (
          <button
            type="button"
            key={`${item.commentId}-${index}`}
            className={cls(
              "relative mb-4 flex w-full items-center justify-between rounded-xl bg-gray-50 p-4 text-left transition-all"
            )}
            onClick={() => {
              alert(`데모: ${item.episodeIndex}화 댓글 페이지는 아직 연결되지 않았습니다.`);
            }}
          >
            <div className="flex items-start justify-start space-x-4">
              <Typography variant="h5" color={800} className="mb-1">
                {item.episodeIndex}화
              </Typography>
              <Typography variant="body2" color={500} className="whitespace-pre-line">
                {enterTextFormatter(item.content)}
              </Typography>
            </div>
            <ArrowRightIcon className="h-4 w-4 -rotate-45 fill-gray-400" />
          </button>
        ))}
      </div>
    </CardBox>
  );
}

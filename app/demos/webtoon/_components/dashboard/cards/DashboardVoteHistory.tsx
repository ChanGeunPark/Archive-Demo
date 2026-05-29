import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import { enterTextFormatter } from "@/lib/webtoon-demo/formatters";
import CardBox from "../../ui/CardBox";
import { usingCakeTitle } from "../dashboard.types";
import { CakeIcon } from "../icons/DashboardIcons";
import CustomizedStickChart from "../ui/CustomizedStickChart";

type DashboardVoteHistoryProps = {
  maxWidth: string;
  cakeUseAmount: number;
  userVoteHistory: Array<{ episode: number; cake: number }>;
};

export default function DashboardVoteHistory({
  maxWidth,
  cakeUseAmount,
  userVoteHistory,
}: DashboardVoteHistoryProps) {
  return (
    <CardBox px={4}>
      <Typography variant="h4" className="mt-6" align="center">
        투표 현황
      </Typography>
      <Typography variant="body2" align="center" className="mb-4 mt-1 w-full">
        {enterTextFormatter(usingCakeTitle(cakeUseAmount))}
      </Typography>

      <CustomizedStickChart
        userVoteHistory={userVoteHistory}
        className={cls("mx-auto mt-4 h-[300px] w-full", maxWidth)}
      />

      <div
        className={cls(
          "mx-auto flex w-full justify-between border-t border-gray-50 px-4 pt-4",
          maxWidth
        )}
      >
        <Typography variant="body3" weight={500} color={800}>
          사용한 케이크
        </Typography>
        <div className="flex items-center">
          <CakeIcon />
          <Typography variant="h5" color={800} className="mx-0.5">
            {cakeUseAmount}
          </Typography>
        </div>
      </div>
    </CardBox>
  );
}

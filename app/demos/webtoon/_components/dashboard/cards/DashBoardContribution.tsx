import { cls } from "@/lib/client/utils";
import CardBox from "../../ui/CardBox";
import CountUpAnimation from "../ui/CountUpAnimation";
import Tooltip from "../ui/Tooltip";
import { InformationIcon, PlusIcon } from "../icons/DashboardIcons";

type DashBoardContributionProps = {
  maxWidth: string;
  achievementPoint: number;
  seriesPoint: number;
};

export default function DashBoardContribution({
  maxWidth,
  achievementPoint,
  seriesPoint,
}: DashBoardContributionProps) {
  const synthesisPoint = achievementPoint + seriesPoint;

  return (
    <CardBox px={6} className="!overflow-visible !pb-0">
      <h4 className="mb-6 text-center text-lg font-bold text-gray-800">나의 기여도</h4>

      <section className={cls("w-full", maxWidth)}>
        <h3 className="h3 text-center text-xl font-bold text-gray-900">
          <CountUpAnimation count={synthesisPoint} duration={700} />
        </h3>
        <h5 className="flex items-center justify-center text-base font-bold text-gray-600">
          기여도 점수
          <Tooltip
            horizontal="center"
            icon={<InformationIcon className="ml-0.5 h-4 w-4 text-gray-400" />}
          >
            <p className="text-center text-xs font-normal">업적 점수 + 활동 점수 = 기여도 점수</p>
          </Tooltip>
        </h5>

        <section className="mb-6 mt-6 flex w-full items-center justify-between rounded-xl bg-gray-50 py-[18px]">
          <div className="flex w-full flex-col items-center justify-center">
            <h4 className="h-7 text-lg font-bold text-gray-900">
              <CountUpAnimation count={achievementPoint} duration={700} />
            </h4>
            <div className="flex items-center text-xs font-medium text-gray-600">
              업적 점수
              <Tooltip
                horizontal="center"
                icon={<InformationIcon className="ml-0.5 h-4 w-4 text-gray-400" />}
              >
                <div className="text-left">
                  <p className="text-xs font-normal">
                    업적 점수는 업적을 획득할 때마다 지급되며, 최대 360점까지 쌓을 수 있습니다.
                  </p>
                  <p className="mt-4 text-xs font-normal text-gray-500">
                    업적 획득 1개 당 +20점
                    <br />
                    빙고 1개 당 +10점
                    <br />
                    빙고 모두 완성 +100점
                  </p>
                </div>
              </Tooltip>
            </div>
          </div>
          <PlusIcon className="h-5 w-5 text-gray-300" />
          <div className="flex w-full flex-col items-center justify-center">
            <h4 className="h-7 text-lg font-bold text-gray-900">
              <CountUpAnimation count={seriesPoint} duration={700} />
            </h4>
            <Tooltip
              horizontal="right"
              icon={
                <div className="flex items-center text-xs font-medium text-gray-600">
                  활동 점수
                  <InformationIcon className="ml-0.5 h-4 w-4 text-gray-400" />
                </div>
              }
            >
              <div className="text-left">
                <p className="text-xs font-normal">
                  활동 점수는 매월 새로 갱신되며,
                  <br />
                  아래와 같은 활동으로 쌓을 수 있습니다.
                </p>
                <p className="mt-4 text-xs font-normal text-gray-500">
                  투표권 1장 사용 +100점
                  <br />
                  초대한 친구가 투표권 1장 사용 +30점
                  <br />
                  베스트 댓글 1개 당 +10점
                  <br />
                  받은 좋아요 10개 당 +1점 (최대 100점)
                </p>
              </div>
            </Tooltip>
          </div>
        </section>
      </section>
    </CardBox>
  );
}

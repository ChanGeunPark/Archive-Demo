"use client";

import Image from "next/image";
import { cls } from "@/lib/client/utils";
import CardBox from "../../ui/CardBox";
import ChizuButton from "../ui/ChizuButton";

type DashboardSameVoteUsersProps = {
  maxWidth: string;
  sameChoiceUserProfile: string[];
  sameChoiceUserNumber: number;
  isSubscribed: boolean;
  onSubscribe: () => void;
};

export default function DashboardSameVoteUsers({
  maxWidth,
  sameChoiceUserProfile,
  sameChoiceUserNumber,
  isSubscribed,
  onSubscribe,
}: DashboardSameVoteUsersProps) {
  const isNotSame = sameChoiceUserProfile.length === 0;

  return (
    <CardBox className="!bg-primaryMain">
      <div className={cls("w-full rounded-xl px-4", maxWidth)}>
        <p className="text-sm font-normal text-gray-900">나와 같은 결정을 한 사람은?</p>
        {isNotSame ? (
          <h3 className="text-xl font-bold text-gray-900">아직 없어요 🤔</h3>
        ) : (
          <h3 className="text-xl font-bold text-gray-900">
            우리는 모두
            <br />
            투표로 통하는 중!
          </h3>
        )}

        {!isNotSame ? (
          <div className="mt-6 flex items-center">
            {sameChoiceUserProfile.slice(0, 10).map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="-ml-1 h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-white shadow-elevation01 lg:h-8 lg:w-8"
              >
                <Image
                  src={item}
                  alt="profile"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {sameChoiceUserNumber > 10 ? (
              <h6 className="ml-2 text-sm font-bold text-gray-900">
                외 {sameChoiceUserNumber - 10}명
              </h6>
            ) : null}
          </div>
        ) : (
          <ChizuButton
            buttonSize="MEDIUM"
            buttonStyle="BLACK"
            className="mt-6"
            onClick={() => {
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
          >
            투표하러 가기
          </ChizuButton>
        )}

        {isNotSame ? (
          <div className="mt-6">
            <ChizuButton
              buttonStyle="BLACK"
              buttonSize="MEDIUM"
              onClick={onSubscribe}
            >
              {!isSubscribed ? "구독알림 받기" : "구독 중"}
            </ChizuButton>
            <p className="mt-2 text-xs font-medium text-gray-600">
              * 구독하면 투표알림을 받을 수 있어요!
            </p>
          </div>
        ) : null}
      </div>
    </CardBox>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import KeyboardArrowDownIcon from "@/components/icons/arrow/KeyboardArrowDownIcon";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import ChizuButton from "../ui/ChizuButton";

type DemoGoodsItem = {
  goodsImageUrl: string;
  seriesName: string;
  title: string;
  rubyPrice: number;
};

const demoGoods: DemoGoodsItem[] = [
  {
    goodsImageUrl: "/images/webtoon/thumb.jpg",
    seriesName: "별빛 아래, 우리",
    title: "별빛 아크릴 스탠드",
    rubyPrice: 1200,
  },
  {
    goodsImageUrl: "/images/webtoon/ep5.jpg",
    seriesName: "별빛 아래, 우리",
    title: "캐릭터 엽서 세트",
    rubyPrice: 800,
  },
];

type MyRewardBoxProps = {
  maxWidth?: string;
};

export default function MyRewardBox({ maxWidth }: MyRewardBoxProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div className={cls("mt-5 flex w-full justify-between", maxWidth)}>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between px-2"
          onClick={() => setShowDetail((prev) => !prev)}
        >
          <span className="text-[13px] font-medium text-gray-800">레벨업하면 필수 확인!</span>
          <KeyboardArrowDownIcon
            className={cls(
              "ml-0.5 h-4 w-4 fill-gray-700 transition-transform",
              showDetail ? "rotate-180" : ""
            )}
          />
        </button>
      </div>

      {showDetail ? (
        <section className={cls("w-full overflow-hidden px-2 transition-all duration-300", maxWidth)}>
          <div className="mt-4 flex w-full items-center justify-between">
            <Typography variant="h6">작품 굿즈</Typography>
            <ChizuButton
              buttonSize="SMALL"
              buttonStyle="OUTLINED"
              onClick={() => alert("데모: 레벨업 보상 페이지는 아직 연결되지 않았습니다.")}
            >
              레벨업 보상
            </ChizuButton>
          </div>

          <div className="mt-3 grid grid-flow-row grid-cols-2 gap-2">
            {demoGoods.map((item, index) => (
              <button
                type="button"
                key={`goods_item_${index}`}
                className="overflow-hidden rounded-xl border border-gray-50 bg-white text-left"
                onClick={() => alert(`데모: ${item.title} 상세는 아직 연결되지 않았습니다.`)}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={item.goodsImageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs text-gray-500">{item.seriesName}</p>
                  <p className="truncate text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="text-sm font-bold text-secondaryDark">{item.rubyPrice}루비</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

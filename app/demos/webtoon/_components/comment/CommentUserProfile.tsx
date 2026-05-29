"use client";

import Image from "next/image";
import { cls } from "@/lib/client/utils";
import type { CommentFilterType } from "@/lib/webtoon-demo/types";
import { GoldTiaraIcon } from "../dashboard/icons/DashboardIcons";
import { IoTrophy } from "react-icons/io5";

type CommentUserProfileProps = {
  tabMenu?: CommentFilterType;
  rank?: number;
  profileImage?: string;
  voteSelection?: number;
};

export default function CommentUserProfile({
  tabMenu,
  rank,
  profileImage,
  voteSelection,
}: CommentUserProfileProps) {
  return (
    <div className="relative flex shrink-0 flex-col items-center pr-2">
      {tabMenu === "POPULAR" && rank === 0 ? (
        <GoldTiaraIcon className="absolute top-[-8px] h-4 w-4 text-primaryMain" />
      ) : null}
      {tabMenu === "POPULAR" && rank === 1 ? (
        <IoTrophy className="absolute top-[-8px] h-4 w-4 text-gray-300" aria-hidden />
      ) : null}
      {tabMenu === "POPULAR" && rank === 2 ? (
        <IoTrophy className="absolute top-[-8px] h-4 w-4 text-amber-700" aria-hidden />
      ) : null}
      <div
        className={cls(
          "aspect-square overflow-hidden rounded-full border-[1.5px] border-gray-50",
          tabMenu === "POPULAR" && rank === 0 ? "!border-primaryMain" : "",
          tabMenu === "POPULAR" && rank === 1 ? "!border-tertiaryMain" : "",
          tabMenu === "POPULAR" && rank === 2 ? "!border-secondaryMain" : "",
        )}
      >
        <Image
          src={profileImage || "/images/character/like_character3.png"}
          alt="comment profile"
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
        />
      </div>
      {voteSelection ? (
        <div className="mt-1 rounded-md bg-gray-900 px-[6px] py-[2px]">
          <p className="text-[10px] font-bold text-primaryMain">{voteSelection}번</p>
        </div>
      ) : null}
    </div>
  );
}

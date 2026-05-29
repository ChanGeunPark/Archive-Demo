"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import { dateFormatting } from "@/lib/webtoon-demo/formatters";
import { enterTextFormatter } from "@/lib/webtoon-demo/formatters";
import type { Comment, CommentFilterType, EpisodeDetail } from "@/lib/webtoon-demo/types";
import {
  IoChatbubbleOutline,
  IoEllipsisHorizontal,
  IoHeart,
  IoHeartOutline,
} from "react-icons/io5";
import CommentUserProfile from "./CommentUserProfile";

type CommentListItemProps = {
  comment: Comment;
  rank?: number;
  type?: "DEFAULT" | "REPLY";
  tabMenu?: CommentFilterType;
  episodeData?: EpisodeDetail;
  onReplyClick?: (commentId: string, userId: string, childCount: number) => void;
  onLikeToggle?: (commentId: string) => void;
  isReplyOpen?: boolean;
};

export default function CommentListItem({
  comment,
  rank,
  type = "DEFAULT",
  tabMenu,
  episodeData,
  onReplyClick,
  onLikeToggle,
  isReplyOpen,
}: CommentListItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const emoji =
    comment.config != null
      ? (JSON.parse(comment.config) as { emoji?: string }).emoji
      : undefined;
  const emojiOnly = comment.content.trim() === "" && emoji;

  return (
    <div
      className={cls(
        "flex w-full px-4 py-6",
        type === "REPLY" && "bg-gray-50 pl-12",
      )}
    >
      <CommentUserProfile
        tabMenu={tabMenu}
        rank={rank}
        profileImage={comment.user.profileImage}
        voteSelection={comment.voteSelection}
      />

      <div className="relative flex-1">
        <div className="flex w-full items-center justify-between py-1">
          <Typography variant="body3" weight={500} color={500}>
            {comment.user.nickname}
          </Typography>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <IoEllipsisHorizontal className="h-4 w-4 text-gray-300" aria-hidden />
          </button>
          {showMenu ? (
            <div className="absolute right-0 top-8 z-10 rounded-lg border border-gray-100 bg-white py-1 shadow-md">
              <button
                type="button"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                신고하기
              </button>
            </div>
          ) : null}
        </div>

        {emoji ? (
          <Image
            alt="emoji"
            src={`/images/emoji/${emoji}.png`}
            width={175}
            height={175}
            className="mb-1 max-w-full object-contain"
          />
        ) : null}

        {!emojiOnly ? (
          <Typography variant="body1" weight={500} className="break-all whitespace-pre-wrap">
            {enterTextFormatter(comment.content)}
          </Typography>
        ) : null}

        <div className="mt-3 flex w-full items-center justify-between">
          <Typography variant="caption" color={300}>
            {dateFormatting({
              time: comment.updatedAt ?? comment.createdAt,
              customOptions: { dateStyle: "medium" },
            })}
            {comment.updatedAt && comment.updatedAt !== comment.createdAt ? " (수정됨)" : ""}
          </Typography>

          <div className="flex items-center justify-center">
            {type === "DEFAULT" ? (
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center px-2"
                onClick={() =>
                  onReplyClick?.(comment.id, comment.user.id, comment.childCommentCount)
                }
              >
                <IoChatbubbleOutline className="h-4 w-4 text-gray-300" aria-hidden />
                <Typography variant="body3" weight={500} color={500} className="ml-1">
                  {comment.childCommentCount}
                </Typography>
              </button>
            ) : null}

            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2"
              onClick={() => onLikeToggle?.(comment.id)}
            >
              {comment.likedByMe ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                >
                  <IoHeart className="h-4 w-4 text-alertSub" aria-hidden />
                </motion.span>
              ) : (
                <IoHeartOutline className="h-4 w-4 text-gray-300" aria-hidden />
              )}
              <Typography variant="body3" weight={500} color={500} className="ml-1">
                {comment.likeCount}
              </Typography>
            </button>
          </div>
        </div>

        {isReplyOpen && type === "DEFAULT" ? (
          <Typography variant="caption" color={400} className="mt-2">
            {episodeData?.series.title} · 답글 작성 중
          </Typography>
        ) : null}
      </div>
    </div>
  );
}

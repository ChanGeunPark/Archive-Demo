"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cls } from "@/lib/client/utils";
import { allEmoji } from "@/lib/webtoon-demo/coreStaticData";
import type { CommentFilterType } from "@/lib/webtoon-demo/types";
import ChizuButton from "../dashboard/ui/ChizuButton";
import Tooltip from "../dashboard/ui/Tooltip";
import { InformationIcon } from "../dashboard/icons/DashboardIcons";
import { IoHappyOutline } from "react-icons/io5";

type CommentInputBarProps = {
  tabMenu: CommentFilterType;
  onSubmit: (content: string, emojiNumber?: number | null) => void;
  isChildComment?: boolean;
};

export default function CommentInputBar({
  onSubmit,
  isChildComment = false,
}: CommentInputBarProps) {
  const [content, setContent] = useState("");
  const [emojiNumber, setEmojiNumber] = useState<number | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const disabled = content.trim().length < 1 && emojiNumber == null;

  useEffect(() => {
    if (emojiNumber != null && content.trim().length === 0) {
      setContent(" ");
    }
  }, [content, emojiNumber]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) return;
    onSubmit(content, emojiNumber);
    setContent("");
    setEmojiNumber(null);
    setShowEmoji(false);
  };

  return (
    <section
      className={cls(
        "z-[101] h-auto w-full border-t border-gray-50 bg-white px-4 pt-3",
        isChildComment && "bg-gray-50 py-5 pl-12",
      )}
    >
      {!isChildComment ? (
        <div className="mb-1 mt-3 flex items-center">
          <p className="mx-1 text-sm text-gray-600">댓글 입력</p>
          <Tooltip
            horizontal="left"
            icon={<InformationIcon className="h-4 w-4 text-gray-400" />}
          >
            <div className="w-[220px] text-left">
              <p className="text-sm font-medium">댓글은 최대 300자 입력이 가능합니다.</p>
              <p className="text-xs text-gray-500">
                타인에게 불쾌감을 주는 부적절한 내용은 삭제 조치될 수 있습니다.
              </p>
            </div>
          </Tooltip>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="relative flex w-full items-center">
        <div className="relative h-fit w-full">
          <div
            className={cls(
              "my-0 grid max-h-0 grid-flow-row grid-cols-5 gap-3 overflow-auto transition-all duration-200",
              showEmoji && "my-2 max-h-[230px]",
            )}
          >
            {allEmoji.map((emoji) => (
              <button
                key={emoji.emojiIndex}
                type="button"
                onClick={() => {
                  if (emojiNumber === emoji.emojiIndex) {
                    setEmojiNumber(null);
                    return;
                  }
                  setEmojiNumber(emoji.emojiIndex);
                }}
                className={cls(
                  "cursor-pointer",
                  emojiNumber === emoji.emojiIndex &&
                    "[&>img]:border-gray-50 [&>img]:bg-white [&>img]:opacity-100",
                )}
              >
                <Image
                  alt={emoji.name}
                  src={`/images/emoji/${emoji.type}_${emoji.emojiIndex}.png`}
                  width={80}
                  height={80}
                  className="rounded-xl border border-transparent opacity-60 transition-opacity"
                />
              </button>
            ))}
          </div>

          <div className="relative flex h-fit w-full items-center pt-2">
            <div className="flex w-full items-center overflow-hidden rounded-xl border border-gray-50 bg-white">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="h-[40px] flex-1 resize-none px-4 py-2 text-sm text-gray-900 outline-none focus:ring-0"
                placeholder="댓글 내용 입력"
                maxLength={300}
              />
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                  <IoHappyOutline className="h-5 w-5 text-gray-500" aria-hidden />
              </button>
              <ChizuButton
                buttonStyle="PRIMARY"
                buttonSize="MEDIUM"
                type="submit"
                className="h-auto rounded-none py-2.5"
                disabled={disabled}
              >
                등록
              </ChizuButton>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import Typography from "@/components/typography/Typography";
import {
  createComment,
  getCommentsByFilter,
  getReplies,
} from "@/lib/webtoon-demo/commentMockData";
import type { Comment, CommentFilterType, EpisodeDetail } from "@/lib/webtoon-demo/types";
import ChizuButton from "../dashboard/ui/ChizuButton";
import Tabs from "../ui/Tabs";
import CommentInputBar from "./CommentInputBar";
import CommentListItem from "./CommentListItem";

type CommentsClientProps = {
  seoId: string;
  episodeData: EpisodeDetail;
};

const selectableTabMenus = [
  { menu: "POPULAR", title: "인기 댓글" },
  { menu: "VOTER", title: "투표자 댓글" },
  { menu: "ALL", title: "전체 댓글" },
] as const;

export default function CommentsClient({ seoId, episodeData }: CommentsClientProps) {
  const [tabMenu, setTabMenu] = useState<CommentFilterType>("POPULAR");
  const [extraComments, setExtraComments] = useState<Comment[]>([]);
  const [extraReplies, setExtraReplies] = useState<Record<string, Comment[]>>({});
  const [parentCommentId, setParentCommentId] = useState<string | null>(null);
  const [replyViewCount, setReplyViewCount] = useState(5);
  const [likedOverrides, setLikedOverrides] = useState<
    Record<string, { likedByMe: boolean; likeCount: number }>
  >({});

  const baseComments = useMemo(
    () => getCommentsByFilter(episodeData.id, tabMenu),
    [episodeData.id, tabMenu],
  );

  const parentComments = useMemo(() => {
    return [...extraComments, ...baseComments].map((comment) => ({
      ...comment,
      ...(likedOverrides[comment.id] ?? {}),
    }));
  }, [baseComments, extraComments, likedOverrides]);

  const replies = useMemo(() => {
    if (!parentCommentId) return [];
    const base = getReplies(parentCommentId);
    const added = extraReplies[parentCommentId] ?? [];
    return [...base, ...added].map((comment) => ({
      ...comment,
      ...(likedOverrides[comment.id] ?? {}),
    }));
  }, [extraReplies, likedOverrides, parentCommentId]);

  const handleSubmit = (content: string, emojiNumber?: number | null) => {
    const newComment = createComment({
      episodeId: episodeData.id,
      content,
      parentCommentId: parentCommentId ?? undefined,
      emojiNumber,
    });

    if (parentCommentId) {
      setExtraReplies((prev) => ({
        ...prev,
        [parentCommentId]: [...(prev[parentCommentId] ?? []), newComment],
      }));
      return;
    }

    setExtraComments((prev) => [newComment, ...prev]);
    setTabMenu("ALL");
  };

  const handleLikeToggle = (commentId: string) => {
    const findComment = (): Comment | undefined => {
      const fromParent = parentComments.find((item) => item.id === commentId);
      if (fromParent) return fromParent;
      return replies.find((item) => item.id === commentId);
    };

    const target = findComment();
    if (!target) return;

    setLikedOverrides((prev) => ({
      ...prev,
      [commentId]: {
        likedByMe: !target.likedByMe,
        likeCount: target.likedByMe ? target.likeCount - 1 : target.likeCount + 1,
      },
    }));
  };

  return (
    <article className="mx-auto w-full max-w-[620px] pb-10">
      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-100 bg-white px-4">
        <Link
          href={`/demos/webtoon/${seoId}/${episodeData.episodeIndex}`}
          className="mr-3 flex items-center"
        >
          <KeyboardArrowLeftIcon className="fill-gray-800" />
        </Link>
        <Typography variant="body2" weight={600} className="truncate">
          {episodeData.series.title} {episodeData.title}
        </Typography>
      </header>

      <Tabs
        className="justify-center"
        menu={tabMenu}
        selectableMenus={[...selectableTabMenus]}
        onClick={(e) => {
          const menu = (e.currentTarget as HTMLElement).id as CommentFilterType;
          setTabMenu(menu);
          setParentCommentId(null);
        }}
      />

      <CommentInputBar tabMenu={tabMenu} onSubmit={handleSubmit} />

      <section className="w-full">
        {parentComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Typography variant="h6" color={200}>
              첫 번째 댓글의 주인공이 되어보세요!
            </Typography>
          </div>
        ) : null}

        {parentComments.map((comment, index) => (
          <div className="w-full" key={comment.id}>
            <CommentListItem
              comment={comment}
              rank={index}
              type="DEFAULT"
              tabMenu={tabMenu}
              episodeData={episodeData}
              isReplyOpen={parentCommentId === comment.id}
              onReplyClick={(commentId, _userId, childCount) => {
                if (parentCommentId === commentId) {
                  setParentCommentId(null);
                  return;
                }
                setParentCommentId(commentId);
                setReplyViewCount(Math.max(5, childCount + 1));
              }}
              onLikeToggle={handleLikeToggle}
            />

            {parentCommentId === comment.id ? (
              <>
                <section className="w-full">
                  {replies.slice(0, replyViewCount).map((reply, replyIndex) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.01 * replyIndex }}
                    >
                      <CommentListItem
                        comment={reply}
                        type="REPLY"
                        tabMenu={tabMenu}
                        onLikeToggle={handleLikeToggle}
                      />
                    </motion.div>
                  ))}
                </section>

                {replies.length > replyViewCount && replyViewCount === 5 ? (
                  <div className="flex w-full justify-center bg-gray-50 py-2">
                    <ChizuButton
                      buttonSize="MEDIUM"
                      buttonStyle="OUTLINED"
                      onClick={() => setReplyViewCount(replies.length)}
                    >
                      더 보기
                    </ChizuButton>
                  </div>
                ) : null}

                <CommentInputBar tabMenu={tabMenu} isChildComment onSubmit={handleSubmit} />
              </>
            ) : null}
          </div>
        ))}
      </section>
    </article>
  );
}

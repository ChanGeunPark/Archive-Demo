import Image from "next/image";
import Typography from "@/components/typography/Typography";
import CardBox from "../../ui/CardBox";

type DashboardCommentLikeProps = {
  maxWidth: string;
  likeCount: number;
  lastMonthLikeCount: number;
};

export default function DashboardCommentLike({
  maxWidth,
  likeCount,
  lastMonthLikeCount,
}: DashboardCommentLikeProps) {
  return (
    <CardBox px={6}>
      <div className={maxWidth}>
        <Typography variant="body2" color={400}>
          내 댓글은 얼마나 사랑받았을까?
        </Typography>
        <div className="my-4 flex w-full items-end justify-between">
          <Typography variant="h3">
            이번달 받은
            <br />
            좋아요
          </Typography>
          <div className="flex items-center">
            <Typography variant="h3">{likeCount}</Typography>
            <Image
              src="/images/webtoon/comic/dashboard_love.png"
              alt="love"
              width={24}
              height={24}
              className="ml-1"
            />
          </div>
        </div>
        <Typography variant="body1" color={400}>
          지난 달 {lastMonthLikeCount}개
        </Typography>
      </div>
    </CardBox>
  );
}

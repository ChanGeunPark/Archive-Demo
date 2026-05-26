import Link from "next/link";
import type { ReactNode } from "react";
import MasonryImageCard from "../card/MasonryImageCard";
import OrderedMasonry from "../layout/OrderedMasonry";
import { works } from "../chizuData";
import KeyboardArrowRightIcon from "@/components/icons/arrow/KeyboardArrowRightIcon";
import { creatorHandle, DEMO_AUCTION_END_TIME } from "./workUtils";
import { Skeleton } from "./Skeleton";

function OtherWorkItem({
  children,
}: {
  children: ReactNode;
  stdHeight: number;
}) {
  return <article>{children}</article>;
}

const SKELETON_CARD_RATIOS = [
  "4/5",
  "3/4",
  "5/6",
  "4/5",
  "3/5",
  "4/5",
] as const;

function OtherWorksSkeleton() {
  return (
    <section className="mt-[62px] w-full max-w-full">
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-10 w-20 rounded-full" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 pb-9 sm:grid-cols-2 xl:grid-cols-3">
        {SKELETON_CARD_RATIOS.map((ratio, index) => (
          <article key={index} className="overflow-hidden rounded-[12px]">
            <Skeleton
              className="w-full rounded-[12px]"
              style={{ aspectRatio: ratio }}
            />
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-1.5 h-3 w-1/2" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function OtherWorks({
  currentId,
  loading,
}: {
  currentId?: string;
  loading?: boolean;
}) {
  if (loading) {
    return <OtherWorksSkeleton />;
  }

  return (
    <section className="mt-[62px] w-full max-w-full">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">다른 작품</h2>
        <Link
          href="/demos/image-marketplace-flow"
          className="flex h-10 items-center rounded-full px-1 text-[13px] font-semibold text-gray-800 hover:bg-transparent"
        >
          더보기{" "}
          <span className="ml-1">
            <KeyboardArrowRightIcon />
          </span>
        </Link>
      </div>

      <div className="mt-5 pb-9">
        <OrderedMasonry
          className="-ml-5 flex w-auto"
          columnClassName="flex min-w-0 flex-col gap-5 pl-5"
          breakpointCols={{ default: 3, 1280: 2, 1024: 2, 640: 1 }}
        >
          {works
            .filter((work) => work.id !== currentId)
            .slice(0, 6)
            .map((work) => (
              <OtherWorkItem key={work.id} stdHeight={work.height / work.width}>
                <MasonryImageCard
                  imgUrl={work.image}
                  width={work.width}
                  height={work.height}
                  title={work.title}
                  link={`/demos/image-marketplace-flow/work/${work.id}`}
                  buyNowPrice={work.askingPrice || undefined}
                  auctionTime={
                    work.status === "Auction" ? DEMO_AUCTION_END_TIME : null
                  }
                  userProfile={work.owner.avatar}
                  userScreenName={
                    work.owner.handle || creatorHandle(work.artist)
                  }
                  userAddress={work.owner.handle || creatorHandle(work.artist)}
                  userName={work.owner.name}
                />
              </OtherWorkItem>
            ))}
        </OrderedMasonry>
      </div>
    </section>
  );
}

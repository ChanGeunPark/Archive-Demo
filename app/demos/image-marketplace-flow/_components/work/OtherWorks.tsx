import Link from "next/link";
import type { ReactNode } from "react";
import MasonryImageCard from "../card/MasonryImageCard";
import OrderedMasonry from "../layout/OrderedMasonry";
import { works } from "../chizuData";
import KeyboardArrowRightIcon from "@/components/icons/arrow/KeyboardArrowRightIcon";
import { creatorHandle, DEMO_AUCTION_END_TIME } from "./workUtils";

function OtherWorkItem({
  children,
}: {
  children: ReactNode;
  stdHeight: number;
}) {
  return <article>{children}</article>;
}

export default function OtherWorks({ currentId }: { currentId: string }) {
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
                  userScreenName={work.owner.handle || creatorHandle(work.artist)}
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

import type { ReactNode } from "react";
import { useMemo } from "react";
import MasonryImageCard from "../card/MasonryImageCard";
import OrderedMasonry from "../layout/OrderedMasonry";
import type { WorkItem } from "../chizuData";
import { creatorHandle } from "../work/workUtils";
import { getAuctionEndTime } from "./discoverUtils";

function MasonryWorkItem(props: { children: ReactNode; stdHeight: number }) {
  return (
    <article className="min-w-0 rounded-[12px] bg-white">
      {props.children}
    </article>
  );
}

export default function WorkGrid({ works }: { works: WorkItem[] }) {
  const auctionEndTime = useMemo(() => getAuctionEndTime(), []);

  if (works.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-lg border border-[#E6E1D8] bg-white text-sm font-bold text-[#777D84]">
        No works found
      </div>
    );
  }

  return (
    <OrderedMasonry
      className="-ml-5 flex w-auto"
      columnClassName="flex min-w-0 flex-col gap-5 pl-5"
      breakpointCols={{
        default: 5,
        1536: 4,
        1280: 3,
        1024: 2,
        640: 1,
      }}
    >
      {works.map((work) => (
        <MasonryWorkItem key={work.id} stdHeight={work.height / work.width}>
          <MasonryImageCard
            imgUrl={work.image}
            width={work.width}
            height={work.height}
            title={work.title}
            link={`/demos/image-marketplace-flow/work/${work.id}`}
            buyNowPrice={work.status === "Buy now" ? work.price : undefined}
            auctionTime={work.status === "Auction" ? auctionEndTime : null}
            userProfile="/images/chizu/profile_default_180x180_00.png"
            userScreenName={creatorHandle(work.artist)}
            userAddress={work.id}
            userName={work.artist}
          />
        </MasonryWorkItem>
      ))}
    </OrderedMasonry>
  );
}

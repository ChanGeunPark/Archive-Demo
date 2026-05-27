"use client";

import type { ReactNode } from "react";
import MasonryImageCard from "../card/MasonryImageCard";
import OrderedMasonry from "../layout/OrderedMasonry";
import { WorksQueryWork } from "@/lib/image-marketplace-flow/graphql/types";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";

function getStdHeight(width: number, height: number) {
  if (width > 0 && height > 0) {
    return height / width;
  }
  return 1;
}

function MasonryWorkItem({
  children,
  stdHeight,
}: {
  children: ReactNode;
  stdHeight: number;
}) {
  return (
    <article className="min-w-0 rounded-[12px] bg-white" data-std-height={stdHeight}>
      {children}
    </article>
  );
}

export default function WorkGrid({ works }: { works: WorksQueryWork[] }) {
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
        <MasonryWorkItem
          key={work.id}
          stdHeight={getStdHeight(work.width, work.height)}
        >
          <MasonryImageCard
            imgUrl={work.imageUrl}
            width={work.width}
            height={work.height}
            title={work.title}
            workId={work.id}
            link={marketplaceRoutes.work(work.id)}
            buyNowPrice={work.askingPrice ?? undefined}
            userProfile={work.owner.avatar}
            userScreenName={work.owner.handle || work.owner.id}
            userAddress={work.owner.handle || work.owner.id}
          />
        </MasonryWorkItem>
      ))}
    </OrderedMasonry>
  );
}

"use client";

import { useMemo, type ReactNode } from "react";
import OrderedMasonry from "../layout/OrderedMasonry";
import { useWorkGridColumnCount } from "./hooks/useWorkGridColumnCount";
import { WORK_GRID_BREAKPOINT_COLS } from "./workGridBreakpoints";

const SKELETON_ASPECT_RATIOS = [
  { width: 4, height: 5 },
  { width: 3, height: 4 },
  { width: 1, height: 1 },
  { width: 5, height: 4 },
  { width: 2, height: 3 },
] as const;

function MasonrySkeletonItem({
  stdHeight,
  width,
  height,
}: {
  stdHeight: number;
  width: number;
  height: number;
}) {
  return (
    <article
      className="min-w-0 rounded-[12px] bg-white"
      data-std-height={stdHeight}
      aria-hidden
    >
      <div
        style={{ aspectRatio: `${width} / ${height}` }}
        className="w-full animate-[imageNoneBackgroundani_1.3s_ease-out_infinite] rounded-[12px] bg-[#c7c7c7]"
      />
    </article>
  );
}

export function buildWorkGridSkeletonItems(skeletonCount: number): ReactNode[] {
  return Array.from({ length: skeletonCount }, (_, index) => {
    const ratio =
      SKELETON_ASPECT_RATIOS[index % SKELETON_ASPECT_RATIOS.length];

    return (
      <MasonrySkeletonItem
        key={`skeleton-${index}`}
        stdHeight={ratio.height / ratio.width}
        width={ratio.width}
        height={ratio.height}
      />
    );
  });
}

export function useWorkGridSkeletonItems(enabled: boolean) {
  const columnCount = useWorkGridColumnCount();

  return useMemo(
    () =>
      enabled && columnCount != null
        ? buildWorkGridSkeletonItems(columnCount)
        : [],
    [enabled, columnCount],
  );
}

export default function WorkGridSkeleton() {
  const skeletonItems = useWorkGridSkeletonItems(true);

  return (
    <div aria-busy="true" aria-label="작품 목록 불러오는 중">
      <OrderedMasonry
        className="-ml-5 flex w-auto"
        columnClassName="flex min-w-0 flex-col gap-5 pl-5"
        breakpointCols={WORK_GRID_BREAKPOINT_COLS}
      >
        {skeletonItems}
      </OrderedMasonry>
    </div>
  );
}

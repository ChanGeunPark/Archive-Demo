"use client";

import { cls } from "@/lib/client/utils";
import { useEffect, useState } from "react";

type SwipeablePagesProps = {
  children: React.ReactNode;
  initialPageIndex?: number;
  totalPage?: number;
  className?: string;
  onChangePage?: (newPageIndex: number) => void;
};

export default function SwipeablePages({
  children,
  initialPageIndex = 1,
  totalPage = 1,
  className,
  onChangePage,
}: SwipeablePagesProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    onChangePage?.(currentPageIndex);
  }, [currentPageIndex, onChangePage]);

  return (
    <div
      className={cls(className)}
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        const distance = event.changedTouches[0].clientX - touchStart;
        if (Math.abs(distance) < 50) return;
        const next = currentPageIndex + (distance > 0 ? -1 : 1);
        if (next >= 1 && next <= totalPage) {
          setCurrentPageIndex(next);
        }
      }}
    >
      {children}
    </div>
  );
}

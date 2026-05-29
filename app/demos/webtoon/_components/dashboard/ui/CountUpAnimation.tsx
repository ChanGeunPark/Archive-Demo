"use client";

import useCounterUp from "@/lib/webtoon-demo/hooks/useCounterUp";
import { numberWithComma } from "@/lib/webtoon-demo/formatters";

type CountUpAnimationProps = {
  count: number;
  duration?: number;
};

export default function CountUpAnimation({ count, duration }: CountUpAnimationProps) {
  const currentCount = useCounterUp(count, duration);
  return <>{numberWithComma(currentCount)}</>;
}

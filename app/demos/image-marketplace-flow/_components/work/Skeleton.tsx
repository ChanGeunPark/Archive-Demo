import { cls } from "@/lib/client/utils";
import type { CSSProperties } from "react";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={cls("animate-pulse rounded-md bg-zinc-200/90", className)}
    />
  );
}

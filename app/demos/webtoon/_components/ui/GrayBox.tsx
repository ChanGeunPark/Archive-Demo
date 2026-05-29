import { cls } from "@/lib/client/utils";
import type { ReactNode } from "react";

type GrayBoxProps = {
  children: ReactNode;
  className?: string;
  px?: number;
  py?: number | string;
};

export default function GrayBox({ children, className, px = 2, py = 6 }: GrayBoxProps) {
  return (
    <div
      className={cls(
        "relative flex h-auto w-full flex-col overflow-hidden rounded-xl bg-gray-25 text-gray-900",
        px === 4 ? "px-4" : px === 2 ? "px-2" : `px-${px}`,
        py === 0 ? "py-0" : py === 6 ? "py-6" : `py-${py}`,
        className
      )}
    >
      {children}
    </div>
  );
}

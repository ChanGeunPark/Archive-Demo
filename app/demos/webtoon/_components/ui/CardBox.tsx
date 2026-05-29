import { cls } from "@/lib/client/utils";
import type { ReactNode } from "react";

type CardBoxProps = {
  children: ReactNode;
  className?: string;
  px?: number;
  py?: number;
};

export default function CardBox({ children, className, px = 2, py = 6 }: CardBoxProps) {
  return (
    <div
      className={cls(
        "relative flex h-auto w-full flex-col overflow-hidden rounded-xl border-[1.5px] border-gray-50 bg-white text-gray-900 shadow-elevation01 lg:rounded-2xl",
        px === 4 ? "px-4" : px === 6 ? "px-6" : px === 8 ? "px-8" : `px-${px}`,
        py === 6 ? "py-6" : py === 8 ? "py-8" : `py-${py}`,
        className
      )}
    >
      {children}
    </div>
  );
}

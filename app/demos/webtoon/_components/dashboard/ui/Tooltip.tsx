"use client";

import { cls } from "@/lib/client/utils";
import { useState } from "react";

type TooltipProps = {
  horizontal?: "left" | "center" | "right";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Tooltip({
  horizontal = "center",
  icon,
  children,
  className,
}: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={cls("relative flex flex-col", className)}>
      <div
        className="cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((prev) => !prev)}
      >
        {icon}
      </div>
      {show ? (
        <div
          className={cls(
            "absolute top-full z-40 mt-2 w-max max-w-[220px]",
            horizontal === "left" && "left-0",
            horizontal === "center" && "left-1/2 -translate-x-1/2",
            horizontal === "right" && "right-0"
          )}
        >
          <div className="rounded-xl bg-white p-3 text-gray-850 shadow-elevation04">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

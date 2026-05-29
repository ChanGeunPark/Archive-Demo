"use client";

import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import CountUpAnimation from "../ui/CountUpAnimation";
import { RefreshIcon } from "../icons/DashboardIcons";
import LevelBadgeIcon from "./LevelBadgeIcon";

type LevelSystemGraphProps = {
  className?: string;
  level: number;
  currentExp: number;
  expPercentage: number;
  onRefresh?: () => void;
};

export default function LevelSystemGraph({
  className,
  level,
  currentExp,
  expPercentage,
  onRefresh,
}: LevelSystemGraphProps) {
  const [refreshAni, setRefreshAni] = useState(false);

  return (
    <div className={cls("relative flex w-full items-center justify-between space-x-4", className)}>
      <div className="flex items-center">
        <LevelBadgeIcon level={level} />
        <span className="ml-2 text-sm font-bold text-gray-900">Lv.{level}</span>
      </div>

      <button
        type="button"
        className="relative w-full cursor-pointer"
        onClick={() => {
          setRefreshAni(true);
          onRefresh?.();
          setTimeout(() => setRefreshAni(false), 1000);
        }}
      >
        <div className="relative h-[14px] w-full overflow-hidden rounded-full border border-gray-100 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expPercentage}%` }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-primaryMain"
          />
        </div>

        <div className="mt-0.5 flex w-full items-center justify-between px-1">
          <div className="flex items-center space-x-1">
            <p className="text-[9px] font-bold text-gray-600">
              <CountUpAnimation count={currentExp} duration={700} />
            </p>
            <p className="text-[7px] text-gray-600">[{expPercentage}%]</p>
          </div>
          <RefreshIcon
            className={cls("h-3 w-3 text-gray-600", refreshAni ? "animate-spin" : "")}
          />
        </div>
      </button>
    </div>
  );
}

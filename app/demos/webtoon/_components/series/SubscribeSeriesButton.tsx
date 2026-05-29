"use client";

import { cls } from "@/lib/client/utils";
import { motion } from "framer-motion";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";

type SubscribeSeriesButtonProps = {
  isSubscribed: boolean;
  onToggle: () => void;
  title?: string;
  type?: "ICON" | "TEXT";
  className?: string;
};

export default function SubscribeSeriesButton({
  isSubscribed,
  onToggle,
  title = "구독하기",
  type = "TEXT",
  className,
}: SubscribeSeriesButtonProps) {
  if (type === "ICON") {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={cls(
          "relative flex h-8 w-8 items-center justify-center rounded-full bg-black/80 transition hover:bg-black/60",
          className
        )}
        aria-label={isSubscribed ? "구독 중" : "구독하기"}
      >
        {isSubscribed ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <IoNotifications className="h-4 w-4 fill-primaryMain text-primaryMain" />
          </motion.span>
        ) : (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <IoNotificationsOutline className="h-4 w-4 text-white" />
          </motion.span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cls(
        "inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800",
        className
      )}
    >
      {isSubscribed ? (
        <IoNotifications className="h-4 w-4 text-primaryMain" />
      ) : (
        <IoNotificationsOutline className="h-4 w-4" />
      )}
      {!isSubscribed ? title : "구독 중"}
    </button>
  );
}

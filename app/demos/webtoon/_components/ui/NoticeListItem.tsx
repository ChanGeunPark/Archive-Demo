"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import KeyboardArrowDownIcon from "@/components/icons/arrow/KeyboardArrowDownIcon";
import Typography from "@/components/typography/Typography";
import { cls } from "@/lib/client/utils";
import LineDivider from "./LineDivider";

type NoticeListItemProps = {
  index: number;
  type?: string;
  title: string;
  beginAt?: string;
  isRecent?: boolean;
  children: React.ReactNode;
};

export default function NoticeListItem({
  index,
  type,
  title,
  beginAt,
  isRecent,
  children,
}: NoticeListItemProps) {
  const [isShow, setIsShow] = useState(false);

  return (
    <div
      className={cls(
        "rounded-xl border-[1.5px] border-gray-50 bg-white lg:hover:shadow-elevation01"
      )}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between p-4 text-left"
        onClick={() => setIsShow((prev) => !prev)}
      >
        <div className="relative">
          {isRecent ? (
            <div className="absolute -left-1 -top-1 h-1 w-1 rounded-full bg-alertMain" />
          ) : null}
          <Typography variant="h5" color={900}>
            {title}
          </Typography>
          <div className="flex items-center">
            {type ? (
              <Typography variant="caption" color={500} className="mb-1">
                {type}
              </Typography>
            ) : null}
            {beginAt ? (
              <>
                <LineDivider orientation="vertical" className="mx-2 !h-[14px]" />
                <Typography variant="caption" color={500} className="mb-1">
                  {beginAt}
                </Typography>
              </>
            ) : null}
          </div>
        </div>
        <KeyboardArrowDownIcon
          className={cls(
            "ml-1 h-4 w-4 fill-gray-400 transition-all duration-300",
            isShow ? "rotate-180" : ""
          )}
        />
      </button>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isShow ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="whitespace-pre-line px-4 pb-6">
          <Typography variant="body2">{children}</Typography>
        </div>
      </motion.div>
    </div>
  );
}

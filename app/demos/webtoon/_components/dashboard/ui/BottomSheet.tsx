"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cls } from "@/lib/client/utils";
import type { ReactNode } from "react";

type BottomSheetProps = {
  showBottomSheet: boolean;
  showBottomSheetToggler: (open: boolean) => void;
  children: ReactNode;
  title?: string;
};

export default function BottomSheet({
  showBottomSheet,
  showBottomSheetToggler,
  children,
  title,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {showBottomSheet ? (
        <>
          <motion.button
            type="button"
            aria-label="닫기"
            className="fixed inset-0 z-[100] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => showBottomSheetToggler(false)}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[101] mx-auto max-h-[80vh] w-full max-w-[600px] overflow-y-auto rounded-t-2xl bg-white pb-6 shadow-elevation04"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-200" />
            {title ? (
              <h3 className="mt-4 text-center text-lg font-bold text-gray-900">{title}</h3>
            ) : null}
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

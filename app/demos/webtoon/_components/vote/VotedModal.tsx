"use client";

import { AnimatePresence, motion } from "framer-motion";
import Typography from "@/components/typography/Typography";
import ChizuButton from "../dashboard/ui/ChizuButton";

type VotedModalProps = {
  showModal: boolean;
  showModalToggler: (open: boolean) => void;
  onShare: () => void;
  selectionNumber?: number;
};

export default function VotedModal({
  showModal,
  showModalToggler,
  onShare,
  selectionNumber,
}: VotedModalProps) {
  return (
    <AnimatePresence>
      {showModal ? (
        <>
          <motion.button
            type="button"
            aria-label="닫기"
            className="fixed inset-0 z-[80] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => showModalToggler(false)}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 z-[81] mx-auto max-w-[420px] -translate-y-1/2 rounded-2xl bg-white p-6 shadow-elevation04"
            initial={{ opacity: 0, scale: 0.92, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.92, y: "-40%" }}
          >
            <div className="text-center">
              <Typography variant="h3" className="mb-2">
                투표 완료!
              </Typography>
              <Typography variant="body2" color={600} className="mb-6">
                {selectionNumber ? `${selectionNumber}번 선택지에 투표했어요.` : "투표가 반영되었습니다."}
                <br />
                활동 점수가 쌓이고 있어요.
              </Typography>

              <div className="mb-6 rounded-xl bg-primaryMain/20 px-4 py-5">
                <Typography variant="caption" color={600}>
                  기여도 +{selectionNumber ?? 1}
                </Typography>
                <Typography variant="h4">별빛 아래, 우리</Typography>
              </div>

              <div className="flex flex-col gap-2">
                <ChizuButton buttonStyle="PRIMARY" buttonSize="FULL" onClick={onShare}>
                  내 투표 공유하기
                </ChizuButton>
                <ChizuButton
                  buttonStyle="OUTLINED"
                  buttonSize="FULL"
                  onClick={() => showModalToggler(false)}
                >
                  계속 보기
                </ChizuButton>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

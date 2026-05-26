"use client";

import React from "react";
import { motion } from "framer-motion";
import { ImSpinner2 } from "react-icons/im";
import { IoCheckmarkCircle, IoClose, IoCloseCircle } from "react-icons/io5";
import { BaseButton, PrimaryButton } from "../button";
import { cls } from "@/lib/client/utils";

interface BoxContentType {
  title?: string;
  subtitle?: string;
  isForm?: boolean;
  children?: React.ReactNode;

  forwardLink?: string;
  forwardLinkLabel?: string;
  onForward?: (e: React.MouseEvent) => void;
  forwardElement?: React.ReactNode;

  redirectLink?: string;
  redirectLinkLabel?: string;
  onRedirect?: (e: React.MouseEvent) => void;
  redirectElement?: React.ReactNode;

  backLink?: string;
  backLinkLabel?: string;
  onBack?: (e: React.MouseEvent) => void;
  backElement?: React.ReactNode;

  loadingElement?: React.ReactNode;
}

export interface BasicModalProps {
  currentProcess: "INITIAL" | "FAIL" | "LOADING" | "SUCCESS";
  content: BoxContentType;
  successToast?: string;
  showModal: boolean;
  showModalToggler: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const ICON_SIZE = 32;

const fadeUpTransition = {
  duration: 0.35,
  ease: [0.7, 0, 0.3, 1] as const,
};

function ProcessIcon({
  process,
}: {
  process: BasicModalProps["currentProcess"];
}) {
  const iconConfig = {
    FAIL: {
      icon: IoCloseCircle,
      wrapperClassName:
        "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400",
    },
    SUCCESS: {
      icon: IoCheckmarkCircle,
      wrapperClassName:
        "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    LOADING: {
      icon: ImSpinner2,
      wrapperClassName:
        "bg-zinc-50 text-gray-500 dark:bg-zinc-800 dark:text-gray-300",
      spin: true,
    },
  } as const;

  const config = iconConfig[process as keyof typeof iconConfig];
  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div
      className={cls(
        "flex h-16 w-16 items-center justify-center rounded-full",
        config.wrapperClassName,
      )}
    >
      <Icon
        size={ICON_SIZE}
        aria-hidden
        className={cls(
          "shrink-0",
          "spin" in config && config.spin && "animate-spin",
        )}
      />
    </div>
  );
}

function ModalCloseButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      aria-label="닫기"
      onClick={onClick}
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <IoClose size={24} aria-hidden />
    </button>
  );
}

function FormattedSubtitle({ text }: { text: string }) {
  const lines = text.split("\n").filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return <>{text}</>;
  }

  return (
    <span className="flex flex-col gap-1.5">
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>{line}</span>
      ))}
    </span>
  );
}

function ModalHeading({
  process,
  title,
  subtitle,
}: {
  process: BasicModalProps["currentProcess"];
  title?: string;
  subtitle?: string;
}) {
  const hasIcon = process !== "INITIAL";

  if (!hasIcon && !title && !subtitle) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center">
      {hasIcon ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...fadeUpTransition, delay: 0 }}
        >
          <ProcessIcon process={process} />
        </motion.div>
      ) : null}

      {title ? (
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeUpTransition, delay: hasIcon ? 0.06 : 0.02 }}
          className={cls(
            "max-w-[340px] text-pretty text-xl font-black tracking-tight text-gray-900 dark:text-white",
            hasIcon ? "mt-5" : "mt-1",
          )}
        >
          {title}
        </motion.h3>
      ) : null}

      {subtitle ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeUpTransition, delay: hasIcon ? 0.1 : 0.06 }}
          className={cls(
            "max-w-[320px] text-pretty text-sm leading-6 text-gray-500 dark:text-gray-400",
            title ? "mt-2.5" : hasIcon ? "mt-5" : "mt-1",
          )}
        >
          <FormattedSubtitle text={subtitle} />
        </motion.p>
      ) : null}
    </div>
  );
}

export default function BasicModal({
  currentProcess,
  content,
  showModal,
  showModalToggler,
  children,
}: BasicModalProps) {
  if (!showModal && currentProcess !== "LOADING") {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-51 h-screen w-screen">
      <article className="relative flex h-full w-full items-center justify-center px-[28px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.7, 0, 0.3, 1],
          }}
          className="fixed left-0 top-0 z-50 h-screen w-screen bg-[rgba(170,170,170,0.6)] dark:bg-[rgba(65,65,65,0.6)]"
          onClick={currentProcess !== "LOADING" ? showModalToggler : undefined}
        />
        <motion.section
          initial={{ opacity: 0, y: "32px" }}
          animate={{ opacity: 1, y: "0" }}
          transition={{
            duration: 0.4,
            ease: [0.7, 0, 0.3, 1],
          }}
          className="scrollbar-hide z-51 max-h-[80%] w-[480px] max-w-full overflow-y-auto rounded-xl bg-white shadow-elevation04 dark:bg-gray-850 dark:text-white dark:shadow-elevation05"
        >
          <div className="relative h-auto w-full">
            {currentProcess === "INITIAL" ? (
              <ModalCloseButton onClick={showModalToggler} />
            ) : null}

            <div className="pt-[32px]">
              <div
                className={cls(
                  "w-full px-[24px] lg:px-[48px]",
                  currentProcess === "LOADING" ? "mb-[32px]" : "mb-0",
                )}
              >
                <ModalHeading
                  process={currentProcess}
                  title={content.title}
                  subtitle={content.subtitle}
                />

                {content.children ? (
                  <motion.div
                    initial={{ opacity: 0, y: "32px" }}
                    animate={{ opacity: 1, y: "0" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05,
                      ease: [0.7, 0, 0.3, 1],
                    }}
                  >
                    {content.children}
                  </motion.div>
                ) : null}

                {children ? (
                  <motion.div
                    initial={{ opacity: 0, y: "32px" }}
                    animate={{ opacity: 1, y: "0" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05,
                      ease: [0.7, 0, 0.3, 1],
                    }}
                  >
                    {children}
                  </motion.div>
                ) : null}
              </div>
            </div>

            {currentProcess !== "LOADING" ? (
              <motion.div
                initial={{ opacity: 0, y: "32px" }}
                animate={{ opacity: 1, y: "0" }}
                transition={{
                  duration: 0.4,
                  delay: 0.07,
                  ease: [0.7, 0, 0.3, 1],
                }}
                className="mt-[32px] flex w-full flex-col justify-end px-[24px] lg:px-[48px]"
              >
                <div
                  className={cls(
                    content.forwardElement ? "mb-[32px] space-y-3" : "",
                  )}
                >
                  {content.forwardElement}

                  {!content.forwardElement &&
                  (content.forwardLink || content.onForward) ? (
                    <PrimaryButton
                      type="button"
                      buttonSize="FULL"
                      className="mb-[32px] rounded-full"
                      buttonStyle="PRIMARY"
                      onClick={content.onForward}
                      link={content.forwardLink}
                    >
                      {content.forwardLinkLabel ?? "확인"}
                    </PrimaryButton>
                  ) : null}

                  {content.redirectElement}

                  {!content.redirectElement &&
                  (content.redirectLink || content.onRedirect) ? (
                    <BaseButton
                      type="button"
                      buttonSize="FULL"
                      buttonStyle="PRIMARY"
                      className="mb-[32px] rounded-full"
                      onClick={content.onRedirect}
                      link={content.redirectLink}
                    >
                      {content.redirectLinkLabel ?? "동의"}
                    </BaseButton>
                  ) : null}

                  {content.backElement}

                  {!content.backElement &&
                  (content.backLink || content.onBack) ? (
                    <BaseButton
                      type="button"
                      buttonSize="FULL"
                      buttonStyle="OUTLINED"
                      className="mb-[32px] rounded-full dark:border-2 dark:border-gray-800"
                      onClick={content.onBack}
                      link={content.backLink}
                    >
                      {content.backLinkLabel ?? "뒤로"}
                    </BaseButton>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </div>
        </motion.section>
      </article>
    </div>
  );
}

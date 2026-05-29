"use client";

import { cls } from "@/lib/client/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonStyle = "PRIMARY" | "BLACK" | "OUTLINED";
type ButtonSize = "FULL" | "LARGE" | "MEDIUM" | "SMALL";

type ChizuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonStyle?: ButtonStyle;
  buttonSize?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const sizeClass: Record<ButtonSize, string> = {
  FULL: "w-full px-6 py-3 text-base font-bold",
  LARGE: "h-11 px-6 text-base font-bold lg:h-12",
  MEDIUM: "h-8 px-4 text-sm font-bold lg:h-10",
  SMALL: "h-7 px-3 text-sm font-bold",
};

const styleClass: Record<ButtonStyle, string> = {
  PRIMARY: "bg-primaryMain text-gray-900 hover:bg-primaryDark",
  BLACK: "bg-gray-900 text-white hover:bg-gray-800",
  OUTLINED:
    "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 disabled:text-gray-400",
};

export default function ChizuButton({
  buttonStyle = "BLACK",
  buttonSize = "MEDIUM",
  icon,
  children,
  className,
  disabled,
  ...rest
}: ChizuButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cls(
        "inline-flex items-center justify-center gap-2 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60",
        sizeClass[buttonSize],
        styleClass[buttonStyle],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

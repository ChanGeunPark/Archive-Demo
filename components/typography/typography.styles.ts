import type { CSSProperties } from "react";
import {
  FontWeightType,
  SemanticColorType,
  TextPropertyType,
  TextStyleType,
} from "./typography.type";

export const GRAY_COLOR_CLASS: Record<TextPropertyType, string> = {
  900: "text-gray-900 dark:text-white",
  800: "text-gray-800 dark:text-gray-100",
  700: "text-gray-700 dark:text-gray-200",
  600: "text-gray-600 dark:text-gray-300",
  500: "text-gray-500 dark:text-gray-400",
  400: "text-gray-400 dark:text-gray-300",
  300: "text-gray-300 dark:text-gray-500",
  200: "text-gray-200 dark:text-gray-300",
  100: "text-gray-100 dark:text-gray-200",
};

export const SEMANTIC_COLOR_CLASS: Record<SemanticColorType, string> = {
  tertiary: "text-tertiaryDark dark:text-tertiarySub",
  alert: "text-alertMain dark:text-alertSub",
  primary: "text-primaryDark dark:text-primaryMain",
  secondary: "text-secondaryDark dark:text-secondaryMain",
  approve: "text-approveDark dark:text-approveMain",
};

export const FONT_WEIGHT_NUMERIC_CLASS: Record<number, string> = {
  100: "font-thin",
  200: "font-extralight",
  300: "font-light",
  400: "font-normal",
  500: "font-medium",
  600: "font-semibold",
  700: "font-bold",
  800: "font-extrabold",
  900: "font-black",
};

export const FONT_WEIGHT_NAME_CLASS: Record<FontWeightType, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

export const ELLIPSIS_CLASS: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export const WORD_BREAK_CLASS = {
  all: "break-all",
  keep: "break-keep",
  nomal: "break-normal",
  words: "break-words",
} as const;

export const ALIGN_CLASS = {
  inherit: "text-inherit",
  center: "text-center",
  left: "text-left",
  right: "text-right",
} as const;

export const VARIANT_ELEMENT: Record<
  TextStyleType,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  body3: "p",
  caption: "p",
};

const GRAY_COLOR_SCALE = new Set<number>(
  Object.keys(GRAY_COLOR_CLASS).map(Number),
);

export function resolveColorClass(
  color: TextPropertyType | "white" | string = 900,
  darkColor?: TextPropertyType | "white" | string,
): { className: string; style?: CSSProperties } {
  if (color === "white") {
    return { className: "text-white" };
  }

  if (color in SEMANTIC_COLOR_CLASS) {
    return {
      className: SEMANTIC_COLOR_CLASS[color as SemanticColorType],
    };
  }

  const numericColor = Number(color);
  if (!Number.isNaN(numericColor) && GRAY_COLOR_SCALE.has(numericColor)) {
    if (darkColor !== undefined) {
      const numericDarkColor = Number(darkColor);
      if (
        !Number.isNaN(numericDarkColor) &&
        GRAY_COLOR_SCALE.has(numericDarkColor)
      ) {
        const lightClass =
          GRAY_COLOR_CLASS[numericColor as TextPropertyType].split(" ")[0];
        const darkClass = GRAY_COLOR_CLASS[numericDarkColor as TextPropertyType]
          .split(" ")
          .find((token) => token.startsWith("dark:"));

        return {
          className: [lightClass, darkClass].filter(Boolean).join(" "),
        };
      }
    }

    return {
      className: GRAY_COLOR_CLASS[numericColor as TextPropertyType],
    };
  }

  return { className: "", style: { color: color as string | undefined } };
}

export function resolveWeightClass(
  weight?: TextPropertyType | FontWeightType,
): string {
  if (weight === undefined) {
    return "";
  }

  if (typeof weight === "number") {
    return FONT_WEIGHT_NUMERIC_CLASS[weight] ?? "";
  }

  const numericWeight = Number(weight);
  if (!Number.isNaN(numericWeight)) {
    return FONT_WEIGHT_NUMERIC_CLASS[numericWeight] ?? "";
  }

  return FONT_WEIGHT_NAME_CLASS[weight as FontWeightType] ?? "";
}

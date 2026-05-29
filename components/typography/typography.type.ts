import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";

export type TextPropertyType =
  | 900
  | 800
  | 700
  | 600
  | 500
  | 400
  | 300
  | 200
  | 100;

export type TextStyleType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "body3"
  | "caption";

export type FontWeightType =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type SemanticColorType =
  | "tertiary"
  | "alert"
  | "primary"
  | "secondary"
  | "approve";

export type TypographyColor =
  | TextPropertyType
  | SemanticColorType
  | "white"
  | string;

export type TypographyAlign = "inherit" | "center" | "left" | "right";

export type TypographyWordBreak = "all" | "keep" | "nomal" | "words";

export type TypographyEllipsis = 1 | 2 | 3 | 4 | 5 | 6;

export interface TypographyProps
  extends Omit<ComponentPropsWithoutRef<"p">, "color"> {
  children: ReactNode;
  variant: TextStyleType;
  as?: ElementType;
  align?: TypographyAlign;
  truncate?: boolean;
  className?: string;
  weight?: TextPropertyType | FontWeightType;
  /** @deprecated Use `weight` instead. */
  fontWeight?: TextPropertyType | FontWeightType;
  color?: TypographyColor;
  wordBreak?: TypographyWordBreak;
  ellipsis?: TypographyEllipsis;
  style?: CSSProperties;
}

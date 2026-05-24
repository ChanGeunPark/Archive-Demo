import React, { ReactElement } from "react";

export type ButtonSizeType = "FULL" | "LARGE" | "MEDIUM" | "SMALL";

export type ButtonStyleType =
  | "PRIMARY"
  | "PALE"
  | "SECONDARY"
  | "CAUTION"
  | "OUTLINED"
  | "TEXT"
  | "LINK";

export interface CheckNamedType {
  label: string;
  checked?: boolean;
}

export interface GroupButtonType {
  styles?: React.CSSProperties;
  children?: React.ReactElement | React.ReactNode;
}

export interface ButtonProps {
  // React Button Default props
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  target?: string;

  // Design system props
  buttonSize?: ButtonSizeType;
  buttonStyle?: ButtonStyleType;
  disabled?: boolean;
  link?: string;
}

// export interface TagButtonStyle {
//   styles?: React.CSSProperties;
//   children?: React.ReactNode;
//   className?: string;
//   buttonStyle?: React.CSSProperties;
//   tagImg?: string;
//   tagStyle?: React.CSSProperties;
// }

export interface IMainUIProps {
  moveToPage: () => void;
  className?: string;
}

export interface CopyButtonIProps {
  children?: string;
  onClick?: () => void;
  className?: string;
}

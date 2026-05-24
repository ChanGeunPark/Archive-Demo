import { cls } from "@/lib/client/utils";
import { createElement } from "react";
import { TypographyProps } from "./typography.type";
import {
  ALIGN_CLASS,
  ELLIPSIS_CLASS,
  resolveColorClass,
  resolveWeightClass,
  VARIANT_ELEMENT,
  WORD_BREAK_CLASS,
} from "./typography.styles";

function Typography(props: TypographyProps) {
  const {
    variant,
    children,
    className,
    align = "inherit",
    weight,
    fontWeight,
    color = 900,
    darkColor,
    truncate = false,
    wordBreak,
    ellipsis,
    style,
    ...rest
  } = props;

  const resolvedWeight = weight ?? fontWeight;
  const { className: colorClassName, style: colorStyle } = resolveColorClass(
    color,
    darkColor
  );

  const styleClass = cls(
    colorClassName,
    variant,
    ALIGN_CLASS[align],
    resolveWeightClass(resolvedWeight),
    wordBreak ? WORD_BREAK_CLASS[wordBreak] : "",
    truncate && "truncate max-w-full",
    ellipsis ? ELLIPSIS_CLASS[ellipsis] : "",
    className
  );

  return createElement(
    VARIANT_ELEMENT[variant],
    {
      ...rest,
      className: styleClass,
      style: { ...colorStyle, ...style },
    },
    children
  );
}

export default Typography;

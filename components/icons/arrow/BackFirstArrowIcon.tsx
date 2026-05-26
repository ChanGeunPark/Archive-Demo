import React from "react";
import { IconProps } from "../iconProps";
function BackFirstArrowIcon({
  width = 24,
  height = 24,
  fill,
  ...rest
}: IconProps) {
  const _fill = fill ? fill : fill == "" ? "" : "#000000";
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={_fill}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4102 7.41L12.8302 12L17.4102 16.59L16.0002 18L10.0002 12L16.0002 6L17.4102 7.41Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4102 7.41L7.83016 12L12.4102 16.59L11.0002 18L5.00016 12L11.0002 6L12.4102 7.41Z"
      />
    </svg>
  );
}

export default BackFirstArrowIcon;

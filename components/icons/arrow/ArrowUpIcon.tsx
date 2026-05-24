import React from "react";
import { IconProps } from "../iconProps";

function ArrowUpIcon({ width = 24, height = 24, fill, ...rest }: IconProps) {
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
        d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"
      />
    </svg>
  );
}

export default ArrowUpIcon;

import React from "react";
import { IconProps } from "../iconProps";

function KeyboardArrowDownIcon({
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
        d="M7.41 7.84L12 12.42L16.59 7.84L18 9.25L12 15.25L6 9.25L7.41 7.84Z"
      />
    </svg>
  );
}

export default KeyboardArrowDownIcon;

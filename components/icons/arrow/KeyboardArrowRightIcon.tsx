import React from "react";
import { IconProps } from "../iconProps";

function KeyboardArrowRightIcon({
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
      viewBox="0 0 20 20"
      fill={_fill}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.1582 13.6166L10.9749 9.79163L7.1582 5.96663L8.3332 4.79163L13.3332 9.79163L8.3332 14.7916L7.1582 13.6166Z"
      />
    </svg>
  );
}

export default KeyboardArrowRightIcon;

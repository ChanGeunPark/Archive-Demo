import React from "react";
import { IconProps } from "../iconProps";

function KeyboardArrowLeftIcon({
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
        d="M12.8418 5.96663L9.02513 9.79163L12.8418 13.6166L11.6668 14.7916L6.6668 9.79163L11.6668 4.79163L12.8418 5.96663Z"
      />
    </svg>
  );
}

export default KeyboardArrowLeftIcon;

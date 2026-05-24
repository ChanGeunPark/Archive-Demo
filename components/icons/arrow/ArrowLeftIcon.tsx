import React from "react";
import { IconProps } from "../iconProps";

function ArrowLeftIcon({ width = 24, height = 24, fill, ...rest }: IconProps) {
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
      <path d="M16.6668 9.16671H6.52516L11.1835 4.50837L10.0002 3.33337L3.3335 10L10.0002 16.6667L11.1752 15.4917L6.52516 10.8334H16.6668V9.16671Z" />
    </svg>
  );
}

export default ArrowLeftIcon;

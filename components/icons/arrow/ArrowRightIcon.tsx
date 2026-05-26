import { IconProps } from "../iconProps";

function ArrowRightIcon({ width = 24, height = 24, fill, ...rest }: IconProps) {
  const _fill = fill ? fill : fill == "" ? "" : "#000000";
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill={_fill}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.50008 2.66675L7.56008 3.60675L11.2801 7.33341H3.16675V8.66675H11.2801L7.56008 12.3934L8.50008 13.3334L13.8334 8.00008L8.50008 2.66675Z"
      />
    </svg>
  );
}
export default ArrowRightIcon;

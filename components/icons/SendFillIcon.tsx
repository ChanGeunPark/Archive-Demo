import { IconProps } from "@/components/icons/iconProps";

function SendFillIcon({
  width = 24,
  height = 24,
  fill = "#000000",
  ...rest
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M4.38806 19.4156C3.72892 19.6931 3 19.2091 3 18.4939V14.7808C3 14.3219 3.3123 13.9219 3.75746 13.8106L11 12L3.75746 10.1894C3.3123 10.0781 3 9.67809 3 9.21922V5.50608C3 4.7909 3.72892 4.30691 4.38806 4.58445L19.8111 11.0784C20.627 11.4219 20.627 12.5781 19.8111 12.9216L4.38806 19.4156Z" />
    </svg>
  );
}

export default SendFillIcon;

import Link from "next/link";
import React from "react";
import { cls } from "@/lib/client/utils";
import { ButtonProps } from "../button.types";
import ChizuBtnCollor from "../../../../styles/chizuButtonColor.module.css";

function PrimaryButton({
  // React Button Default props
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseOut,
  children,
  type,
  target,
  // Design system props
  buttonSize,
  buttonStyle,
  disabled,
  link,
}: ButtonProps) {
  // primary
  const colorClassName = ChizuBtnCollor.primary;
  const disabledColorClassName = "";

  const linkClassName = buttonSize == "FULL" ? "w-full" : undefined;

  const getSizeClassName = () => {
    switch (buttonSize) {
      case "FULL":
        return "w-full h-[48px] px-[24px] h5";
      case "LARGE":
        return "h-[48px] px-[24px] h5";
      case "MEDIUM":
        return "h-[40px] px-[16px] h6";
      case "SMALL":
        return "h-[28px] px-[12px] text-[13px]";
      default:
        return "w-full h-[48px] px-[24px] text-[16px]";
    }
  };

  const buttonElement = (
    <button
      className={cls(
        //size
        getSizeClassName(),
        disabled ? disabledColorClassName : colorClassName,
        //defult style
        `transition-all duration-200 ${className}`,
      )}
      type={disabled ? "button" : type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onMouseEnter}
      onMouseOut={disabled ? undefined : onMouseOut}
    >
      {children}
    </button>
  );

  if (link) {
    return (
      <Link href={link}>
        <a target={target} className={linkClassName}>
          {" "}
          {buttonElement}
        </a>
      </Link>
    );
  } else {
    return buttonElement;
  }
}

export default PrimaryButton;

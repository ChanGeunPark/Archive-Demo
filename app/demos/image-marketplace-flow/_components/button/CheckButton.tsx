import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cls } from "@/lib/client/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface CheckBtnProps {
  id: string;
  title?: string;
  children?: React.ReactNode;
  register?: UseFormRegisterReturn;
  [key: string]: unknown;
}

function CheckButton({
  id,
  title,
  children,
  register,
  ...rest
}: CheckBtnProps) {
  const mocRef = useRef<HTMLInputElement>(null);
  return (
    <span className="group inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        className="peer hidden"
        {...register}
        {...rest}
      />
      <label
        htmlFor={id}
        className={cls(
          "cursor-pointer transition-all flex items-center justify-center text-bold [&>svg]:stroke-transparent w-[18px] h-[18px] border-neutralLight border-2 rounded-sm",
          " peer-checked:border-none peer-checked:bg-[#F3CC00] peer-checked:text-white peer-checked:[&>svg]:stroke-white",
          "group-hover:border-[#F3CC00]",
        )}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3 stroke-2"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.00016 16.17L4.83016 12L3.41016 13.41L9.00016 19L21.0002 7L19.5902 5.59L9.00016 16.17Z"
            fill="white"
          />
        </svg>
      </label>
      <label htmlFor={id} className="body2-500 ml-2 cursor-pointer">
        {title}
        {children}
      </label>
    </span>
  );
}

export default CheckButton;

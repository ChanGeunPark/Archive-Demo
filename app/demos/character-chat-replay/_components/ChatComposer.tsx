"use client";

import { FormEvent } from "react";
import SendFillIcon from "@/components/icons/SendFillIcon";

type ChatComposerProps = {
  disabled: boolean;
  inputText: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatComposer({
  disabled,
  inputText,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[90px] flex-shrink-0 items-center gap-2 bg-white px-4"
    >
      <input
        value={inputText}
        onChange={(event) => onChange(event.target.value.slice(0, 300))}
        placeholder="채팅 내용 입력"
        className="min-h-12 w-full rounded-xl border-2 border-[#F4F5F6] bg-white p-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
      />
      <button
        type="submit"
        disabled={disabled}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#17191C] text-sm font-bold text-white disabled:bg-[#D8DBDE]"
      >
        <SendFillIcon width={24} height={24} fill="#FFFFFF" />
      </button>
    </form>
  );
}

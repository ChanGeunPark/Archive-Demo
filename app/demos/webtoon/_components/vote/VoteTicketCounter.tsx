"use client";

import { cls } from "@/lib/client/utils";
import { IoAdd, IoRemove } from "react-icons/io5";

type VoteTicketCounterProps = {
  min?: number;
  max: number;
  ticketCount: number;
  setTicketCount: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
};

export default function VoteTicketCounter({
  min = 1,
  max,
  ticketCount,
  setTicketCount,
  className,
}: VoteTicketCounterProps) {
  const buttonStyle =
    "flex h-8 w-8 shrink-0 items-center justify-center bg-gray-100 disabled:opacity-40";

  return (
    <div
      className={cls(
        "flex w-[120px] items-center justify-between overflow-hidden rounded-md border-[1.5px] border-gray-200 bg-white",
        className,
      )}
    >
      <button
        type="button"
        disabled={ticketCount <= min}
        className={buttonStyle}
        onClick={() => setTicketCount((count) => Math.max(min, count - 1))}
      >
        <IoRemove className="h-4 w-4 text-gray-900" aria-hidden />
      </button>

      <span className="flex w-full items-center justify-center text-sm font-bold text-gray-900">
        {ticketCount}
        <span className="ml-0.5 text-sm font-normal text-gray-600">장</span>
      </span>

      <button
        type="button"
        disabled={ticketCount >= max}
        className={buttonStyle}
        onClick={() => setTicketCount((count) => Math.min(max, count + 1))}
      >
        <IoAdd className="h-4 w-4 text-gray-900" aria-hidden />
      </button>
    </div>
  );
}

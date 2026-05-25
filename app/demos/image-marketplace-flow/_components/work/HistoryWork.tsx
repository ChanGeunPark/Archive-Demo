import Image from "next/image";
import type { WorkItem } from "../chizuData";
import { formatEth } from "./workUtils";

export default function HistoryWork({ work }: { work: WorkItem }) {
  return (
    <section className="mt-[62px] w-full">
      <h2 className="text-xl font-black text-gray-900">히스토리</h2>
      <div className="mt-4 flex max-h-[350px] w-full flex-col overflow-y-auto rounded-xl border border-[#EBEBEB] bg-white">
        {[
          ["민팅됨", work.artist, "방금 전"],
          ["리스팅됨", formatEth(work.price), "오늘"],
          ["컬렉션에 추가됨", "Signal Garden", "어제"],
        ].map(([label, value, date]) => (
          <div
            key={`${label}-${value}`}
            className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
          >
            <div className="flex min-w-0 items-center">
              <Image
                src="/images/chizu/profile_default_180x180_00.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {label}
                </p>
                <p className="truncate text-xs text-gray-500">{value}</p>
              </div>
            </div>
            <span className="shrink-0 text-xs text-gray-400">{date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

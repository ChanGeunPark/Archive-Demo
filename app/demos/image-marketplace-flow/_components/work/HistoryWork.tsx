import Image from "next/image";
import type { WorkItem } from "../chizuData";
import { formatKrw } from "./workUtils";

export default function HistoryWork({ work }: { work: WorkItem }) {
  return (
    <section className="mt-[62px] w-full">
      <h2 className="text-xl font-black text-gray-900">히스토리</h2>
      <div className="mt-4 flex max-h-[350px] w-full flex-col overflow-y-auto rounded-xl border border-[#EBEBEB] bg-white">
        {[
          ["작품 등록", work.creator.name, "처음"],
          [
            work.owner.id === work.creator.id ? "판매 등록" : "소유권 이전",
            work.lastSalePrice ? formatKrw(work.lastSalePrice) : formatKrw(work.price),
            "오늘",
          ],
          ["현재 소유자", work.owner.name, "최신"],
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

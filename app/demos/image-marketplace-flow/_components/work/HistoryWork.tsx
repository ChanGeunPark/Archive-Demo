import Image from "next/image";
import { formatKrw } from "./workUtils";
import { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { Skeleton } from "./Skeleton";

function HistoryWorkSkeleton() {
  return (
    <section className="mt-[62px] w-full">
      <Skeleton className="h-7 w-20" />
      <div className="mt-4 flex max-h-[350px] w-full flex-col overflow-hidden rounded-xl border border-[#EBEBEB] bg-white">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="ml-3 min-w-0 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1.5 h-3 w-32" />
              </div>
            </div>
            <Skeleton className="ml-3 h-3 w-10 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HistoryWork({
  work,
  loading,
}: {
  work?: Work | null;
  loading?: boolean;
}) {
  if (loading || !work) {
    return <HistoryWorkSkeleton />;
  }

  return (
    <section className="mt-[62px] w-full">
      <h2 className="text-xl font-black text-gray-900">히스토리</h2>
      <div className="mt-4 flex max-h-[350px] w-full flex-col overflow-y-auto rounded-xl border border-[#EBEBEB] bg-white">
        {[
          ["작품 등록", work.creator.name, "처음"],
          [
            work.owner.id === work.creator.id ? "판매 등록" : "소유권 이전",
            work.lastSalePrice
              ? formatKrw(work.lastSalePrice)
              : formatKrw(work.askingPrice ?? 0),
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
                src="/images/marketplace/profile/profile_default_180x180_00.jpg"
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

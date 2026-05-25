import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "../chizuData";
import { creatorHandle, formatEth } from "./workUtils";

export default function WorkPriceBlock({ work }: { work: WorkItem }) {
  const isAuction = work.status === "Auction";
  const isOffer = work.status === "Offer";
  const priceLabel = isAuction
    ? "현재 입찰가"
    : isOffer
      ? "제안 가능"
      : "즉시 구매가";
  const ctaLabel = isAuction ? "입찰하기" : isOffer ? "제안하기" : "구매하기";
  const priceDisplay = isOffer ? "Make offer" : formatEth(work.price);

  return (
    <section className="order-2 flex w-full flex-col lg:sticky lg:top-20 lg:w-[365px] lg:self-start lg:px-6 max-lg:order-3">
      <div className="mt-8 flex w-full flex-col max-lg:mt-0">
        <div className="max-lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                작품
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                {work.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                by{" "}
                <span className="font-semibold text-gray-700">
                  {work.artist}
                </span>
              </p>
            </div>
            {isAuction ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FFEDEC] px-3 py-1.5 text-xs font-bold text-[#EE4553]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EE4553] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EE4553]" />
                </span>
                Live
              </span>
            ) : null}
          </div>
        </div>

        <article className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_30px_rgba(20,20,22,0.06)] max-lg:mt-0">
          <div className="border-t border-zinc-100 px-5 py-4">
            <p className="text-xs font-medium text-gray-500">라이선스</p>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5">
              <span className="text-xs font-bold text-gray-800">
                Personal License
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-gray-500">
                ?
              </span>
            </span>
          </div>

          <div className="border-t border-zinc-100 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/@${creatorHandle(work.artist)}`}
                className="group rounded-xl bg-zinc-50 p-3 transition hover:bg-zinc-100"
              >
                <p className="text-[11px] font-medium text-gray-500">제작자</p>
                <div className="mt-2 flex items-center gap-2">
                  <Image
                    src="/images/chizu/profile_default_180x180_00.png"
                    alt={`${work.artist} profile`}
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                  />
                  <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                    {work.artist}
                  </p>
                </div>
              </Link>

              <Link
                href={`/@${creatorHandle(work.artist)}`}
                className="group rounded-xl bg-zinc-50 p-3 transition hover:bg-zinc-100"
              >
                <p className="text-[11px] font-medium text-gray-500">소유자</p>
                <div className="mt-2 flex items-center gap-2">
                  <Image
                    src="/images/chizu/profile_default_180x180_01.png"
                    alt="owner profile"
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                  />
                  <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                    {work.artist} Collector
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </article>

        <article className="mt-5">
          {isAuction ? (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#FFEDEC] py-2.5 text-sm font-bold text-[#EE4553] lg:hidden">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EE4553] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EE4553]" />
              </span>
              경매 진행 중
            </div>
          ) : null}

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs font-medium text-gray-500">{priceLabel}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-gray-900">
              {priceDisplay}
            </p>
          </div>

          <button
            type="button"
            className="mt-4 h-12 w-full rounded-xl bg-[#141416] text-sm font-bold text-white transition hover:bg-[#FFE55C] hover:text-black active:scale-[0.98]"
          >
            {ctaLabel}
          </button>
        </article>
      </div>
    </section>
  );
}

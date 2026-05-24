"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import MasonryImageCard from "./card/MasonryImageCard";
import OrderedMasonry from "./layout/OrderedMasonry";
import { works, type WorkItem } from "./chizuData";
import KeyboardArrowRightIcon from "@/components/icons/arrow/KeyboardArrowRightIcon";

const DEMO_AUCTION_END_TIME = "2026-12-31T15:00:00.000Z";

function formatEth(price: number) {
  return `${(price / 1_000_000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} ETH`;
}

function creatorHandle(artist: string) {
  return artist.toLowerCase().replaceAll(" ", "");
}

function WorkPriceBlock({ work }: { work: WorkItem }) {
  const isAuction = work.status === "Auction";

  return (
    <section className="order-2 flex w-full flex-col lg:w-[365px] lg:px-6 max-lg:order-3">
      <div className="mt-8 flex w-full flex-col max-lg:mt-0">
        <div className="max-lg:hidden">
          <p className="text-sm font-semibold text-gray-400">작품</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">
            {work.title}
          </h1>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            by {work.artist}
          </p>
        </div>

        <article className="mt-8 overflow-hidden rounded-xl border border-[#EBEBEB] bg-white">
          <div className="flex h-[52px] items-center justify-between px-4">
            <h2 className="text-sm font-semibold text-gray-500">
              라이선스 및 소유권
            </h2>
          </div>

          <div className="border-t border-gray-100 px-4 py-[21px]">
            <div className="flex w-full pb-2">
              <span className="mt-1 inline-flex items-center text-left text-sm font-bold text-gray-800 underline underline-offset-2">
                Personal License
                <span className="ml-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#939FB6] text-[11px] text-[#939FB6]">
                  ?
                </span>
              </span>
            </div>

            <div className="mt-3 w-full">
              <h3 className="w-full text-xs font-medium text-gray-500">
                제작자
              </h3>
              <Link
                href={`/@${creatorHandle(work.artist)}`}
                className="mt-2 inline-flex w-full max-w-full flex-row items-center rounded-lg transition-all"
              >
                <Image
                  src="/images/chizu/profile_default_180x180_00.png"
                  alt={`${work.artist} profile`}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full"
                />
                <p className="ml-[6px] truncate text-sm font-semibold text-gray-800">
                  {work.artist}
                </p>
              </Link>
            </div>

            <div className="mt-6 w-full">
              <p className="w-full text-xs font-medium text-gray-500">소유자</p>
              <Link
                href={`/@${creatorHandle(work.artist)}`}
                className="mt-2 inline-flex w-full flex-row items-center rounded-lg transition-all"
              >
                <Image
                  src="/images/chizu/profile_default_180x180_01.png"
                  alt="owner profile"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full"
                />
                <p className="ml-[0.375rem] truncate text-sm font-semibold text-gray-800">
                  {work.artist} Collector
                </p>
              </Link>
            </div>
          </div>
        </article>

        {isAuction ? (
          <div className="mt-5 flex w-full items-center justify-center rounded-[12px] bg-[#FFEDEC] px-3 py-3 text-center text-lg font-black text-[#EE4553] max-lg:mt-0">
            <span className="relative mr-2 flex h-[13px] w-[13px] -translate-y-[1px] items-center justify-center">
              <span className="absolute inline-flex h-[13px] w-[13px] animate-ping rounded-full bg-[#EE4553] opacity-75" />
              <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#EE4553]" />
            </span>
            경매 진행 중
          </div>
        ) : null}
      </div>

      <article className="mt-5 rounded-xl border border-[#EBEBEB] bg-white p-4">
        <p className="text-xs font-semibold text-gray-500">
          {isAuction
            ? "현재 입찰가"
            : work.status === "Offer"
              ? "제안 가능"
              : "즉시 구매가"}
        </p>
        <p className="mt-2 text-3xl font-black text-gray-900">
          {work.status === "Offer" ? "Make offer" : formatEth(work.price)}
        </p>
        <button className="mt-4 h-12 w-full rounded-full bg-[#141416] text-sm font-black text-white transition hover:bg-[#FFE55C] hover:text-black">
          {isAuction
            ? "입찰하기"
            : work.status === "Offer"
              ? "제안하기"
              : "구매하기"}
        </button>
      </article>
    </section>
  );
}

function WorkContentsDetail({ work }: { work: WorkItem }) {
  return (
    <section className="w-full">
      <div className="hidden max-lg:block">
        <p className="text-sm font-semibold text-gray-400">작품</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">{work.title}</h1>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          by {work.artist}
        </p>
      </div>
      <h2 className="text-sm font-semibold text-gray-500 max-lg:hidden">
        상세
      </h2>
      <p className="mt-[10px] mb-3 text-base font-medium leading-7 text-gray-800">
        {work.title}는 Chizu 아카이브 데모를 위해 구성된 이미지 작품입니다.
        라이선스, 소유자, 태그, 히스토리 정보가 한 화면에서 이어지도록 WorkUI의
        상세 페이지 흐름을 따릅니다.
      </p>

      <article className="mt-6 border-t-2 border-gray-100 pt-6 max-lg:mt-4 max-lg:pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex w-fit items-center rounded-lg border-[1.5px] border-gray-100 px-2 py-1 max-lg:mb-2 max-lg:w-full">
            <p className="mr-2 text-xs font-medium text-gray-500">collection</p>
            <Link
              href="/demos/image-marketplace-flow"
              className="inline-flex max-w-full flex-row items-center transition-all"
            >
              <Image
                src="/images/chizu/cover_default_1.png"
                alt="collection"
                width={20}
                height={20}
                className="h-5 w-5 rounded-md object-cover"
              />
              <p className="ml-[6px] truncate text-sm font-semibold text-gray-800 hover:text-gray-600">
                Signal Garden
              </p>
            </Link>
          </div>

          <div className="flex flex-row items-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#05A67B] text-xs font-black text-white">
              ✓
            </span>
            <p className="ml-1 text-xs font-semibold text-gray-700">All age</p>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-wrap items-center gap-x-2 gap-y-3 text-gray-800">
          {work.tags.map((tag) => (
            <Link
              key={tag}
              href="/demos/image-marketplace-flow"
              className="inline-flex rounded-full bg-[#F3F4F8] px-3 py-1 text-xs font-semibold text-gray-800 transition hover:bg-[#FFE55C]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}

function HistoryWork({ work }: { work: WorkItem }) {
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

function OtherWorks({ currentId }: { currentId: string }) {
  function OtherWorkItem({
    children,
  }: {
    children: ReactNode;
    stdHeight: number;
  }) {
    return <article>{children}</article>;
  }

  return (
    <section className="mt-[62px] w-full max-w-full">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">다른 작품</h2>
        <Link
          href="/demos/image-marketplace-flow"
          className="flex h-10 items-center rounded-full px-1 text-[13px] font-semibold text-gray-800 hover:bg-transparent"
        >
          더보기{" "}
          <span className="ml-1">
            <KeyboardArrowRightIcon />
          </span>
        </Link>
      </div>

      <div className="mt-5 pb-9">
        <OrderedMasonry
          className="-ml-5 flex w-auto"
          columnClassName="flex min-w-0 flex-col gap-5 pl-5"
          breakpointCols={{ default: 3, 1280: 2, 1024: 2, 640: 1 }}
        >
          {works
            .filter((work) => work.id !== currentId)
            .slice(0, 6)
            .map((work) => (
              <OtherWorkItem key={work.id} stdHeight={work.height / work.width}>
                <MasonryImageCard
                  imgUrl={work.image}
                  width={work.width}
                  height={work.height}
                  title={work.title}
                  link={`/demos/image-marketplace-flow/work/${work.id}`}
                  buyNowPrice={
                    work.status === "Buy now" ? work.price : undefined
                  }
                  auctionTime={
                    work.status === "Auction" ? DEMO_AUCTION_END_TIME : null
                  }
                  userProfile="/images/chizu/profile_default_180x180_00.png"
                  userScreenName={creatorHandle(work.artist)}
                  userName={work.artist}
                />
              </OtherWorkItem>
            ))}
        </OrderedMasonry>
      </div>
    </section>
  );
}

export default function ChizuWorkMain({ work }: { work: WorkItem }) {
  return (
    <main className="min-h-screen bg-white text-[#141416]">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-10">
          <Link
            href="/demos/image-marketplace-flow"
            className="text-xl font-black tracking-tight"
          >
            CHIZU
          </Link>
          <Link
            href="/demos/image-marketplace-flow"
            className="h-10 rounded-md border border-[#D8DBDE] bg-white px-3 py-2 text-sm font-bold text-[#3F444B] transition hover:border-[#17191C]"
          >
            Discover
          </Link>
        </div>
      </header>

      <div className="container mx-auto">
        <div className="h-full w-full">
          <div className="flex w-full justify-center overflow-hidden max-w-full lg:hidden">
            <figure className="w-full bg-white">
              <Image
                src={work.image}
                height={work.height}
                width={work.width}
                className="h-auto !w-full !object-contain bg-white"
                alt={work.title}
              />
            </figure>
          </div>

          <article className="mx-auto flex flex-wrap px-[24px] lg:px-[96px] max-lg:flex-col">
            <label className="order-1 flex w-[calc(100%-365px)] cursor-pointer justify-center overflow-hidden bg-white max-w-full max-lg:w-full">
              <figure className="relative flex h-[90vh] w-full  items-center justify-center transition-all max-lg:hidden bg-zinc-100">
                <div
                  className="relative mx-auto block max-h-full max-w-full"
                  style={{
                    aspectRatio: `${work.width}/${work.height}`,
                    width: work.width > work.height ? "100%" : "auto",
                    height: work.width > work.height ? "auto" : "100%",
                  }}
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(min-width: 1024px) calc(100vw - 560px), 100vw"
                    className="object-contain"
                  />
                </div>
              </figure>
            </label>

            <WorkPriceBlock work={work} />

            <section className="order-3 mt-14 w-[calc(100%-365px)] max-lg:order-2 max-lg:mt-6 max-lg:w-full">
              <WorkContentsDetail work={work} />
            </section>

            <div className="order-4 w-[calc(100%-365px)] max-lg:w-full">
              <HistoryWork work={work} />
              <OtherWorks currentId={work.id} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

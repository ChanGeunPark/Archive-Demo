"use client";

import Link from "next/link";
import { MasonryImgProps } from "../types";
import { useState } from "react";
import Image from "next/image";
import { cls } from "@/lib/client/utils";

function formatKrw(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function MasonryImageCard({
  imgUrl,
  width,
  height,
  title,
  link,
  userProfile,
  userScreenName,
  userAddress,
  userName,
  ethClass,
  children,
  auctionTime,
  buyNowPrice,
}: MasonryImgProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const isLandscape = !!(width && height && width > height);

  // Auction Setting
  const assetAuctionTime = new Date(auctionTime ? auctionTime : "");
  const currentTime = new Date();
  const isAuction = assetAuctionTime > currentTime ? true : false;
  const hasActionPrice = isAuction || !!buyNowPrice;

  return (
    <>
      {imgUrl && (
        <div
          style={{
            aspectRatio: width && height ? `${width} / ${height}` : undefined,
          }}
          className={cls(
            "group/card relative w-full cursor-pointer overflow-hidden rounded-[12px] transition-shadow duration-200 hover:shadow-[0_16px_32px_rgba(20,20,22,0.16)]",
            loaded
              ? "bg-transparent"
              : "animate-[imageNoneBackgroundani_1.3s_ease-out_infinite]",
          )}
        >
          <figure className="w-full h-full rounded-[11px] overflow-hidden relative">
            <Image
              fill
              onLoad={() => setLoaded(true)}
              className={cls(
                "h-full w-full rounded-lg object-cover [backface-visibility:hidden] [image-rendering:-webkit-optimize-contrast]",
                loaded
                  ? "bg-white transition-all duration-300 ease-in-out group-hover/card:scale-[1.13]"
                  : "",
              )}
              blurDataURL={imgUrl}
              src={imgUrl}
              alt={`${title} image`}
              sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
            />
          </figure>
          <div className="absolute left-0 top-0 z-[2] h-full w-full rounded-[11px] bg-[rgba(0,0,0,0.02)]" />
          <div className="w-full z-30 flex justify-end items-center p-2 absolute left-0 top-0">
            {children}
          </div>

          {link ? (
            <Link
              href={`${link}`}
              className="w-full h-full absolute left-0 top-0 z-10 bg-transparent"
              aria-label={title ? `View ${title}` : "View image"}
            />
          ) : null}

          {userScreenName ? (
            <div
              style={{
                maxWidth: isLandscape && !hasActionPrice ? "50%" : undefined,
              }}
              className={cls(
                "absolute bottom-3 right-3 z-20 flex h-fit w-[calc(100%-24px)] items-center justify-between overflow-hidden rounded-[26px] bg-[rgba(0,0,0,.4)] px-2 py-[6px] backdrop-blur-[10px]",
                "transition-all duration-300 ease-in-out group-hover/card:!bg-[rgba(0,0,0,.8)]",
                "max-lg:bottom-1 max-lg:right-1 max-lg:w-[calc(100%-8px)] max-lg:!max-w-[100%] max-lg:flex-col max-lg:items-stretch max-lg:justify-center max-lg:rounded-[12px] max-lg:px-1",
              )}
            >
              <Link
                href={`/@${userAddress || userScreenName}`}
                className={cls(
                  "block h-fit overflow-hidden",
                  hasActionPrice ? "w-auto" : "w-full",
                  "max-lg:ml-0 max-lg:w-full",
                )}
              >
                <div className="flex w-full items-center overflow-hidden">
                  <Image
                    className="h-[28px] w-[28px] shrink-0 rounded-full bg-white object-cover"
                    src={`${userProfile}`}
                    width={28}
                    height={28}
                    alt="profile img"
                  />
                  <div className="ml-2 flex w-full flex-col overflow-hidden">
                    <h2 className="w-full truncate text-[14px] font-semibold text-white max-lg:text-[13px]">
                      {title}
                    </h2>
                    <span className="w-full truncate text-[11px] text-gray-100 max-lg:hidden">
                      @{userAddress || userScreenName}
                    </span>
                  </div>
                </div>
              </Link>

              {hasActionPrice ? (
                <Link
                  href={link || "#"}
                  className={cls(
                    "ml-2 flex h-10 shrink-0 items-center justify-center rounded-full bg-[#141416] px-4 text-sm font-semibold whitespace-nowrap text-white transition-all duration-300 ease-in-out",
                    "hover:!bg-[#F3CC00] group-hover/card:bg-[#FFE55C] group-hover/card:text-black",
                    "max-lg:ml-0 max-lg:mt-2 max-lg:w-full",
                    ethClass ? ethClass : "",
                  )}
                >
                  {isAuction ? "경매" : `${formatKrw(buyNowPrice || 0)}원`}
                </Link>
              ) : (
                <div className="w-px" />
              )}
            </div>
          ) : undefined}
        </div>
      )}
    </>
  );
}

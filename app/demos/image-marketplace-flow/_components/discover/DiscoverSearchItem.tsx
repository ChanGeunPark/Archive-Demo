"use client";

import Link from "next/link";
import { resolveMarketplaceAvatar } from "@/lib/image-marketplace-flow/marketplaceAvatar";
import Image from "next/image";

type DiscoverSearchItemProps = {
  href: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  avatarUrl?: string | null;
  onNavigate?: () => void;
};

export default function DiscoverSearchItem({
  href,
  title,
  subtitle,
  imageUrl,
  avatarUrl,
  onNavigate,
}: DiscoverSearchItemProps) {
  const avatarSrc = avatarUrl ? resolveMarketplaceAvatar(avatarUrl) : null;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block w-full transition-colors hover:bg-zinc-50"
    >
      <div className="flex cursor-pointer p-4">
        {imageUrl ? (
          <div className="flex items-center">
            <Image
              width={50}
              height={50}
              src={imageUrl}
              alt=""
              className="aspect-square w-11.5 rounded-lg object-cover"
            />
          </div>
        ) : null}

        <div className="ml-3 flex flex-col justify-center">
          <h5 className="mb-1 text-left text-sm font-semibold text-[#17191C]">
            {title}
          </h5>
          {subtitle ? (
            <div className="flex items-center">
              {avatarSrc ? (
                <Image
                  width={50}
                  height={50}
                  src={avatarSrc}
                  alt=""
                  className="relative z-10 h-5 w-5 rounded-full object-cover"
                />
              ) : null}
              <p className="ml-1 text-xs text-[#777D84]">{subtitle}</p>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

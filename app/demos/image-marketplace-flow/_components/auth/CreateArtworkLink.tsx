"use client";

import Link from "next/link";
import {
  hydrateMarketplaceAuthFromStorage,
  useMarketplaceStore,
} from "@/lib/image-marketplace-flow/marketplaceStore";

export default function CreateArtworkLink() {
  hydrateMarketplaceAuthFromStorage();
  const currentUser = useMarketplaceStore((state) => state.currentUser);
  if (!currentUser) {
    return (
      <Link
        href="/demos/image-marketplace-flow/create/artwork"
        className="hidden h-10 items-center rounded-full border border-[#D8DBDE] bg-zinc-50 px-4 text-xs font-bold text-[#8A9097] sm:inline-flex"
        title="로그인 후 작품을 등록할 수 있습니다."
      >
        작품 등록
      </Link>
    );
  }

  return (
    <Link
      href="/demos/image-marketplace-flow/create/artwork"
      className="hidden h-10 items-center rounded-full border border-[#D8DBDE] bg-white px-4 text-xs font-bold text-[#3F444B] transition hover:border-[#17191C] hover:bg-zinc-50 sm:inline-flex"
    >
      작품 등록
    </Link>
  );
}

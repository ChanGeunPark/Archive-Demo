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
        className="hidden h-10 items-center rounded-md border border-[#D8DBDE] bg-[#FAFAFB] px-3 text-sm font-bold text-[#8A9097] sm:flex"
        title="로그인 후 작품을 등록할 수 있습니다."
      >
        작품 등록
      </Link>
    );
  }

  return (
    <Link
      href="/demos/image-marketplace-flow/create/artwork"
      className="hidden h-10 items-center rounded-md border border-[#D8DBDE] bg-white px-3 text-sm font-bold text-[#3F444B] transition hover:border-[#17191C] sm:flex"
    >
      작품 등록
    </Link>
  );
}

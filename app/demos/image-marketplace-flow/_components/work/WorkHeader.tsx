import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import Link from "next/link";
import MarketplaceLogin from "../auth/MarketplaceLogin";

export default function WorkHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-10">
        <Link
          href="/demos/image-marketplace-flow"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <KeyboardArrowLeftIcon />
          뒤로가기
        </Link>
        <div className="flex items-center gap-2">
          <MarketplaceLogin />
        </div>
      </div>
    </header>
  );
}

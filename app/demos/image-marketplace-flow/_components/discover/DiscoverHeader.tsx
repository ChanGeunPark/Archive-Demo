import Link from "next/link";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";

type DiscoverHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function DiscoverHeader({
  query,
  onQueryChange,
}: DiscoverHeaderProps) {
  return (
    <header className="sticky top-0 z-99 border-b border-zinc-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <KeyboardArrowLeftIcon />
          뒤로가기
        </Link>
        <div className="hidden h-10 w-full max-w-md items-center rounded-md border border-[#D8DBDE] bg-white px-3 md:flex">
          <span className="mr-2 text-[#777D84]">⌕</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search works, artists, tags"
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#A7ABB0]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/demos/image-marketplace-flow"
            className="hidden h-10 items-center rounded-md border border-[#D8DBDE] bg-white px-3 text-sm font-bold text-[#3F444B] transition hover:border-[#17191C] sm:flex"
          >
            Flow demo
          </Link>
          <button
            type="button"
            className="h-10 rounded-md bg-[#17191C] px-4 text-sm font-bold text-white"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}

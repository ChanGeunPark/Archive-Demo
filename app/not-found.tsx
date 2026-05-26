import Link from "next/link";
import Typography from "@/components/typography/Typography";
import ArrowRightIcon from "@/components/icons/arrow/ArrowRightIcon";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f0ea] text-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-[22rem] w-[22rem] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),transparent_38%,rgba(255,255,255,0.35))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <Typography
          as="p"
          variant="body2"
          weight={700}
          color="#71717a"
          className="rounded-full border border-zinc-950/8 bg-white/70 px-4 py-2 backdrop-blur-md"
        >
          404
        </Typography>

        <Typography
          variant="h1"
          weight={700}
          color="#09090b"
          className="mt-8 leading-[1.08] tracking-[-0.03em]"
        >
          페이지를 찾을 수 없습니다
        </Typography>

        <Typography
          variant="h4"
          weight={400}
          color="#52525b"
          className="mt-5 max-w-md break-keep"
        >
          요청하신 주소가 변경되었거나 존재하지 않습니다. 아카이브 데모
          홈에서 다시 시작해 주세요.
        </Typography>

        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-900 px-6 py-3.5 text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <Typography as="span" variant="body2" weight={600} color="white">
            홈으로 돌아가기
          </Typography>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition group-hover:translate-x-0.5">
            <ArrowRightIcon width={16} height={16} fill="white" />
          </span>
        </Link>
      </div>
    </main>
  );
}

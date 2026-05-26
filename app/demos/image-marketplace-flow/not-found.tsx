import Link from "next/link";
import WorkHeader from "./_components/work/WorkHeader";

export default function MarketplaceNotFound() {
  return (
    <main className="min-h-screen bg-white text-[#141416]">
      <WorkHeader />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
          작품을 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          삭제되었거나 존재하지 않는 작품입니다.
          <br />
          마켓플레이스에서 다른 작품을 둘러보세요.
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/demos/image-marketplace-flow"
            className="flex h-12 items-center justify-center rounded-xl bg-[#141416] text-sm font-bold text-white transition hover:bg-[#FFE55C] hover:text-black"
          >
            마켓플레이스로 이동
          </Link>
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-xl border border-[#D8DBDE] text-sm font-bold text-[#3F444B] transition hover:border-[#141416]"
          >
            데모 홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}

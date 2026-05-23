import Link from "next/link";

const demos = [
  {
    title: "AI Character Chat Replay Demo",
    href: "/demos/character-chat-replay",
    label: "Character AI",
    description:
      "캐릭터 선택, 채팅방, 스트리밍 응답, Supabase 히스토리 저장까지 이어지는 AI 채팅 데모입니다.",
    accent: "from-cyan-400 to-emerald-400",
    stats: ["Character select", "Streaming chat", "Supabase history"],
  },
  {
    title: "Image Marketplace Flow Demo",
    href: "/demos/image-marketplace-flow",
    label: "Marketplace",
    description:
      "이미지 탐색, 라이선스 선택, 구매 플로우까지 이어지는 마켓플레이스 경험 데모입니다.",
    accent: "from-amber-300 to-rose-400",
    stats: ["Asset grid", "License flow", "Checkout states"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-zinc-950/10 pb-5">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em]">
            Archive Demo
          </Link>
          <span className="text-sm text-zinc-600">Portfolio demo index</span>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Company Work Archive
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-normal text-zinc-950 sm:text-6xl">
              작업 데모를 한곳에서 빠르게 보여주는 포트폴리오 허브
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              회사에서 진행했던 작업들을 데모 단위로 정리하고, 각 페이지에서 실제 흐름과 인터랙션을 확장할 수 있도록 구조를 나눴습니다.
            </p>
          </div>

          <div className="grid gap-5">
            {demos.map((demo, index) => (
              <Link
                key={demo.href}
                href={demo.href}
                className="group overflow-hidden rounded-lg border border-zinc-950/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-zinc-950/20 hover:shadow-xl"
              >
                <article className="grid gap-0 md:grid-cols-[180px_1fr]">
                  <div className="relative min-h-44 bg-zinc-950 p-5 text-white">
                    <div
                      className={`absolute inset-x-5 top-5 h-24 rounded-md bg-gradient-to-br ${demo.accent} opacity-90`}
                    />
                    <div className="absolute inset-x-8 bottom-8 grid grid-cols-3 gap-2">
                      <span className="h-12 rounded bg-white/20" />
                      <span className="h-12 rounded bg-white/35" />
                      <span className="h-12 rounded bg-white/20" />
                    </div>
                    <span className="relative z-10 text-sm font-semibold">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
                        {demo.label}
                      </span>
                      <span className="text-sm text-zinc-500">Open demo</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold tracking-normal text-zinc-950">
                      {demo.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-zinc-600">
                      {demo.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {demo.stats.map((stat) => (
                        <span
                          key={stat}
                          className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

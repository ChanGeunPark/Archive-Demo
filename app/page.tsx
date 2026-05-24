import Image from "next/image";
import Link from "next/link";
import Typography from "@/components/typography/Typography";
import ArrowRightIcon from "@/components/icons/arrow/ArrowRightIcon";

const demos = [
  {
    title: "CHIZU COMICS",
    href: "/demos/character-chat-replay",
    label: "AI Chat",
    description:
      "인터랙티브 웹툰 플랫폼의 AI 캐릭터 채팅 핵심 흐름을 재현합니다. 캐릭터 선택·생성, BFF 뒤 프롬프트 격리, LangChain 스트리밍 응답, Supabase 히스토리 저장까지 확인할 수 있습니다.",
    imageSrc: "/images/ai/aiThumb.png",
    imageAlt: "CHIZU COMICS AI Character Chat Demo preview",
    note: "피크 100건/초 · 프론트 80%",
    stats: [
      "BFF · LangChain",
      "Streaming chat",
      "Session pooling",
      "Character creation",
    ],
    accent: "violet",
  },
  {
    title: "CHIZU",
    href: "/demos/image-marketplace-flow",
    label: "Marketplace",
    description:
      "이미지 작품 거래 플랫폼의 탐색·구매 경험을 재현합니다. Masonry 그리드, Socket+GraphQL 실시간 동기화, 라이선스 선택과 구매 플로우를 인터랙티브하게 확인할 수 있습니다.",
    imageSrc: "/images/ai/aiThumb.png",
    imageAlt: "CHIZU Image Marketplace Flow Demo preview",
    note: "실시간 UI 일관성 · Storybook",
    stats: [
      "Masonry grid",
      "Socket + GraphQL",
      "License flow",
      "Image optimization",
    ],
    accent: "amber",
  },
] as const;

const accentStyles = {
  violet: {
    badge: "border-violet-200/80 bg-violet-50 text-violet-700",
    glow: "from-violet-500/20 via-indigo-400/10 to-transparent",
    ring: "group-hover:ring-violet-300/60",
    chip: "bg-violet-100/80 text-violet-800",
  },
  amber: {
    badge: "border-amber-200/80 bg-amber-50 text-amber-800",
    glow: "from-amber-400/20 via-orange-300/10 to-transparent",
    ring: "group-hover:ring-amber-300/60",
    chip: "bg-amber-100/80 text-amber-900",
  },
} as const;

const highlights = [
  { value: "2", label: "CHIZU COMICS · CHIZU 프로젝트" },
  { value: "6+", label: "체험 가능한 사용자 플로우" },
  { value: "Live", label: "스트리밍 AI · Supabase 히스토리" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f0ea] text-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-[22rem] w-[22rem] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),transparent_38%,rgba(255,255,255,0.35))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-end justify-end gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="https://github.com/ChanGeunPark/Archive-Demo"
              target="_blank"
            >
              <Typography
                as="span"
                variant="body3"
                weight={600}
                color="#52525b"
                className="rounded-full border border-zinc-950/8 bg-white/60 px-3 py-2 backdrop-blur-md"
                style={{
                  minHeight: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                GitHub
              </Typography>
            </Link>

            <Typography
              as="span"
              variant="body3"
              weight={700}
              color="#6d28d9"
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2"
              style={{
                minHeight: "36px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {demos.length} demos live
            </Typography>
          </div>
        </header>

        <section className="mt-14 lg:mt-20">
          <Typography
            variant="h1"
            weight={700}
            color="#09090b"
            className="mt-6 leading-[1.08] tracking-[-0.03em]"
          >
            프로젝트
            <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-700 bg-clip-text text-transparent">
              {" "}
              핵심 플로우{" "}
            </span>
            데모
          </Typography>

          <Typography
            variant="h4"
            weight={400}
            color="#52525b"
            className="mt-6 max-w-2xl break-keep"
          >
            AI 캐릭터 채팅과 이미지 마켓플레이스 두 프로젝트의 실제 사용자
            흐름을 인터랙티브 데모로 재현했습니다. 포트폴리오에서 설명한 기술적
            의사결정을 직접 체험할 수 있습니다.
          </Typography>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-md"
            >
              <Typography variant="h2" weight={700} color="#09090b">
                {item.value}
              </Typography>
              <Typography variant="body3" color="#71717a" className="mt-1">
                {item.label}
              </Typography>
            </div>
          ))}
        </section>

        <section className="mt-10 flex-1 pb-10 lg:mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <Typography variant="h3" weight={700} color="#09090b">
                Featured demos
              </Typography>
              <Typography variant="body2" color="#71717a" className="mt-1">
                CHIZU COMICS AI 채팅 · CHIZU 마켓플레이스
              </Typography>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {demos.map((demo, index) => (
              <DemoCard key={demo.href} demo={demo} index={index} />
            ))}
          </div>
        </section>

        <footer className="border-t border-zinc-950/8 py-6">
          <Typography variant="body3" color="#71717a">
            CHIZU COMICS (2023.09 ~ 2024.10) · CHIZU (2022.09 ~ 2023.08) · 오지
          </Typography>
        </footer>
      </div>
    </main>
  );
}

type Demo = (typeof demos)[number];

function DemoCard({ demo, index }: { demo: Demo; index: number }) {
  const accent = accentStyles[demo.accent];
  const focusRing =
    demo.accent === "violet"
      ? "focus-visible:ring-violet-500"
      : "focus-visible:ring-amber-400";

  return (
    <Link
      href={demo.href}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 shadow-[0_16px_50px_rgba(15,23,42,0.08)] ring-1 ring-zinc-950/5 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:outline-none ${focusRing} ${accent.ring}`}
    >
      <article className="flex h-full flex-col">
        <div className="relative h-52 overflow-hidden sm:h-56">
          <Image
            src={demo.imageSrc}
            alt={demo.imageAlt}
            fill
            priority={index === 0}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${accent.glow} via-transparent to-transparent`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/15 to-transparent" />

          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
            <Typography
              as="span"
              variant="body2"
              weight={700}
              color="white"
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md"
            >
              0{index + 1}
            </Typography>
            <Typography
              as="span"
              variant="body3"
              weight={600}
              color="white"
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-md"
            >
              {demo.label}
            </Typography>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <Typography
            variant="h3"
            weight={700}
            color="#09090b"
            className="mt-4 break-keep"
          >
            {demo.title}
          </Typography>

          <Typography
            variant="body2"
            color="#52525b"
            className="mt-3 line-clamp-4 break-keep"
          >
            {demo.description}
          </Typography>

          <div className="mt-5 flex flex-wrap gap-2 mb-5">
            {demo.stats.map((stat) => (
              <Typography
                as="span"
                variant="body3"
                weight={500}
                color="#52525b"
                key={stat}
                className={`rounded-full px-2.5 py-1 ${accent.chip}`}
              >
                {stat}
              </Typography>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-zinc-950/8 pt-5">
            <Typography variant="body2" weight={600} color="#09090b">
              데모 시작하기
            </Typography>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition group-hover:translate-x-1">
              <ArrowRightIcon width={17} height={16} fill="white" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

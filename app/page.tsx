import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/components/typography/Typography";
import ArrowRightIcon from "@/components/icons/arrow/ArrowRightIcon";
import JsonLd from "@/components/seo/JsonLd";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import { buildPageMetadata, buildWebPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "포트폴리오 데모 아카이브",
  description:
    "CHIZU COMICS AI 채팅과 CHIZU 이미지 마켓플레이스 데모를 직접 체험할 수 있는 인터랙티브 포트폴리오 아카이브입니다.",
  path: "/",
  keywords: [
    "포트폴리오",
    "Next.js 데모",
    "AI 캐릭터 채팅",
    "이미지 마켓플레이스",
    "CHIZU",
  ],
});

const demos = [
  {
    title: "CHIZU COMICS",
    href: "/demos/character-chat-replay",
    label: "AI character chat",
    period: "2023.09 - 2024.10",
    project:
      "사용자가 캐릭터를 선택하거나 직접 생성해 대화할 수 있는 AI 캐릭터 채팅 서비스입니다.",
    description:
      "이 데모는 캐릭터 선택, 캐릭터 생성, 프롬프트 격리, 스트리밍 응답, 대화 기록 저장까지 실제 서비스의 핵심 사용자 흐름을 재현합니다.",
    imageSrc: "/images/ai/aiThumb.png",
    imageAlt: "CHIZU COMICS AI Character Chat Demo preview",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "LangChain",
      "OpenAI API",
      "Supabase",
      "TanStack Query",
    ],
  },
  {
    title: "CHIZU",
    href: marketplaceRoutes.discover,
    label: "Image marketplace",
    period: "2022.09 - 2023.08",
    project:
      "작가가 이미지를 등록하고 사용자가 작품을 탐색, 구매, 제안할 수 있는 이미지 마켓플레이스 서비스입니다.",
    description:
      "이 데모는 Discover 탐색, 작품 상세, 구매/제안, 작품 등록 플로우와 함께 DB 변경 이벤트를 기준으로 화면을 다시 동기화하는 구조를 보여줍니다.",
    imageSrc: "/images/marketplace/marketThumb.png",
    imageAlt: "CHIZU Image Marketplace Flow Demo preview",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Apollo Client",
      "GraphQL Yoga",
      "Supabase Realtime",
      "Zustand",
    ],
  },
] as const;

const archiveNotes = [
  {
    title: "Scope",
    value: "2 production-inspired demos",
  },
  {
    title: "Focus",
    value: "User flow, data sync, realtime UX",
  },
  {
    title: "Role",
    value: "Frontend architecture and implementation",
  },
] as const;

export default function Home() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: "포트폴리오 데모 아카이브",
          description:
            "CHIZU COMICS AI 채팅과 CHIZU 이미지 마켓플레이스 데모를 직접 체험할 수 있는 인터랙티브 포트폴리오 아카이브입니다.",
          path: "/",
        })}
      />
      <main className="min-h-screen bg-[#f7f6f2] text-zinc-950">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b border-zinc-950/10 pb-5">
            <Typography
              as="span"
              variant="body3"
              weight={700}
              color="#18181b"
              className="font-mono uppercase"
            >
              Archive Demo
            </Typography>

            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/ChanGeunPark/Archive-Demo"
                target="_blank"
                className="text-sm font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-950"
              >
                GitHub
              </Link>

              <Typography
                as="span"
                variant="body3"
                weight={700}
                color="#18181b"
                className="hidden border-l border-zinc-950/15 pl-3 font-mono uppercase sm:inline"
              >
                {demos.length} demos
              </Typography>
            </div>
          </header>

          <section className="grid gap-8 border-b border-zinc-950/10 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
            <div>
              <Typography
                as="span"
                variant="body3"
                weight={700}
                color="#71717a"
                className="font-mono uppercase"
              >
                Interactive portfolio archive
              </Typography>

              <Typography
                variant="h1"
                weight={700}
                color="#09090b"
                className="mt-5 max-w-3xl text-[44px] sm:text-[54px]"
                style={{ lineHeight: "1.1" }}
              >
                서비스의 핵심 흐름을 다시 설계한 데모 아카이브
              </Typography>
            </div>

            <Typography
              variant="body1"
              weight={400}
              color="#52525b"
              className="max-w-xl self-end break-keep"
            >
              CHIZU COMICS와 CHIZU에서 다룬 핵심 제품 경험을 실제로 조작 가능한
              웹 데모로 정리했습니다. 각 프로젝트가 어떤 서비스였는지, 어떤
              기술로 구현했는지 한 화면에서 확인할 수 있습니다.
            </Typography>
          </section>

          <section className="grid border-b border-zinc-950/10 sm:grid-cols-3">
            {archiveNotes.map((item) => (
              <div
                key={item.title}
                className="border-zinc-950/10 py-5 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                <Typography
                  variant="caption"
                  weight={700}
                  color="#71717a"
                  className="font-mono uppercase"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  weight={600}
                  color="#18181b"
                  className="mt-2"
                >
                  {item.value}
                </Typography>
              </div>
            ))}
          </section>

          <section className="flex-1 py-10 sm:py-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="max-w-2xl">
                <Typography variant="h3" weight={700} color="#09090b">
                  Projects
                </Typography>
                <Typography
                  variant="body2"
                  color="#71717a"
                  className="mt-2 break-keep"
                >
                  프로젝트 설명 아래의 뱃지는 해당 데모를 구성한 주요
                  스택입니다.
                </Typography>
              </div>
            </div>

            <div className="space-y-5">
              {demos.map((demo, index) => (
                <DemoCard key={demo.href} demo={demo} index={index} />
              ))}
            </div>
          </section>

          <footer className="border-t border-zinc-950/10 py-6">
            <Typography variant="body3" color="#71717a">
              CHIZU COMICS (2023.09 - 2024.10) · CHIZU (2022.09 - 2023.08)
            </Typography>
          </footer>
        </div>
      </main>
    </>
  );
}

type Demo = (typeof demos)[number];

function DemoCard({ demo, index }: { demo: Demo; index: number }) {
  return (
    <Link
      href={demo.href}
      className="group block rounded-lg border border-zinc-950/10 bg-white transition duration-300 hover:border-zinc-950/30 hover:shadow-[0_18px_50px_rgba(24,24,27,0.08)] focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none"
    >
      <article className="grid min-h-[360px] overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-64 overflow-hidden bg-zinc-100 sm:min-h-80 lg:min-h-full">
          <Image
            src={demo.imageSrc}
            alt={demo.imageAlt}
            fill
            priority={index === 0}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Typography
              as="span"
              variant="caption"
              weight={700}
              color="#71717a"
              className="font-mono uppercase"
            >
              0{index + 1}
            </Typography>
            <Typography
              as="span"
              variant="caption"
              weight={700}
              color="#71717a"
              className="font-mono uppercase"
            >
              {demo.label}
            </Typography>
            <Typography
              as="span"
              variant="caption"
              weight={700}
              color="#71717a"
              className="font-mono uppercase"
            >
              {demo.period}
            </Typography>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.68fr_1fr]">
            <Typography
              variant="h2"
              weight={700}
              color="#09090b"
              className="break-keep"
            >
              {demo.title}
            </Typography>

            <div>
              <Typography
                variant="body1"
                weight={600}
                color="#18181b"
                className="break-keep"
              >
                {demo.project}
              </Typography>

              <Typography
                variant="body2"
                color="#52525b"
                className="mt-3 break-keep"
              >
                {demo.description}
              </Typography>

              <div className="mt-6 border-t border-zinc-950/10 pt-5">
                <Typography
                  as="span"
                  variant="caption"
                  weight={700}
                  color="#71717a"
                  className="font-mono uppercase"
                >
                  Stack
                </Typography>
                <div className="mt-3 flex flex-wrap gap-2">
                  {demo.stack.map((stack) => (
                    <Typography
                      as="span"
                      variant="body3"
                      weight={600}
                      color="#3f3f46"
                      key={stack}
                      className="rounded border border-zinc-950/10 bg-[#f7f6f2] px-2.5 py-1"
                    >
                      {stack}
                    </Typography>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-8">
            <Typography variant="body2" weight={600} color="#09090b">
              Open demo
            </Typography>
            <span className="flex h-9 w-9 items-center justify-center rounded border border-zinc-950 bg-zinc-950 text-white transition group-hover:translate-x-1">
              <ArrowRightIcon width={17} height={16} fill="white" aria-hidden />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

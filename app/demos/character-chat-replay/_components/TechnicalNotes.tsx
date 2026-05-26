import Typography from "@/components/typography/Typography";
import Image from "next/image";

const tradeoffs = [
  {
    title: "BFF (Next.js API Route)",
    gain: "API 키·시스템 프롬프트·secretContext를 브라우저에 노출하지 않습니다.",
    cost: "채팅 요청마다 브라우저 → Next.js → AI 모델로 경로가 한 단계 더 늘어납니다.",
  },
  {
    title: "LangChain in-memory session",
    gain: "같은 roomId의 연속 대화에서는 DB 히스토리를 매 턴 읽지 않고 세션의 historyMessages를 재사용합니다.",
    cost: "세션은 서버 RAM에만 있어 재배포·dev 서버 재시작·cold start 시 Map이 비워집니다. 저장된 메시지(DB)는 남지만, 다음 턴에 DB에서 history를 다시 읽어 세션을 재구성합니다.",
  },
  {
    title: "SSE + smooth reveal",
    gain: "GPT·Gemini처럼 chunk 크기가 다른 provider도 비슷한 타이핑 UX로 보이게 합니다.",
    cost: "실제 SSE 수신과 화면 표시가 분리되어, presentation layer 코드가 추가됩니다.",
  },
  {
    title: "React Query refetchOnMount",
    gain: "같은 roomId로 재입장해도 Supabase 기준 최신 history를 보여줍니다.",
    cost: "채팅방을 열 때마다 GET /history를 다시 호출합니다.",
  },
] as const;

const serviceComparison = [
  {
    item: "API",
    production: "GraphQL + Node.js Backend",
    demo: "REST + Next.js API Route",
  },
  {
    item: "저장 · 검증",
    production: "Node.js Backend (캐릭터 저장 · 유저 검증 · 데이터 적합성)",
    demo: "BFF → Supabase 직접 read/write",
  },
  {
    item: "AI 처리",
    production: "LangChain + 서버 세션 풀 (BFF)",
    demo: "LangChain/mock · in-memory 세션 재현",
  },
  {
    item: "DB",
    production: "GCP PostgreSQL + Prisma",
    demo: "Supabase",
  },
  {
    item: "스트리밍",
    production: "SSE",
    demo: "SSE + smooth reveal UX 재현",
  },
  {
    item: "클라이언트",
    production: "GraphQL Apollo Client",
    demo: "REST fetch + TanStack Query",
  },
] as const;

const flowBadgeClass = "border-[#E4E4E7] bg-[#FAFAFA] text-[#52525B]";

const allFlowBadges = [
  "[1] 정보 입력",
  "[2] 미리 대화",
  "[3] 생성",
  "POST",
  "[4~6] 검증 · 프롬프트 · DB 저장",
  "[7~9] 채팅 시작",
  "POST",
  "[10~12] AI 답변(스트리밍)",
  "SSE",
  "화면 표시 · DB replay",
] as const;

function FlowBadgeTrail() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {allFlowBadges.map((label, index) => (
        <div key={`${label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && (
            <span
              aria-hidden
              className="text-[10px] font-medium text-[#C4C8CC]"
            >
              →
            </span>
          )}
          <Typography
            as="span"
            variant="caption"
            weight={600}
            className={`inline-flex rounded-sm border px-2 py-0.5 ${flowBadgeClass}`}
          >
            {label}
          </Typography>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-[#EDEEEF] pb-4">
      <Typography variant="h3" weight={700} color="#17191C">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="#72777E" className="mt-2 break-keep">
          {description}
        </Typography>
      )}
    </div>
  );
}

export function TechnicalNotes() {
  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <Typography
          variant="h1"
          weight={700}
          color="#17191C"
          className="leading-tight"
        >
          AI 채팅 플로우 재구성
        </Typography>
        <Typography
          variant="body2"
          color="#72777E"
          className="max-w-xl break-keep"
        >
          CHIZU COMICS AI 채팅 핵심 플로우를 포트폴리오용으로 축소 재현한
          구조입니다. 실서비스는 GraphQL로 작업 되었으나, 데모는 REST + TanStack
          Query로 재구성했습니다.
        </Typography>

        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 sm:p-5">
          <Image
            src="/images/ai/aiChat_allFlow.png"
            alt="Architecture"
            width={1000}
            height={1000}
            className="w-full h-auto"
          />
        </div>
        <FlowBadgeTrail />

        <section className="space-y-2 border-t border-[#EDEEEF] border-b pb-6">
          <Typography
            variant="body1"
            weight={600}
            color="#17191C"
            className="pt-6"
          >
            실제 서비스 작업한 부분
          </Typography>
          <Typography
            variant="body3"
            weight={500}
            color="#72777E"
            className="mt-2 max-w-2xl break-keep leading-relaxed"
          >
            이 데모에서는 프론트엔드부터 BFF까지 전 구간을 재구현했습니다. 실제
            서비스에서는 캐릭터 저장, 유저 검증, 데이터 접근 제어는 Node.js
            백엔드에서 처리했고, Next.js BFF는 스트리밍, 프롬프트 격리, SSE
            연결을 담당했습니다.
          </Typography>
        </section>
      </header>

      <div className="space-y-5">
        <SectionHeading
          title="Demo vs Production"
          description="같은 UX 플로우를 유지하되, 데모는 설명·재현을 위해 단순화했습니다."
        />
        <div className="overflow-x-auto rounded-2xl border border-[#EDEEEF] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EDEEEF] bg-[#FAFAFB]">
                {["항목", "실제 서비스", "데모"].map((head) => (
                  <th key={head} className="px-4 py-3">
                    <Typography
                      as="span"
                      variant="body3"
                      weight={700}
                      color="#60656C"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serviceComparison.map((row, index) => (
                <tr
                  key={row.item}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#FAFAFB]/80"}
                >
                  <td className="px-4 py-3 align-top">
                    <Typography variant="body3" weight={600} color="#6d28d9">
                      {row.item}
                    </Typography>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      {row.production}
                    </Typography>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      {row.demo}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Trade-offs"
          description="실제 서비스 구조를 데모 환경에 맞게 재구성하며 선택한 설계입니다."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {tradeoffs.map((item, index) => (
            <article
              key={item.title}
              className={`rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] ${
                index === tradeoffs.length - 1 && tradeoffs.length % 2 !== 0
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Typography
                  as="span"
                  variant="body3"
                  weight={700}
                  color="#6d28d9"
                  className="mt-0.5 shrink-0 tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <div className="min-w-0 flex-1">
                  <Typography variant="body2" weight={700} color="#17191C">
                    {item.title}
                  </Typography>
                  <div className="mt-3 space-y-2">
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      <Typography
                        as="span"
                        variant="body3"
                        weight={600}
                        color="#059669"
                      >
                        선택{" "}
                      </Typography>
                      {item.gain}
                    </Typography>
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      <Typography
                        as="span"
                        variant="body3"
                        weight={600}
                        color="#D97706"
                      >
                        대가{" "}
                      </Typography>
                      {item.cost}
                    </Typography>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

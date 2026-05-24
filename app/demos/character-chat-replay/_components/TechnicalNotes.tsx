import Typography from "@/components/typography/Typography";
import Image from "next/image";

const messagePriority = [
  "local(stream)",
  "React Query",
  "SSR initial",
] as const;

const layers = [
  {
    label: "Client",
    accent: "border-violet-200 bg-violet-50 text-violet-700",
    items: [
      "ChatRoomClient · CharacterSelect · CreateCharacter",
      "TanStack Query · Optimistic UI · SSE Reader",
      "Smooth stream reveal (GPT/Gemini UX 정규화)",
    ],
  },
  {
    label: "BFF",
    accent: "border-indigo-200 bg-indigo-50 text-indigo-700",
    items: [
      "Next.js Route Handlers (/api/ai-chat-demo/*)",
      "프롬프트 · secretContext 서버 격리",
      "SSE token stream → 클라이언트",
    ],
  },
  {
    label: "AI · Data",
    accent: "border-zinc-200 bg-zinc-50 text-zinc-700",
    items: [
      "LangChain session pool (roomId · TTL 12h)",
      "Supabase — characters · rooms · messages",
      "roomId = {characterId}-{userInput}",
    ],
  },
] as const;

const flowSteps = [
  {
    title: "Browser",
    lines: [
      "ChatRoomClient",
      "SSE parse + smooth reveal",
      "TanStack Query cache",
    ],
  },
  {
    title: "BFF",
    lines: ["POST /api/.../chat", "GET /api/.../history", "prompt isolation"],
  },
  {
    title: "Backend",
    lines: ["LangChain stream", "session pool[roomId]", "Supabase persist"],
  },
] as const;

const cachePolicies = [
  {
    layer: "UI · localMessages",
    target: "스트리밍 중 메시지",
    policy: "채팅 중 최우선 · 완료 후 setQueryData",
    purpose: "스트림 UX · 캐시 동기화",
  },
  {
    layer: "React Query · history",
    target: "채팅방 메시지",
    policy: "staleTime 0 · refetchOnMount always · placeholderData",
    purpose: "재진입 시 DB 동기화",
  },
  {
    layer: "React Query · characters",
    target: "캐릭터 목록",
    policy: "전역 staleTime 5min · mutation cache patch",
    purpose: "목록 속도 · CRUD 반영",
  },
  {
    layer: "LangChain session",
    target: "roomId 컨텍스트",
    policy: "서버 RAM Map · TTL 12h · limit 16 · preview no-cache",
    purpose: "연속 대화 시 DB history 재조회 생략",
  },
  {
    layer: "Source of truth",
    target: "Supabase messages",
    policy: "persist · fetch no-store",
    purpose: "영속 저장 · 재입장 기준",
  },
] as const;

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
  {
    title: "REST + TanStack Query (데모)",
    gain: "포트폴리오 데모를 단순한 API 계층으로 재현·설명하기 쉽습니다.",
    cost: "실서비스 CHIZU COMICS의 GraphQL·캐시 정책과는 구현이 다릅니다.",
  },
] as const;

const flowBadgeClass =
  "border-[#E4E4E7] bg-[#FAFAFA] text-[#52525B]";

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
            <span aria-hidden className="text-[10px] font-medium text-[#C4C8CC]">
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
          AI 채팅 핵심 플로우
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
      </header>

      <div className="space-y-5">
        <SectionHeading
          title="Layer overview"
          description="클라이언트 · BFF · AI/Data 세 레이어로 역할을 분리했습니다."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {layers.map((layer) => (
            <article
              key={layer.label}
              className="flex flex-col rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
            >
              <Typography
                as="span"
                variant="body3"
                weight={700}
                className={`inline-flex w-fit rounded-full border px-2.5 py-1 ${layer.accent}`}
              >
                {layer.label}
              </Typography>
              <ul className="mt-4 flex-1 space-y-2">
                {layer.items.map((item) => (
                  <li key={item}>
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Request flow"
          description="채팅 전송과 히스토리 조회의 end-to-end 흐름입니다."
        />
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="contents">
              <article className="rounded-2xl border border-[#EDEEEF] bg-[#FAFAFB] p-4">
                <Typography variant="body2" weight={700} color="#17191C">
                  {step.title}
                </Typography>
                <ul className="mt-3 space-y-1.5">
                  {step.lines.map((line) => (
                    <li key={line}>
                      <Typography
                        as="span"
                        variant="body3"
                        color="#60656C"
                        className="font-mono text-[11px]"
                      >
                        {line}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </article>
              {index < flowSteps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden items-center justify-center text-[#C4C8CC] md:flex"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Cache policy"
          description="레이어마다 캐시 목적과 갱신 시점이 다릅니다."
        />
        <div className="overflow-x-auto rounded-2xl border border-[#EDEEEF] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EDEEEF] bg-[#FAFAFB]">
                {["Layer", "대상", "정책", "목적"].map((head) => (
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
              {cachePolicies.map((row, index) => (
                <tr
                  key={row.layer}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#FAFAFB]/80"}
                >
                  <td className="px-4 py-3 align-top">
                    <Typography variant="body3" weight={600} color="#6d28d9">
                      {row.layer}
                    </Typography>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Typography variant="body3" color="#52525b">
                      {row.target}
                    </Typography>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      {row.policy}
                    </Typography>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Typography
                      variant="body3"
                      color="#52525b"
                      className="break-keep"
                    >
                      {row.purpose}
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
          description="의도적으로 선택한 타협입니다."
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

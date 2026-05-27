import Typography from "@/components/typography/Typography";

const serviceComparison = [
  {
    item: "프레임워크",
    production: "Next.js 12 Pages Router",
    demo: "Next.js 16 App Router",
  },
  {
    item: "GraphQL",
    production: "외부 Apollo API + 지갑 서명 인증",
    demo: "GraphQL Yoga + Supabase + 자체 `/api/marketplace/graphql`",
  },
  {
    item: "실시간",
    production: "Socket.IO 알림 → GraphQL refetch",
    demo: "Supabase Realtime `postgres_changes` → GraphQL refetch",
  },
  {
    item: "목록 페이지네이션",
    production: "page/count offset + 로컬 `displayedList` 누적",
    demo: "Relay-style cursor + Apollo `fetchMore` + cache merge",
  },
  {
    item: "Apollo 캐시",
    production: "마소너리 목록 `no-cache` (배열 삭제 이슈 회피)",
    demo: "`cache-first` + `typePolicies.merge`로 페이지 누적",
  },
  {
    item: "Discover 그리드",
    production: "`DynamicGrid` (tall/wide spanning) + ref 높이 계산",
    demo: "`OrderedMasonry` + CSS `aspect-ratio`",
  },
  {
    item: "인증 · 거래",
    production: "Web3Auth, wagmi, ethers, on-chain listener",
    demo: "ID 기반 로그인(localStorage) + Supabase DB 거래 재현",
  },
  {
    item: "무한 스크롤 트리거",
    production: "`BrowseScroller` scroll listener",
    demo: "IntersectionObserver sentinel",
  },
] as const;

const tradeoffs = [
  {
    title: "CSS aspect-ratio",
    gain: "첫 렌더부터 컬럼 너비에 맞춰 카드 높이를 예약해, 이미지 로드 전후로 레이아웃이 흔들리는 문제를 줄였습니다.",
    cost: "가로형 이미지 오버레이 기준은 DOM 측정값 대신 width/height 메타데이터로 판단합니다.",
  },
  {
    title: "Apollo cache merge",
    gain: "상세에서 뒤로 돌아왔을 때 이미 불러온 페이지와 스크롤 위치를 즉시 복원할 수 있습니다.",
    cost: "필터 조합마다 별도 캐시 엔트리가 생기므로 `keyArgs`를 명확히 설계해야 합니다.",
  },
  {
    title: "Realtime = 트리거",
    gain: "이벤트 payload를 화면 상태로 직접 쓰지 않아, 서버 기준의 거래 정합성을 유지합니다.",
    cost: "변경마다 GraphQL refetch가 필요해, payload 직접 반영보다 네트워크 호출이 한 번 더 발생합니다.",
  },
] as const;

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

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EDEEEF] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="border-b border-[#EDEEEF] bg-[#FAFAFB] px-4 py-2.5">
        <Typography variant="body3" weight={700} color="#60656C">
          {title}
        </Typography>
      </div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-[#3F444B]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const chizuHeightLogic = `// CHIZU MasonryImageCard — refWidth 측정 + JS 높이 계산
useEffect(() => {
  if (ref?.current && refWidth === 0) {
    setRefWidth(ref.current.offsetWidth);
  }
});
const realWidth = refWidth === 0 ? width : refWidth;
const realHeight = height * (realWidth / width);
// refWidth === 0 이면 원본 픽셀 width(예: 1000)로 계산 → CLS 발생`;

const demoHeightLogic = `// Demo MasonryImageCard — CSS aspect-ratio
const isLandscape = width > height;

<div
  style={{ aspectRatio: \`\${width} / \${height}\` }}
  className="group/card relative w-full ..."
/>`;

const demoPagination = `// Demo DiscoverMain
fetchPolicy: "cache-first",
await fetchMore({ variables: { after: pageInfo.endCursor } });
// Apollo typePolicies.merge → edges 이어붙임`;

const chizuSocket = `// CHIZU NotificationLayout
socket.emit("join", { senderAddress: address });
socket.on("notification", (payload) => { ... });
// WorkUI: 알림이 현재 작품과 일치 → forceUpdateTrigger → refetch(network-only)`;

const demoRealtime = `// lib/image-marketplace-flow/useWorkRealtime.ts
supabase
  .channel(\`work:\${workId}\`)
  .on("postgres_changes", {
    event: "UPDATE",
    table: "marketplace_demo_works",
    filter: \`id=eq.\${workId}\`,
  }, () => onWorkChange()) // → GraphQL refetch
  .subscribe();`;

const scrollRestoreLogic = `// DiscoverMain — sessionStorage + Apollo cache
const SCROLL_KEY = "discover-scroll";
// 작품 링크 클릭 / unmount 시 scrollY 저장
// 복귀: cache-first로 merged edges 복원
// scrollHeight 부족 시 fetchMore 반복 → targetY까지 스크롤`;

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
          Marketplace 플로우 재구성
        </Typography>
        <Typography
          variant="body2"
          color="#72777E"
          className="max-w-2xl break-keep leading-relaxed"
        >
          CHIZU 마켓플레이스에서 다뤘던 Discover, 작품 상세, 구매, 가격 제안,
          등록 플로우를 포트폴리오용으로 다시 구성한 기술 노트입니다. 회사
          도메인과 Web3, 외부 API 의존성은 걷어내고 Supabase와 자체 GraphQL
          API로 핵심 UX를 재현했습니다.
        </Typography>

        <section className="space-y-2 border-t border-b border-[#EDEEEF] pb-6">
          <Typography
            variant="body1"
            weight={600}
            color="#17191C"
            className="pt-6"
          >
            이 데모에서 보여주는 것
          </Typography>
          <Typography
            variant="body3"
            weight={500}
            color="#72777E"
            className="mt-2 max-w-2xl break-keep leading-relaxed"
          >
            핵심은 NFT 자체가 아니라 거래 이후의 상태 전환입니다. 구매 후에도
            작품은 마켓에 남아 있고, 소유자가 바뀌며, 다른 사용자는 새
            소유자에게 다시 가격 제안을 보낼 수 있습니다. 이 흐름을{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              등록 → 구매 → 소유권 변경 → 다시제안
            </Typography>
            까지 프론트엔드, GraphQL API, DB 스키마, Realtime 구독으로
            end-to-end 연결했습니다.
          </Typography>
        </section>
      </header>

      <div className="space-y-5">
        <SectionHeading
          title="Production vs Demo"
          description="같은 UX 목표를 유지하되, 공개 가능한 데모로 설명하기 위해 스택과 구현 방식을 단순화했습니다."
        />
        <div className="overflow-x-auto rounded-2xl border border-[#EDEEEF] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EDEEEF] bg-[#FAFAFB]">
                {["항목", "CHIZU (실서비스)", "데모"].map((head) => (
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
                  <td className="px-4 py-3 align-top w-[130px]">
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
          title="Masonry CLS 개선"
          description="Discover 그리드의 핵심 과제는 이미지가 로드되기 전에도 카드 높이를 예측해 레이아웃 흔들림을 줄이는 것이었습니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="break-keep leading-relaxed"
          >
            CHIZU{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              QueryMasonryLayout
            </Typography>
            에서는 컬럼 배치에{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              stdHeight = ratio × 220 + 20
            </Typography>
            라는 고정 px 기반 값을 쓰고, 실제 카드는{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              refWidth 측정 후 realHeight
            </Typography>
            를 JS로 계산했습니다. 첫 렌더에서 refWidth가 0이면 원본 이미지
            width(예: 1000px)를 기준으로 높이가 잡혀, 실제 DOM 너비(~230px)와
            맞지 않는 순간이 생겼고 카드가 길게 보였다가 줄어드는 CLS가
            발생했습니다.
          </Typography>
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="mt-3 break-keep leading-relaxed"
          >
            데모에서는 컬럼 배치에는{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              stdHeight = height / width
            </Typography>
            라는 비율 스칼라를 쓰고, 카드 높이는 CSS{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              aspect-ratio
            </Typography>
            로 브라우저가 계산하게 했습니다. 별도 DOM 측정이나 리렌더 없이 첫
            paint부터 올바른 비율의 공간을 확보합니다.
          </Typography>
        </div>
        <div className="grid gap-4">
          <CodeBlock
            title="CHIZU — refWidth + JS height"
            code={chizuHeightLogic}
          />
          <CodeBlock title="Demo — CSS aspect-ratio" code={demoHeightLogic} />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Apollo 캐싱 정책"
          description="실서비스에서 우회했던 목록 캐싱을 데모에서는 typePolicies.merge로 정리해, 페이지 누적과 뒤로가기 복원을 캐시 안에서 처리했습니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <ul className="space-y-3">
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  Discover 목록 — cache-first:{" "}
                </Typography>
                상세에서 뒤로 돌아오면 merged edges를 즉시 표시합니다. 별도
                refetch 없이 이전에 불러온 페이지까지 복원됩니다.
              </Typography>
            </li>
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  작품 상세 — cache-and-network + refetchQueries:{" "}
                </Typography>
                캐시를 먼저 보여주고 백그라운드에서 서버와 맞춥니다. 구매·제안
                등 mutation은{" "}
                <Typography as="span" variant="body3" weight={600} color="#17191C">
                  WORK_DETAIL_QUERY refetch
                </Typography>
                로 갱신하고, Realtime 신호도 동일한 refetch로 처리합니다.
              </Typography>
            </li>
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  작품 삭제 — cache.updateQuery:{" "}
                </Typography>
                목록 캐시에서 해당 edge를 제거하고 totalCount를 줄여, refetch
                없이 Discover 목록을 최신 상태에 맞춥니다.
              </Typography>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="무한 스크롤 · 커서 · 스크롤 복원"
          description="데모는 cursor pagination, IntersectionObserver, sessionStorage를 조합해 긴 목록 탐색 후 복귀 경험을 안정적으로 복원합니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="break-keep leading-relaxed"
          >
            서버 커서는{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              base64url(JSON.stringify({"{ createdAt, id }"})
            </Typography>
            형태로 인코딩해{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              created_at DESC, id DESC
            </Typography>
            정렬에서도 안정적인 페이지 경계를 만듭니다.{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              endCursor
            </Typography>
            는 Apollo 캐시에 저장되므로 sessionStorage에 따로 넣지 않습니다.
          </Typography>
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="mt-3 break-keep leading-relaxed"
          >
            상세로 이동할 때{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              scrollY
            </Typography>
            를 sessionStorage에 저장합니다. 복귀 시에는 cache-first로 목록을
            먼저 띄우고, scrollHeight가 부족하면 fetchMore를 반복해 저장된
            위치까지 콘텐츠를 채웁니다. 필터 변경 직후 sentinel이 보인다는
            이유만으로 다음 페이지를 불러오지 않도록{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              canLoadMoreRef
            </Typography>
            게이트도 두었습니다.
          </Typography>
        </div>
        <div className="grid gap-4">
          <CodeBlock
            title="Demo — fetchMore + scroll 복원"
            code={demoPagination}
          />
          <CodeBlock
            title="DiscoverMain — scroll restore 흐름"
            code={scrollRestoreLogic}
          />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Socket.IO → Supabase Realtime"
          description="이벤트를 UI 상태 자체가 아니라 '재조회가 필요하다'는 신호로 다루는 구조는 유지했습니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="break-keep leading-relaxed"
          >
            CHIZU에서는 지갑 주소별 Socket.IO 방에 join하고, notification
            payload가 현재 작품과 일치하면{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              forceUpdateTrigger
            </Typography>
            로 GraphQL refetch를 트리거했습니다. on-chain 이벤트는 ethers
            contract listener에서 별도로 처리했습니다.
          </Typography>
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="mt-3 break-keep leading-relaxed"
          >
            데모는 Web3·Socket.IO 없이 Supabase{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              postgres_changes
            </Typography>
            로{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              marketplace_demo_works
            </Typography>
            테이블의 UPDATE/DELETE를 작품별 채널(
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              work:{"{workId}"}
            </Typography>
            )로 구독합니다. payload는 읽지 않고{" "}
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              WORK_DETAIL_QUERY refetch
            </Typography>
            로 소유자, 최근 거래가, 제안 수를 다시 맞춥니다. 탭을 두 개 열고
            한쪽에서 구매하면 다른 쪽 상세 화면이 갱신되는 방식으로 확인할 수
            있습니다.
          </Typography>
        </div>
        <div className="grid gap-4">
          <CodeBlock
            title="CHIZU — Socket.IO 알림 → refetch"
            code={chizuSocket}
          />
          <CodeBlock
            title="Demo — Supabase Realtime → refetch"
            code={demoRealtime}
          />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Trade-offs"
          description="실서비스의 문제를 데모 환경에서 재현하며 선택한 설계와 감수한 비용입니다."
        />
        <div className="space-y-3">
          {tradeoffs.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
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

      <div className="space-y-5">
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <ul className="space-y-3">
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  뒤로가기 UX:{" "}
                </Typography>
                Apollo merged cache와 sessionStorage scrollY를 조합해 긴 목록을
                탐색한 뒤 돌아오는 경험을 복원했습니다.
              </Typography>
            </li>
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  실시간 정합성:{" "}
                </Typography>
                “알림은 왔는데 화면의 가격·소유자 정보는 그대로인” 문제를 트리거
                + refetch 패턴으로 명시적으로 해결했습니다.
              </Typography>
            </li>
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  레거시 개선:{" "}
                </Typography>
                실서비스에서 겪었던 Masonry CLS 이슈를 데모 재구현 과정에서
                aspect-ratio 기반 구조로 개선했습니다.
              </Typography>
            </li>
            <li>
              <Typography
                variant="body3"
                color="#52525b"
                className="break-keep"
              >
                <Typography
                  as="span"
                  variant="body3"
                  weight={600}
                  color="#17191C"
                >
                  체험 가능한 데모:{" "}
                </Typography>
                ID만 입력하면 등록, 구매, 제안, 삭제, 실시간 갱신까지 바로
                테스트할 수 있게 설계했습니다.
              </Typography>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

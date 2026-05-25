import Typography from "@/components/typography/Typography";

const tradeoffs = [
  {
    title: "CSS aspect-ratio",
    gain: "첫 렌더부터 컬럼 너비에 맞는 비율로 높이가 잡혀, 카드가 세로로 길게 보였다가 줄어드는 현상이 사라집니다.",
    cost: "가로형 이미지 오버레이 maxWidth를 DOM 측정값 대신 width/height 메타데이터로 판단합니다.",
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

const beforeHeightLogic = `// MasonryImageCard.tsx — 변경 전
const ref = useRef(null);
const [refWidth, setRefWidth] = useState<number>(0);

useEffect(() => {
  if (ref && ref.current && refWidth == 0) {
    setRefWidth((ref.current as HTMLDivElement).offsetWidth);
  }
}, [refWidth]);

const realWidth = refWidth == 0 ? (width as number) : (refWidth as number);
const realHeight = height && width ? height * (realWidth / width) : 200;

<div
  ref={ref}
  style={{ height: realHeight, position: "relative" }}
  className="group/card relative cursor-pointer ..."
>`;

const afterHeightLogic = `// MasonryImageCard.tsx — 변경 후
const isLandscape = !!(width && height && width > height);

<div
  style={{
    aspectRatio: width && height ? \`\${width} / \${height}\` : undefined,
  }}
  className="group/card relative w-full cursor-pointer ..."
>`;

const beforeOverlayLogic = `// 가로형 이미지 오버레이 — 변경 전
style={{
  maxWidth:
    realWidth > realHeight && !hasActionPrice
      ? \`\${Math.floor(realWidth / 2) - 24}px\`
      : undefined,
}}`;

const afterOverlayLogic = `// 가로형 이미지 오버레이 — 변경 후
style={{
  maxWidth: isLandscape && !hasActionPrice ? "50%" : undefined,
}}`;

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
          마소너리 이미지 카드 높이 계산
        </Typography>
        <Typography
          variant="body2"
          color="#72777E"
          className="max-w-xl break-keep"
        >
          MasonryImageCard에서 카드 높이를 구하던 방식을 refWidth 측정 +
          JS 계산에서 CSS aspect-ratio로 바꾼 변경 내역입니다.
        </Typography>

        <section className="space-y-2 border-t border-b border-[#EDEEEF] pb-6">
          <Typography
            variant="body1"
            weight={600}
            color="#17191C"
            className="pt-6"
          >
            증상
          </Typography>
          <Typography
            variant="body3"
            weight={500}
            color="#72777E"
            className="mt-2 max-w-2xl break-keep leading-relaxed"
          >
            페이지 진입 직후 마소너리 카드가 실제 비율보다 세로로 길게
            렌더되고, useEffect로 컨테이너 너비를 측정한 뒤 높이가 줄어들며
            레이아웃이 한 번 밀리는 현상이 있었습니다.
          </Typography>
        </section>
      </header>

      <div className="space-y-5">
        <SectionHeading
          title="Why Image Rights Marketplace?"
          description="공개 포트폴리오에서는 회사 도메인과 자산을 제외하고, 이미지 독점 라이선스 거래 모델로 재구성했습니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="break-keep leading-relaxed"
          >
            이 데모의 핵심은 NFT 자체가 아니라, 구매 이후 작품이
            마켓플레이스에 계속 남아 있으면서 현재 소유자가 바뀌고 다음
            사용자가 새 소유자에게 가격 제안을 보낼 수 있는 거래 상태입니다.
          </Typography>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Realtime Sync Strategy"
          description="이벤트 payload는 UI 상태를 확정하는 데이터가 아니라 서버 재조회가 필요하다는 신호로만 취급합니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <Typography
            variant="body3"
            weight={500}
            color="#52525b"
            className="break-keep leading-relaxed"
          >
            다른 사용자의 구매 이벤트가 도착해도 클라이언트는 이벤트
            payload만으로 소유자를 변경하지 않습니다. 이벤트는 “갱신이
            필요하다”는 신호로 사용하고, 작품 상세 API를 다시 조회해 서버
            기준의 현재 소유자, 최근 거래가, 제안 수를 반영하는 전략을
            보여줍니다.
          </Typography>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="원인"
          description="refWidth가 0인 첫 렌더에서 realWidth를 이미지 원본 픽셀 width로 대체했기 때문입니다."
        />
        <div className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
          <Typography variant="body3" color="#52525b" className="break-keep">
            예: 1000 × 703 이미지가 6컬럼 그리드(~230px 너비)에 들어갈 때
          </Typography>
          <ul className="mt-3 space-y-2">
            <li>
              <Typography variant="body3" color="#52525b" className="break-keep">
                <Typography as="span" variant="body3" weight={600} color="#17191C">
                  첫 렌더:{" "}
                </Typography>
                realWidth = 1000 → realHeight = 703px (원본 높이 그대로)
              </Typography>
            </li>
            <li>
              <Typography variant="body3" color="#52525b" className="break-keep">
                <Typography as="span" variant="body3" weight={600} color="#17191C">
                  측정 후:{" "}
                </Typography>
                realWidth = 230 → realHeight ≈ 162px
              </Typography>
            </li>
          </ul>
          <Typography
            variant="body3"
            color="#72777E"
            className="mt-3 break-keep"
          >
            DOM 너비는 ~230px인데 높이만 703px로 잡혀, 비율이 깨진 채로
            보였습니다.
          </Typography>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="MasonryImageCard — Before / After"
          description="JS로 높이를 계산하던 방식을 CSS aspect-ratio로 교체했습니다."
        />
        <div className="grid gap-4">
          <CodeBlock title="변경 전 — refWidth 측정 + height 계산" code={beforeHeightLogic} />
          <CodeBlock title="변경 후 — aspect-ratio" code={afterHeightLogic} />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="오버레이 maxWidth — Before / After"
          description="높이 계산 방식 변경에 맞춰, 가로형 이미지 오버레이 너비 제한도 함께 단순화했습니다."
        />
        <div className="grid gap-4">
          <CodeBlock title="변경 전 — 측정된 realWidth 기준" code={beforeOverlayLogic} />
          <CodeBlock title="변경 후 — 메타데이터 기준 isLandscape" code={afterOverlayLogic} />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          title="Trade-offs"
          description="이번 변경에서 선택한 설계입니다."
        />
        <article className="rounded-2xl border border-[#EDEEEF] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-start gap-3">
            <Typography
              as="span"
              variant="body3"
              weight={700}
              color="#6d28d9"
              className="mt-0.5 shrink-0 tabular-nums"
            >
              01
            </Typography>
            <div className="min-w-0 flex-1">
              <Typography variant="body2" weight={700} color="#17191C">
                {tradeoffs[0].title}
              </Typography>
              <div className="mt-3 space-y-2">
                <Typography variant="body3" color="#52525b" className="break-keep">
                  <Typography as="span" variant="body3" weight={600} color="#059669">
                    선택{" "}
                  </Typography>
                  {tradeoffs[0].gain}
                </Typography>
                <Typography variant="body3" color="#52525b" className="break-keep">
                  <Typography as="span" variant="body3" weight={600} color="#D97706">
                    대가{" "}
                  </Typography>
                  {tradeoffs[0].cost}
                </Typography>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#EDEEEF] bg-[#FAFAFB] p-4 sm:p-5">
        <Typography variant="body2" weight={700} color="#17191C">
          관련 파일
        </Typography>
        <Typography as="code" variant="body3" color="#52525b" className="break-all">
          app/demos/image-marketplace-flow/_components/card/MasonryImageCard.tsx
        </Typography>
      </div>
    </section>
  );
}

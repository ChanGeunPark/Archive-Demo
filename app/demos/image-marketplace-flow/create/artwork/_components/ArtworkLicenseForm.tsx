"use client";

import { useState } from "react";
import type { ArtworkLicensePolicy } from "@/lib/image-marketplace-flow/createArtworkStore";
import { cls } from "@/lib/client/utils";

type ArtworkLicenseFormProps = {
  selectedPolicy?: ArtworkLicensePolicy;
  onSubmit: (policy: ArtworkLicensePolicy) => void;
  onBack: () => void;
};

const licenseOptions: {
  policy: ArtworkLicensePolicy;
  title: string;
  description: string;
  checks: boolean[];
}[] = [
  {
    policy: "exclusive",
    title: "EXCLUSIVE",
    description: "구매자 독점 이용",
    checks: [true, true, true, false],
  },
  {
    policy: "commercial",
    title: "COMMERCIAL",
    description: "상업 이용 허용",
    checks: [true, true, true, true],
  },
  {
    policy: "commercial-no-ai",
    title: "COMMERCIAL-NO-AI",
    description: "상업 이용 가능, AI 학습 금지",
    checks: [true, true, false, true],
  },
  {
    policy: "personal",
    title: "PERSONAL",
    description: "개인 감상 및 비상업 사용",
    checks: [true, false, false, true],
  },
  {
    policy: "portfolio",
    title: "PORTFOLIO",
    description: "포트폴리오와 전시 중심",
    checks: [false, false, true, true],
  },
  {
    policy: "open",
    title: "OPEN",
    description: "넓은 재사용 허용",
    checks: [true, true, true, true],
  },
];

const columns = ["다운로드", "상업 이용", "2차 수정", "작가 표기"];

export default function ArtworkLicenseForm({
  selectedPolicy,
  onSubmit,
  onBack,
}: ArtworkLicenseFormProps) {
  const [selection, setSelection] = useState<ArtworkLicensePolicy>(
    selectedPolicy || "personal",
  );
  const [agree, setAgree] = useState(false);

  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-11">
      <h1 className="text-3xl font-black tracking-normal">이용 조건 선택</h1>
      <p className="mt-4 max-w-2xl break-keep text-base leading-7 text-[#656B73]">
        구매자가 작품을 어떻게 사용할 수 있는지 정합니다. 기존 NFT 정책
        선택 화면의 구조를 유지하되, 작품 거래에 맞는 라이선스 용어로
        정리했습니다.
      </p>

      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-6 pb-3 text-center text-xs font-black text-[#3F444B]">
            <div className="col-span-2" />
            {columns.map((column) => (
              <div key={column}>{column}</div>
            ))}
          </div>
          {licenseOptions.map((option, index) => (
            <label
              key={option.policy}
              className="grid cursor-pointer grid-cols-6 items-center"
            >
              <input
                type="radio"
                name="license"
                value={option.policy}
                checked={selection === option.policy}
                onChange={() => setSelection(option.policy)}
                className="sr-only"
              />
              <div
                className={cls(
                  "col-span-6 grid min-h-[70px] grid-cols-6 items-center rounded border-b border-[#ECEEF0] px-3 transition",
                  index % 2 === 1 && "bg-[#FAFAFB]",
                  selection === option.policy && "bg-[#FFF4C7]",
                )}
              >
                <div className="col-span-2">
                  <p className="text-sm font-black">{option.title}</p>
                  <p className="mt-1 text-xs text-[#777D84]">
                    {option.description}
                  </p>
                </div>
                {option.checks.map((enabled, checkIndex) => (
                  <div
                    key={`${option.policy}-${checkIndex}`}
                    className="text-center text-lg font-black"
                  >
                    {enabled ? "✓" : "×"}
                  </div>
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>

      <label className="mt-8 flex items-center justify-end gap-2 text-sm text-[#3F444B]">
        <input
          type="checkbox"
          checked={agree}
          onChange={(event) => setAgree(event.target.checked)}
          className="h-5 w-5 accent-[#17191C]"
        />
        선택한 이용 조건을 확인했습니다.
      </label>

      <div className="mt-9 flex justify-end gap-2">
        <button
          type="button"
          onClick={onBack}
          className="h-12 rounded-full border border-[#D8DBDE] px-6 text-sm font-black text-[#3F444B]"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!agree}
          onClick={() => onSubmit(selection)}
          className="h-12 rounded-full bg-[#17191C] px-6 text-sm font-black text-white disabled:bg-[#C9CDD2]"
        >
          계속
        </button>
      </div>
    </section>
  );
}

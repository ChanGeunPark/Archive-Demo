import { formatKrw } from "@/lib/image-marketplace-flow/format";

type OwnerPricePanelProps = {
  isListed: boolean;
  currentAskingPrice: number | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function OwnerPricePanel({
  isListed,
  currentAskingPrice,
  value,
  onChange,
  onSubmit,
  loading,
}: OwnerPricePanelProps) {
  const title = isListed ? "판매가 올리기" : "판매가 설정";
  const hint = isListed
    ? currentAskingPrice
      ? `현재 ${formatKrw(currentAskingPrice)} — 더 높은 금액만 입력할 수 있습니다.`
      : "0원보다 큰 금액을 입력해 주세요."
    : "0원보다 큰 금액을 입력하면 판매중으로 전환됩니다.";

  return (
    <div className="mt-4 rounded-xl border border-zinc-100 p-3">
      <p className="text-xs font-bold text-gray-500">{title}</p>
      <p className="mt-1 text-xs font-medium text-gray-400">{hint}</p>
      <div className="mt-2 flex gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          min={isListed && currentAskingPrice ? currentAskingPrice + 1 : 1}
          placeholder="새 판매가 (원)"
          disabled={loading}
          className="h-11 min-w-0 flex-1 rounded-lg border border-[#D8DBDE] px-3 text-sm outline-none focus:border-[#141416] disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="h-11 shrink-0 rounded-lg bg-[#141416] px-4 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "저장 중..." : "적용"}
        </button>
      </div>
    </div>
  );
}

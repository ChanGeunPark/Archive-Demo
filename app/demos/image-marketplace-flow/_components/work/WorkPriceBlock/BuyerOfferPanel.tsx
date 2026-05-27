type BuyerOfferPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function BuyerOfferPanel({
  value,
  onChange,
  onSubmit,
  loading,
}: BuyerOfferPanelProps) {
  return (
    <div className="mt-4 rounded-xl border border-zinc-100 p-3">
      <p className="text-xs font-bold text-gray-500">
        현재 소유자에게 가격 제안
      </p>
      <div className="mt-2 flex gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          min={0}
          placeholder="금액"
          disabled={loading}
          className="h-11 min-w-0 flex-1 rounded-lg border border-[#D8DBDE] px-3 text-sm outline-none focus:border-[#141416] disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="h-11 rounded-lg bg-[#141416] px-4 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "전송 중..." : "제안"}
        </button>
      </div>
    </div>
  );
}

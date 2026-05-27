import { formatKrw } from "@/lib/image-marketplace-flow/format";
import type { Offer } from "@/lib/image-marketplace-flow/marketplaceTypes";

type OwnerOfferPanelProps = {
  offers: Offer[];
  onAccept: (offer: Offer) => void;
  accepting: boolean;
};

export default function OwnerOfferPanel({
  offers,
  onAccept,
  accepting,
}: OwnerOfferPanelProps) {
  if (offers.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-zinc-100 p-3 text-sm font-semibold text-gray-500">
        아직 대기 중인 가격 제안이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-zinc-100 p-3">
      <p className="text-xs font-bold text-gray-500">받은 가격 제안</p>
      <div className="mt-2 space-y-2">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 p-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">
                {offer.bidder.name}
              </p>
              <p className="text-xs font-semibold text-gray-500">
                {formatKrw(offer.amount)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAccept(offer)}
              disabled={accepting}
              className="h-9 shrink-0 rounded-lg bg-[#141416] px-3 text-xs font-bold text-white disabled:opacity-60"
            >
              {accepting ? "처리 중..." : "수락"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

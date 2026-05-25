"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { WorkItem } from "../chizuData";
import { useMarketplaceStore } from "@/lib/image-marketplace-flow/marketplaceStore";
import type { MarketplaceOffer } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { formatKrw } from "./workUtils";

const EMPTY_OFFERS: MarketplaceOffer[] = [];

export default function WorkPriceBlock({ work }: { work: WorkItem }) {
  const currentUser = useMarketplaceStore((state) => state.currentUser);
  const buyWork = useMarketplaceStore((state) => state.buyWork);
  const createOffer = useMarketplaceStore((state) => state.createOffer);
  const simulateOtherUserPurchase = useMarketplaceStore(
    (state) => state.simulateOtherUserPurchase,
  );
  const acceptOffer = useMarketplaceStore((state) => state.acceptOffer);
  const offers = useMarketplaceStore(
    (state) => state.offersByWorkId[work.id] ?? EMPTY_OFFERS,
  );
  const workRuntimePatch = useMarketplaceStore(
    (state) => state.workStateById[work.id],
  );

  const [offerAmount, setOfferAmount] = useState("");
  const [notice, setNotice] = useState("");

  const runtimeState = useMemo(
    () => ({
      owner: work.owner,
      askingPrice: work.askingPrice,
      lastSalePrice: work.lastSalePrice,
      offerCount: work.offerCount,
      ...workRuntimePatch,
    }),
    [
      work.askingPrice,
      work.lastSalePrice,
      work.offerCount,
      work.owner,
      workRuntimePatch,
    ],
  );

  const owner = runtimeState.owner || work.owner;
  const askingPrice = runtimeState.askingPrice ?? work.askingPrice;
  const lastSalePrice = runtimeState.lastSalePrice ?? work.lastSalePrice;
  const offerCount = runtimeState.offerCount ?? work.offerCount;
  const isOwner = currentUser?.id === owner.id;
  const isListed = typeof askingPrice === "number" && askingPrice > 0;
  const canOffer = !isListed || work.listingStatus === "OFFER_OPEN";
  const pendingOffers = useMemo(
    () => offers.filter((offer) => offer.status === "PENDING"),
    [offers],
  );

  const priceLabel = isListed ? "독점 라이선스 판매가" : "최근 거래가";
  const priceDisplay = isListed
    ? formatKrw(askingPrice)
    : lastSalePrice
      ? formatKrw(lastSalePrice)
      : "가격 제안 가능";

  const handleBuy = () => {
    if (!currentUser) {
      setNotice("ID를 입력해 로그인한 뒤 구매할 수 있습니다.");
      return;
    }

    if (!isListed || !askingPrice) {
      return;
    }

    buyWork(work.id, askingPrice);
    setNotice(
      "구매 완료: 이벤트 payload를 바로 믿지 않고 서버 최신 상태를 다시 조회한 것으로 가정해 소유자 UI를 갱신했습니다.",
    );
  };

  const handleOtherPurchase = () => {
    simulateOtherUserPurchase(work.id, askingPrice || lastSalePrice || work.price);
    setNotice(
      "다른 사용자 구매 이벤트 수신: 이벤트는 갱신 신호로만 사용하고, 상세 API 재조회 결과로 현재 소유자를 갱신했습니다.",
    );
  };

  const handleOffer = () => {
    const amount = Number(offerAmount);
    const offer = createOffer(work.id, amount);
    if (!offer) {
      setNotice("ID 로그인 후 0원보다 큰 금액을 입력해 주세요.");
      return;
    }

    setOfferAmount("");
    setNotice(`${formatKrw(offer.amount)} 가격 제안을 보냈습니다.`);
  };

  const handleAcceptOffer = (offer: MarketplaceOffer) => {
    acceptOffer(work.id, offer.id);
    setNotice(
      `${offer.bidder.name}의 제안을 수락했습니다. 소유권이 제안자에게 이전된 상태로 갱신됩니다.`,
    );
  };

  return (
    <section className="order-2 flex w-full flex-col lg:sticky lg:top-20 lg:w-[365px] lg:self-start lg:px-6 max-lg:order-3">
      <div className="mt-8 flex w-full flex-col max-lg:mt-0">
        <div className="max-lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                작품
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                {work.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                by{" "}
                <span className="font-semibold text-gray-700">
                  {work.artist}
                </span>
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#F4F5F6] px-3 py-1.5 text-xs font-bold text-[#3F444B]">
              {isListed ? "판매중" : "제안 가능"}
            </span>
          </div>
        </div>

        <article className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_30px_rgba(20,20,22,0.06)] max-lg:mt-0">
          <div className="border-t border-zinc-100 px-5 py-4">
            <p className="text-xs font-medium text-gray-500">권리 범위</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {work.usageRights.map((right) => (
                <span
                  key={right.label}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                    right.enabled
                      ? "bg-[#ECFDF5] text-[#047857]"
                      : "bg-zinc-100 text-gray-400"
                  }`}
                >
                  {right.enabled ? "✓" : "×"} {right.label}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/@${work.creator.handle}`}
                className="group rounded-xl bg-zinc-50 p-3 transition hover:bg-zinc-100"
              >
                <p className="text-[11px] font-medium text-gray-500">제작자</p>
                <div className="mt-2 flex items-center gap-2">
                  <Image
                    src={work.creator.avatar}
                    alt={`${work.creator.name} profile`}
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                  />
                  <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                    {work.creator.name}
                  </p>
                </div>
              </Link>

              <Link
                href={`/@${owner.handle}`}
                className="group rounded-xl bg-zinc-50 p-3 transition hover:bg-zinc-100"
              >
                <p className="text-[11px] font-medium text-gray-500">
                  현재 소유자
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Image
                    src={owner.avatar}
                    alt="owner profile"
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                  />
                  <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                    {owner.name}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </article>

        <article className="mt-5">
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs font-medium text-gray-500">{priceLabel}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-gray-900">
              {priceDisplay}
            </p>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              제안 {offerCount + pendingOffers.length}건
            </p>
          </div>

          {isOwner ? (
            <OwnerOfferPanel
              offers={pendingOffers}
              onAccept={handleAcceptOffer}
            />
          ) : isListed ? (
            <button
              type="button"
              onClick={handleBuy}
              className="mt-4 h-12 w-full rounded-xl bg-[#141416] text-sm font-bold text-white transition hover:bg-[#FFE55C] hover:text-black active:scale-[0.98]"
            >
              독점 라이선스 구매
            </button>
          ) : null}

          {!isOwner && canOffer ? (
            <div className="mt-4 rounded-xl border border-zinc-100 p-3">
              <p className="text-xs font-bold text-gray-500">
                현재 소유자에게 가격 제안
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  value={offerAmount}
                  onChange={(event) => setOfferAmount(event.target.value)}
                  type="number"
                  min={0}
                  placeholder="금액"
                  className="h-11 min-w-0 flex-1 rounded-lg border border-[#D8DBDE] px-3 text-sm outline-none focus:border-[#141416]"
                />
                <button
                  type="button"
                  onClick={handleOffer}
                  className="h-11 rounded-lg bg-[#141416] px-4 text-sm font-bold text-white"
                >
                  제안
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleOtherPurchase}
            className="mt-3 h-11 w-full rounded-xl border border-[#D8DBDE] text-sm font-bold text-[#3F444B] transition hover:border-[#141416]"
          >
            다른 사용자가 구매함
          </button>

          {notice ? (
            <p className="mt-3 rounded-xl bg-[#FFF8D7] p-3 text-xs font-semibold leading-5 text-[#6F5600]">
              {notice}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}

function OwnerOfferPanel({
  offers,
  onAccept,
}: {
  offers: MarketplaceOffer[];
  onAccept: (offer: MarketplaceOffer) => void;
}) {
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
              className="h-9 shrink-0 rounded-lg bg-[#141416] px-3 text-xs font-bold text-white"
            >
              수락
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

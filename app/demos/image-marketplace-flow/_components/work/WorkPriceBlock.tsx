"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMarketplaceStore } from "@/lib/image-marketplace-flow/marketplaceStore";
import type {
  Offer,
  Work,
} from "@/lib/image-marketplace-flow/marketplaceTypes";
import { formatKrw } from "./workUtils";
import {
  useAcceptOffer,
  useBuyWork,
  useCreateOffer,
  useDeleteWork,
  useUpdateAskingPrice,
} from "@/lib/image-marketplace-flow/graphql/hooks";
import { readStoredMarketplaceUserId } from "@/lib/image-marketplace-flow/marketplaceAuth";
import { useRouter } from "next/navigation";
import BasicModal from "../modal/BasicModal";
import { Skeleton } from "./Skeleton";

const EMPTY_OFFERS: Offer[] = [];

function WorkPriceBlockSkeleton() {
  return (
    <section className="order-2 mt-2 flex w-full flex-col max-lg:order-3 lg:sticky lg:top-20 lg:w-[365px] lg:self-start lg:px-6 lg:mt-0">
      <div className="mt-8 flex w-full flex-col max-lg:mt-0">
        <div className="max-lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="mt-3 h-9 w-4/5" />
              <Skeleton className="mt-3 h-4 w-32" />
            </div>
            <Skeleton className="h-7 w-16 shrink-0 rounded-full" />
          </div>
        </div>

        <article className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_30px_rgba(20,20,22,0.06)] max-lg:mt-0">
          <div className="border-t border-zinc-100 px-5 py-4">
            <Skeleton className="h-3 w-14" />
            <div className="mt-2 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>

          <div className="border-t border-zinc-100 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((item) => (
                <div key={item} className="rounded-xl bg-zinc-50 p-3">
                  <Skeleton className="h-3 w-12" />
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="mt-5">
          <div className="rounded-xl bg-zinc-50 p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-9 w-40" />
            <Skeleton className="mt-3 h-3 w-16" />
          </div>

          <Skeleton className="mt-4 h-12 w-full rounded-xl" />
          <Skeleton className="mt-4 h-[74px] w-full rounded-xl" />
          <Skeleton className="mt-3 h-11 w-full rounded-xl" />
        </article>
      </div>
    </section>
  );
}

export default function WorkPriceBlock({
  work,
  loading,
}: {
  work?: Work | null;
  loading?: boolean;
}) {
  if (loading || !work) {
    return <WorkPriceBlockSkeleton />;
  }

  return <WorkPriceBlockContent work={work} />;
}

function WorkPriceBlockContent({ work }: { work: Work }) {
  const router = useRouter();
  const currentUser = useMarketplaceStore((state) => state.currentUser);

  const [offerAmount, setOfferAmount] = useState("");
  const [newAskingPrice, setNewAskingPrice] = useState("");
  const [notice, setNotice] = useState("");
  const [showDeleteWorkModal, setShowDeleteWorkModal] = useState(false);

  const owner = work.owner;
  const askingPrice = work.askingPrice;
  const lastSalePrice = work.lastSalePrice;
  const offerCount = work.offerCount;
  const isOwner = currentUser?.id === owner.id;
  const isListed = typeof askingPrice === "number" && askingPrice > 0;
  const canOffer = !isListed || work.listingStatus === "OFFER_OPEN";
  const pendingOffers = useMemo(
    () =>
      (work.offers ?? EMPTY_OFFERS).filter(
        (offer) => offer.status === "PENDING",
      ),
    [work.offers],
  );

  const { buyWork, loading: buyLoading } = useBuyWork({
    onCompleted: () => {
      setNotice(
        "구매가 완료되었습니다. 서버에서 최신 작품 상태를 다시 불러왔습니다.",
      );
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const { createOffer, loading: createOfferLoading } = useCreateOffer({
    onCompleted: () => {
      setOfferAmount("");
      setNotice(
        "가격 제안을 보냈습니다. 서버에서 최신 제안 목록을 다시 불러왔습니다.",
      );
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const { updateAskingPrice, loading: updatePriceLoading } =
    useUpdateAskingPrice({
      onCompleted: () => {
        setNotice(
          "판매가가 반영되었습니다. 서버에서 최신 작품 상태를 다시 불러왔습니다.",
        );
      },
      onError: (error) => {
        setNotice(error.message);
      },
    });

  const { acceptOffer, loading: acceptOfferLoading } = useAcceptOffer({
    onCompleted: () => {
      setNotice(
        "제안을 수락했습니다. 서버에서 최신 소유자 정보를 다시 불러왔습니다.",
      );
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const priceLabel = isListed ? "독점 라이선스 판매가" : "최근 거래가";
  const priceDisplay = isListed
    ? formatKrw(askingPrice)
    : lastSalePrice
      ? formatKrw(lastSalePrice)
      : "가격 제안 가능";

  const handleBuy = async () => {
    if (!currentUser) {
      setNotice("ID를 입력해 로그인한 뒤 구매할 수 있습니다.");
      return;
    }

    if (!isListed || !askingPrice) {
      return;
    }

    await buyWork({
      workId: work.id,
      price: askingPrice,
      buyerId: currentUser.id,
    });
  };

  const handleOffer = async () => {
    if (!currentUser) {
      setNotice("ID 로그인 후 0원보다 큰 금액을 입력해 주세요.");
      return;
    }

    const amount = Number(offerAmount);
    if (amount <= 0) {
      setNotice("0원보다 큰 금액을 입력해 주세요.");
      return;
    }

    await createOffer({
      workId: work.id,
      amount,
      bidderId: currentUser.id,
    });
  };

  const handleAcceptOffer = async (offer: Offer) => {
    if (!currentUser) {
      return;
    }

    await acceptOffer({
      workId: work.id,
      offerId: offer.id,
      ownerId: currentUser.id,
    });
  };

  const handleUpdateAskingPrice = async () => {
    if (!currentUser) {
      setNotice("ID를 입력해 로그인한 뒤 판매가를 변경할 수 있습니다.");
      return;
    }

    const amount = Number(newAskingPrice);
    if (amount <= 0) {
      setNotice("0원보다 큰 금액을 입력해 주세요.");
      return;
    }

    if (isListed && askingPrice && amount <= askingPrice) {
      setNotice("현재 판매가보다 높은 금액만 설정할 수 있습니다.");
      return;
    }

    await updateAskingPrice({
      workId: work.id,
      ownerId: currentUser.id,
      askingPrice: amount,
    });
  };

  const { deleteWork, ...deleteWorkState } = useDeleteWork({
    onCompleted: () => {
      router.push("/demos/image-marketplace-flow");
    },
  });

  const isMyWork = readStoredMarketplaceUserId() === work.owner?.id;

  return (
    <>
      <section className="order-2 flex w-full flex-col lg:sticky lg:top-[64px] lg:w-[365px] lg:self-start lg:px-6 max-lg:order-3 mt-2 lg:mt-0 max-h-[calc(100vh-64px)] overflow-y-auto pb-10">
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
                    {work.creator.name}
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
                  <p className="text-[11px] font-medium text-gray-500">
                    제작자
                  </p>
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
                제안 {offerCount}건
              </p>
            </div>

            {isOwner ? (
              <>
                <OwnerPricePanel
                  isListed={isListed}
                  currentAskingPrice={askingPrice}
                  value={newAskingPrice}
                  onChange={setNewAskingPrice}
                  onSubmit={handleUpdateAskingPrice}
                  loading={updatePriceLoading}
                />
                <OwnerOfferPanel
                  offers={pendingOffers}
                  onAccept={handleAcceptOffer}
                  accepting={acceptOfferLoading}
                />
              </>
            ) : isListed ? (
              <button
                type="button"
                onClick={handleBuy}
                disabled={buyLoading}
                className="mt-4 h-12 w-full rounded-xl bg-[#141416] text-sm font-bold text-white transition hover:bg-[#FFE55C] hover:text-black active:scale-[0.98] disabled:opacity-60"
              >
                {buyLoading ? "구매 처리 중..." : "독점 라이선스 구매"}
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
                    disabled={createOfferLoading}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-[#D8DBDE] px-3 text-sm outline-none focus:border-[#141416] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={handleOffer}
                    disabled={createOfferLoading}
                    className="h-11 rounded-lg bg-[#141416] px-4 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {createOfferLoading ? "전송 중..." : "제안"}
                  </button>
                </div>
              </div>
            ) : null}

            {isMyWork && (
              <button
                type="button"
                onClick={() => {
                  setShowDeleteWorkModal(true);
                }}
                disabled={deleteWorkState.loading}
                className="mt-3 h-11 w-full rounded-xl border border-red-500 text-sm font-bold text-red-500 transition hover:bg-red-600 hover:text-white"
              >
                {deleteWorkState.loading ? "작품 삭제 중..." : "작품 삭제"}
              </button>
            )}

            {notice ? (
              <p className="mt-3 rounded-xl bg-[#FFF8D7] p-3 text-xs font-semibold leading-5 text-[#6F5600]">
                {notice}
              </p>
            ) : null}
          </article>
        </div>
      </section>
      <BasicModal
        showModal={showDeleteWorkModal}
        showModalToggler={() => setShowDeleteWorkModal(!showDeleteWorkModal)}
        currentProcess="INITIAL"
        content={{
          title: "작품 삭제",
          subtitle: "작품을 삭제하시겠습니까?",
          isForm: true,
          onForward: () => {
            deleteWork(work.id);
            setShowDeleteWorkModal(false);
          },
        }}
      />
    </>
  );
}

function OwnerPricePanel({
  isListed,
  currentAskingPrice,
  value,
  onChange,
  onSubmit,
  loading,
}: {
  isListed: boolean;
  currentAskingPrice: number | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
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

function OwnerOfferPanel({
  offers,
  onAccept,
  accepting,
}: {
  offers: Offer[];
  onAccept: (offer: Offer) => void;
  accepting: boolean;
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

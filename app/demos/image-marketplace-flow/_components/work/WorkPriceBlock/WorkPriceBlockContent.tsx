"use client";

import type { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { useWorkPriceActions } from "./useWorkPriceActions";
import WorkPriceBlockMeta from "./WorkPriceBlockMeta";
import WorkPriceBlockActions from "./WorkPriceBlockActions";

export default function WorkPriceBlockContent({ work }: { work: Work }) {
  const {
    currentUser,
    isOwner,
    isListed,
    canOffer,
    pendingOffers,
    askingPrice,
    offerCount,
    priceLabel,
    priceDisplay,
    offerAmount,
    setOfferAmount,
    newAskingPrice,
    setNewAskingPrice,
    notice,
    showDeleteWorkModal,
    setShowDeleteWorkModal,
    handleBuy,
    handleOffer,
    handleAcceptOffer,
    handleUpdateAskingPrice,
    handleDeleteWork,
    buyLoading,
    createOfferLoading,
    updatePriceLoading,
    acceptOfferLoading,
    deleteWorkLoading,
  } = useWorkPriceActions(work);

  return (
    <section className="order-2 flex w-full flex-col lg:sticky lg:top-[64px] lg:w-[365px] lg:self-start lg:px-6 max-lg:order-3 mt-2 lg:mt-0 max-h-[calc(100vh-64px)] overflow-y-auto pb-10 scrollbar-hide">
      <div className="mt-8 flex w-full flex-col max-lg:mt-0">
        <WorkPriceBlockMeta work={work} isListed={isListed} />

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

          <WorkPriceBlockActions
            isLoggedIn={Boolean(currentUser)}
            isOwner={isOwner}
            isListed={isListed}
            canOffer={canOffer}
            askingPrice={askingPrice}
            pendingOffers={pendingOffers}
            offerAmount={offerAmount}
            onOfferAmountChange={setOfferAmount}
            newAskingPrice={newAskingPrice}
            onNewAskingPriceChange={setNewAskingPrice}
            onBuy={handleBuy}
            onOffer={handleOffer}
            onAcceptOffer={handleAcceptOffer}
            onUpdateAskingPrice={handleUpdateAskingPrice}
            buyLoading={buyLoading}
            createOfferLoading={createOfferLoading}
            updatePriceLoading={updatePriceLoading}
            acceptOfferLoading={acceptOfferLoading}
            deleteWorkLoading={deleteWorkLoading}
            showDeleteWorkModal={showDeleteWorkModal}
            onDeleteWorkModalToggle={() =>
              setShowDeleteWorkModal((open) => !open)
            }
            onDeleteWork={handleDeleteWork}
          />

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

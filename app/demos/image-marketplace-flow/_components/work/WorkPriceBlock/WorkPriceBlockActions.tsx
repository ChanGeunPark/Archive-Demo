import type { Offer } from "@/lib/image-marketplace-flow/marketplaceTypes";
import BasicModal from "../../modal/BasicModal";
import OwnerPricePanel from "./OwnerPricePanel";
import OwnerOfferPanel from "./OwnerOfferPanel";
import BuyerOfferPanel from "./BuyerOfferPanel";

type WorkPriceBlockActionsProps = {
  isLoggedIn: boolean;
  isOwner: boolean;
  isListed: boolean;
  canOffer: boolean;
  askingPrice: number | null;
  pendingOffers: Offer[];
  offerAmount: string;
  onOfferAmountChange: (value: string) => void;
  newAskingPrice: string;
  onNewAskingPriceChange: (value: string) => void;
  onBuy: () => void;
  onOffer: () => void;
  onAcceptOffer: (offer: Offer) => void;
  onUpdateAskingPrice: () => void;
  buyLoading: boolean;
  createOfferLoading: boolean;
  updatePriceLoading: boolean;
  acceptOfferLoading: boolean;
  deleteWorkLoading: boolean;
  showDeleteWorkModal: boolean;
  onDeleteWorkModalToggle: () => void;
  onDeleteWork: () => void;
};

export default function WorkPriceBlockActions({
  isLoggedIn,
  isOwner,
  isListed,
  canOffer,
  askingPrice,
  pendingOffers,
  offerAmount,
  onOfferAmountChange,
  newAskingPrice,
  onNewAskingPriceChange,
  onBuy,
  onOffer,
  onAcceptOffer,
  onUpdateAskingPrice,
  buyLoading,
  createOfferLoading,
  updatePriceLoading,
  acceptOfferLoading,
  deleteWorkLoading,
  showDeleteWorkModal,
  onDeleteWorkModalToggle,
  onDeleteWork,
}: WorkPriceBlockActionsProps) {
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {isOwner ? (
        <>
          <OwnerPricePanel
            isListed={isListed}
            currentAskingPrice={askingPrice}
            value={newAskingPrice}
            onChange={onNewAskingPriceChange}
            onSubmit={onUpdateAskingPrice}
            loading={updatePriceLoading}
          />
          <OwnerOfferPanel
            offers={pendingOffers}
            onAccept={onAcceptOffer}
            accepting={acceptOfferLoading}
          />
        </>
      ) : isListed ? (
        <button
          type="button"
          onClick={onBuy}
          disabled={buyLoading}
          className="mt-4 h-12 w-full rounded-xl bg-[#141416] text-sm font-bold text-white transition hover:bg-[#FFE55C] hover:text-black active:scale-[0.98] disabled:opacity-60"
        >
          {buyLoading ? "구매 처리 중..." : "독점 라이선스 구매"}
        </button>
      ) : null}

      {!isOwner && canOffer ? (
        <BuyerOfferPanel
          value={offerAmount}
          onChange={onOfferAmountChange}
          onSubmit={onOffer}
          loading={createOfferLoading}
        />
      ) : null}

      {isOwner ? (
        <button
          type="button"
          onClick={onDeleteWorkModalToggle}
          disabled={deleteWorkLoading}
          className="mt-3 h-11 w-full rounded-xl border border-red-500 text-sm font-bold text-red-500 transition hover:bg-red-600 hover:text-white"
        >
          {deleteWorkLoading ? "작품 삭제 중..." : "작품 삭제"}
        </button>
      ) : null}

      <BasicModal
        showModal={showDeleteWorkModal}
        showModalToggler={onDeleteWorkModalToggle}
        currentProcess="INITIAL"
        content={{
          title: "작품 삭제",
          subtitle: "작품을 삭제하시겠습니까?",
          isForm: true,
          onForward: onDeleteWork,
        }}
      />
    </>
  );
}

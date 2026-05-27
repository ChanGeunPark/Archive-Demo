"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKrw } from "@/lib/image-marketplace-flow/format";
import {
  useAcceptOffer,
  useBuyWork,
  useCreateOffer,
  useDeleteWork,
  useUpdateAskingPrice,
} from "@/lib/image-marketplace-flow/graphql/hooks";
import { useMarketplaceStore } from "@/lib/image-marketplace-flow/marketplaceStore";
import type { Offer, Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";

const EMPTY_OFFERS: Offer[] = [];

export function useWorkPriceActions(work: Work) {
  const router = useRouter();
  const currentUser = useMarketplaceStore((state) => state.currentUser);

  const [offerAmount, setOfferAmount] = useState("");
  const [newAskingPrice, setNewAskingPrice] = useState("");
  const [notice, setNotice] = useState("");
  const [showDeleteWorkModal, setShowDeleteWorkModal] = useState(false);

  const askingPrice = work.askingPrice;
  const lastSalePrice = work.lastSalePrice;
  const isOwner = currentUser?.id === work.owner.id;
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
      setNotice("구매가 완료되었습니다. 최신 작품 상태를 다시 불러왔습니다.");
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const { createOffer, loading: createOfferLoading } = useCreateOffer({
    onCompleted: () => {
      setOfferAmount("");
      setNotice("가격 제안을 보냈습니다. 최신 제안 목록을 다시 불러왔습니다.");
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const { updateAskingPrice, loading: updatePriceLoading } =
    useUpdateAskingPrice({
      onCompleted: () => {
        setNotice(
          "판매가가 반영되었습니다. 최신 작품 상태를 다시 불러왔습니다.",
        );
      },
      onError: (error) => {
        setNotice(error.message);
      },
    });

  const { acceptOffer, loading: acceptOfferLoading } = useAcceptOffer({
    onCompleted: () => {
      setNotice("제안을 수락했습니다. 최신 소유자 정보를 다시 불러왔습니다.");
    },
    onError: (error) => {
      setNotice(error.message);
    },
  });

  const { deleteWork, loading: deleteWorkLoading } = useDeleteWork({
    onCompleted: () => {
      router.push(marketplaceRoutes.discover);
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

  const handleDeleteWork = () => {
    deleteWork(work.id);
    setShowDeleteWorkModal(false);
  };

  return {
    currentUser,
    isOwner,
    isListed,
    canOffer,
    pendingOffers,
    askingPrice,
    offerCount: work.offerCount,
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
  };
}

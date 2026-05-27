import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type { Offer, OwnershipTransferEvent } from "../marketplaceTypes";
import { mapOffer } from "./mappers";
import {
  applyOwnershipTransfer,
  createTransferEvent,
  declinePendingOffers,
  recordOwnershipEvent,
} from "./ownershipTransfer";
import type { OfferRow, UserRow } from "./types";
import { ensureMarketplaceUser } from "./users";
import { getWorkById } from "./works";

async function countPendingOffers(workId: string): Promise<number> {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("marketplace_demo_offers")
    .select("id", { count: "exact", head: true })
    .eq("work_id", workId)
    .eq("status", "PENDING");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

async function syncOfferCount(workId: string) {
  const supabase = createSupabaseAdminClient();
  const offerCount = await countPendingOffers(workId);
  const { error } = await supabase
    .from("marketplace_demo_works")
    .update({ offer_count: offerCount })
    .eq("id", workId);

  if (error) {
    throw new Error(error.message);
  }
}

/** 가격 제안 생성 */
export async function createOffer(input: {
  workId: string;
  amount: number;
  bidderId: string;
}): Promise<Offer> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is not configured.");
  }

  if (input.amount <= 0) {
    throw new Error("Offer amount must be greater than zero.");
  }

  const work = await getWorkById(input.workId);
  if (!work) {
    throw new Error("Work not found.");
  }

  if (work.owner.id === input.bidderId) {
    throw new Error("Owner cannot create an offer on their own work.");
  }

  const canOffer =
    !work.askingPrice ||
    work.askingPrice <= 0 ||
    work.listingStatus === "OFFER_OPEN";
  if (!canOffer) {
    throw new Error("This work is not accepting offers.");
  }

  await ensureMarketplaceUser(input.bidderId);

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("marketplace_demo_offers")
    .insert({
      work_id: input.workId,
      bidder_id: input.bidderId,
      amount: input.amount,
      status: "PENDING",
    })
    .select("*, bidder:marketplace_demo_users!bidder_id(*)")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create offer.");
  }

  await syncOfferCount(input.workId);

  return mapOffer(data as OfferRow & { bidder: UserRow | null });
}

/** 가격 제안 수락 */
export async function acceptOffer(input: {
  workId: string;
  offerId: string;
  ownerId: string;
}): Promise<OwnershipTransferEvent> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is not configured.");
  }

  const work = await getWorkById(input.workId);
  if (!work) {
    throw new Error("Work not found.");
  }

  if (work.owner.id !== input.ownerId) {
    throw new Error("Only the current owner can accept an offer.");
  }

  const offer = work.offers.find(
    (item) => item.id === input.offerId && item.status === "PENDING",
  );
  if (!offer) {
    throw new Error("Pending offer not found.");
  }

  const event = createTransferEvent(
    "OFFER_ACCEPTED",
    input.workId,
    offer.bidder.id,
  );

  const supabase = createSupabaseAdminClient();

  const { error: acceptError } = await supabase
    .from("marketplace_demo_offers")
    .update({ status: "ACCEPTED" })
    .eq("id", input.offerId);

  if (acceptError) {
    throw new Error(acceptError.message);
  }

  const { error: declineError } = await supabase
    .from("marketplace_demo_offers")
    .update({ status: "DECLINED" })
    .eq("work_id", input.workId)
    .eq("status", "PENDING")
    .neq("id", input.offerId);

  if (declineError) {
    throw new Error(declineError.message);
  }

  await applyOwnershipTransfer({
    workId: input.workId,
    creatorId: work.creator.id,
    newOwnerId: offer.bidder.id,
    lastSalePrice: offer.amount,
  });

  await recordOwnershipEvent({
    eventType: "OFFER_ACCEPTED",
    workId: input.workId,
    previousOwnerId: work.owner.id,
    newOwnerId: offer.bidder.id,
    transactionId: event.transactionId,
    payload: { offerId: input.offerId, amount: offer.amount },
  });

  return event;
}

import { hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import type { OwnershipTransferEvent } from "../marketplaceTypes";
import {
  applyOwnershipTransfer,
  createTransferEvent,
  declinePendingOffers,
  recordOwnershipEvent,
} from "./ownershipTransfer";
import { ensureMarketplaceUser } from "./users";
import { getWorkById } from "./works";

/** 독점 라이선스 구매 */
export async function buyWork(input: {
  workId: string;
  price: number;
  buyerId: string;
}): Promise<OwnershipTransferEvent> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is not configured.");
  }

  const work = await getWorkById(input.workId);
  if (!work) {
    throw new Error("Work not found.");
  }

  if (!work.askingPrice || work.askingPrice <= 0) {
    throw new Error("Work is not listed for sale.");
  }

  if (work.askingPrice !== input.price) {
    throw new Error("Price mismatch.");
  }

  if (work.owner.id === input.buyerId) {
    throw new Error("Owner cannot buy their own work.");
  }

  await ensureMarketplaceUser(input.buyerId);

  const event = createTransferEvent(
    "WORK_OWNERSHIP_TRANSFERRED",
    input.workId,
    input.buyerId,
  );

  await applyOwnershipTransfer({
    workId: input.workId,
    creatorId: work.creator.id,
    newOwnerId: input.buyerId,
    lastSalePrice: input.price,
  });

  await declinePendingOffers(input.workId);

  await recordOwnershipEvent({
    eventType: "WORK_OWNERSHIP_TRANSFERRED",
    workId: input.workId,
    previousOwnerId: work.owner.id,
    newOwnerId: input.buyerId,
    transactionId: event.transactionId,
    payload: { price: input.price },
  });

  return event;
}

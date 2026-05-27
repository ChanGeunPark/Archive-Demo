import type { Json } from "@/lib/supabase/database.types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  OwnershipTransferEvent,
  WorkOwnershipStatus,
} from "../marketplaceTypes";
import type { EventRow } from "./types";

export function createTransferEvent(
  type: OwnershipTransferEvent["type"],
  workId: string,
  newOwnerId: string,
): OwnershipTransferEvent {
  return {
    type,
    workId,
    newOwnerId,
    transactionId: `tx-${Date.now()}`,
    occurredAt: new Date().toISOString(),
  };
}

export function resolveOwnershipStatus(
  creatorId: string,
  ownerId: string,
): WorkOwnershipStatus {
  return creatorId === ownerId ? "OWNED_BY_CREATOR" : "OWNED_BY_COLLECTOR";
}

export async function recordOwnershipEvent(input: {
  eventType: EventRow["event_type"];
  workId: string;
  previousOwnerId: string | null;
  newOwnerId: string;
  transactionId: string;
  payload?: Json;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("marketplace_demo_events").insert({
    event_type: input.eventType,
    work_id: input.workId,
    previous_owner_id: input.previousOwnerId,
    new_owner_id: input.newOwnerId,
    transaction_id: input.transactionId,
    payload: input.payload ?? {},
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function declinePendingOffers(workId: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("marketplace_demo_offers")
    .update({ status: "DECLINED" })
    .eq("work_id", workId)
    .eq("status", "PENDING");

  if (error) {
    throw new Error(error.message);
  }
}

export async function applyOwnershipTransfer(input: {
  workId: string;
  creatorId: string;
  newOwnerId: string;
  lastSalePrice: number;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("marketplace_demo_works")
    .update({
      owner_id: input.newOwnerId,
      ownership_status: resolveOwnershipStatus(
        input.creatorId,
        input.newOwnerId,
      ),
      listing_status: "NOT_LISTED",
      asking_price: null,
      last_sale_price: input.lastSalePrice,
      offer_count: 0,
    })
    .eq("id", input.workId);

  if (error) {
    throw new Error(error.message);
  }
}

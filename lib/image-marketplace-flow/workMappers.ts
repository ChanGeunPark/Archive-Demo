import type { WorkItem } from "@/app/demos/image-marketplace-flow/_components/chizuData";
import type { ListingStatus, UsageRight, Work } from "./marketplaceTypes";

const DEFAULT_USAGE_RIGHTS: UsageRight[] = [
  { label: "상업적 이용 가능", enabled: true },
  { label: "독점 사용권 이전", enabled: true },
  { label: "2차 수정 가능", enabled: true },
  { label: "재판매 가능", enabled: false },
];

function resolveWorkStatus(
  listingStatus: ListingStatus,
  askingPrice: number | null,
): WorkItem["status"] {
  if (listingStatus === "LISTED" && askingPrice) {
    return "Buy now";
  }

  return "Offer";
}

export function mapWorkToWorkItem(work: Work): WorkItem {
  const price = work.askingPrice ?? work.lastSalePrice ?? 0;

  return {
    id: work.id,
    title: work.title,
    artist: work.creator.name,
    image: work.imageUrl,
    price,
    width: work.width,
    height: work.height,
    tags: work.tags,
    status: resolveWorkStatus(work.listingStatus, work.askingPrice),
    creator: work.creator,
    owner: work.owner,
    ownershipStatus: work.ownershipStatus,
    listingStatus: work.listingStatus,
    askingPrice: work.askingPrice,
    lastSalePrice: work.lastSalePrice,
    offerCount: work.offerCount,
    usageRights: work.usageRights.length > 0 ? work.usageRights : DEFAULT_USAGE_RIGHTS,
  };
}

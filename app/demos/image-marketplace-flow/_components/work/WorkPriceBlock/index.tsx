import type { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import WorkPriceBlockSkeleton from "./WorkPriceBlockSkeleton";
import WorkPriceBlockContent from "./WorkPriceBlockContent";

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

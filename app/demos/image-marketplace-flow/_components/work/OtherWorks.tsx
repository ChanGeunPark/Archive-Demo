import Link from "next/link";
import type { ReactNode } from "react";
import MasonryImageCard from "../card/MasonryImageCard";
import OrderedMasonry from "../layout/OrderedMasonry";
import KeyboardArrowRightIcon from "@/components/icons/arrow/KeyboardArrowRightIcon";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import { Skeleton } from "./Skeleton";
import { useQuery } from "@apollo/client/react";
import type { WorksQueryWork } from "@/lib/image-marketplace-flow/graphql/types";
import {
  CreatorWorksQueryResponse,
  CreatorWorksQueryVariables,
  RandomWorksQueryResponse,
  RandomWorksQueryVariables,
} from "@/lib/image-marketplace-flow/graphql/types";
import {
  CREATOR_WORKS_QUERY,
  RANDOM_WORKS_QUERY,
} from "@/lib/image-marketplace-flow/graphql/operations";

const OTHER_WORKS_LIMIT = 10;
const DISCOVER_PATH = marketplaceRoutes.discover;

function OtherWorkItem({
  children,
}: {
  children: ReactNode;
  stdHeight: number;
}) {
  return <article>{children}</article>;
}

const SKELETON_CARD_RATIOS = [
  "4/5",
  "3/4",
  "5/6",
  "4/5",
  "3/5",
  "4/5",
] as const;

function OtherWorksSkeleton() {
  return (
    <section className="mt-[62px] w-full max-w-full">
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-10 w-20 rounded-full" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 pb-9 sm:grid-cols-2 xl:grid-cols-3">
        {SKELETON_CARD_RATIOS.map((ratio, index) => (
          <article key={index} className="overflow-hidden rounded-[12px]">
            <Skeleton
              className="w-full rounded-[12px]"
              style={{ aspectRatio: ratio }}
            />
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-1.5 h-3 w-1/2" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkCards({ works }: { works: WorksQueryWork[] }) {
  return (
    <OrderedMasonry
      className="-ml-5 flex w-auto"
      columnClassName="flex min-w-0 flex-col gap-5 pl-5"
      breakpointCols={{ default: 3, 1280: 2, 1024: 2, 640: 1 }}
    >
      {works.map((work) => (
        <OtherWorkItem key={work.id} stdHeight={work.height / work.width}>
          <MasonryImageCard
            imgUrl={work.imageUrl}
            width={work.width}
            height={work.height}
            title={work.title}
            link={marketplaceRoutes.work(work.id)}
            buyNowPrice={work.askingPrice || undefined}
            userProfile={work.owner.avatar}
            userScreenName={work.owner.handle || work.owner.id}
            userAddress={work.owner.handle || work.owner.id}
          />
        </OtherWorkItem>
      ))}
    </OrderedMasonry>
  );
}

export default function OtherWorks({
  currentId,
  creatorId,
  creatorHandle,
  creatorName,
  loading: parentLoading,
}: {
  currentId?: string;
  creatorId?: string;
  creatorHandle?: string;
  creatorName?: string;
  loading?: boolean;
}) {
  const {
    data: creatorData,
    loading: creatorWorksLoading,
  } = useQuery<CreatorWorksQueryResponse, CreatorWorksQueryVariables>(
    CREATOR_WORKS_QUERY,
    {
      variables: {
        creatorId: creatorId!,
        first: OTHER_WORKS_LIMIT,
        excludeWorkId: currentId,
      },
      skip: !creatorId,
    },
  );

  const creatorWorks = creatorData?.creatorWorks ?? [];
  const shouldFetchRandomWorks =
    Boolean(creatorId) &&
    !parentLoading &&
    !creatorWorksLoading &&
    creatorWorks.length === 0;

  const { data: randomData, loading: randomWorksLoading } = useQuery<
    RandomWorksQueryResponse,
    RandomWorksQueryVariables
  >(RANDOM_WORKS_QUERY, {
    variables: {
      first: OTHER_WORKS_LIMIT,
      excludeWorkId: currentId,
    },
    skip: !shouldFetchRandomWorks,
  });

  const isRandomFallback = creatorWorks.length === 0;
  const works = isRandomFallback
    ? (randomData?.randomWorks ?? [])
    : creatorWorks;

  const isLoading =
    parentLoading ||
    !creatorId ||
    creatorWorksLoading ||
    (shouldFetchRandomWorks && randomWorksLoading);

  if (isLoading) {
    return <OtherWorksSkeleton />;
  }

  if (works.length === 0) {
    return null;
  }

  const title = isRandomFallback
    ? "추천 작품"
    : creatorName
      ? `${creatorName}의 다른 작품`
      : "제작자의 다른 작품";

  const moreLinkPath = isRandomFallback
    ? DISCOVER_PATH
    : creatorHandle
      ? marketplaceRoutes.user(creatorHandle)
      : DISCOVER_PATH;

  return (
    <section className="mt-[62px] w-full max-w-full">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">{title}</h2>
        <Link
          href={moreLinkPath}
          className="flex h-10 items-center rounded-full px-1 text-[13px] font-semibold text-gray-800 hover:bg-transparent"
        >
          더보기{" "}
          <span className="ml-1">
            <KeyboardArrowRightIcon />
          </span>
        </Link>
      </div>

      <div className="mt-5 pb-9">
        <WorkCards works={works} />
      </div>
    </section>
  );
}

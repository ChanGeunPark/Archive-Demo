"use client";

import { useCallback, useLayoutEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import HistoryWork from "./work/HistoryWork";
import OtherWorks from "./work/OtherWorks";
import WorkContentsDetail from "./work/WorkContentsDetail";
import WorkHeader from "./work/WorkHeader";
import {
  WorkDesktopHeroImage,
  WorkMobileHeroImage,
} from "./work/WorkHeroImage";
import WorkPriceBlock from "./work/WorkPriceBlock";
import { useQuery } from "@apollo/client/react";
import { WorkDetailQueryResponse } from "@/lib/image-marketplace-flow/graphql/types";
import { WORK_DETAIL_QUERY } from "@/lib/image-marketplace-flow/graphql/operations";
import { seedWorkDetailCache } from "@/lib/image-marketplace-flow/graphql/seedWorkDetailCache";
import { useWorkRealtime } from "@/lib/image-marketplace-flow/useWorkRealtime";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import { marketplaceClient } from "@/lib/image-marketplace-flow/apolloClient";
import ScrollToTop from "./work/ScrollToTop";
import type { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";

type WorkMainProps = {
  id: string;
  initialWork?: Work | null;
};

export default function WorkMain({ id, initialWork }: WorkMainProps) {
  const router = useRouter();

  useLayoutEffect(() => {
    if (initialWork?.id === id) {
      seedWorkDetailCache(marketplaceClient, initialWork);
    }
  }, [id, initialWork]);

  const { data, loading, error, refetch } = useQuery<
    WorkDetailQueryResponse,
    { id: string }
  >(WORK_DETAIL_QUERY, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  const work =
    data?.work ?? (initialWork?.id === id ? initialWork : undefined);
  const isInitialLoading = loading && !work;

  const handleWorkDeleted = useCallback(() => {
    router.replace(marketplaceRoutes.discover);
  }, [router]);

  const handleWorkChange = useCallback(async () => {
    const result = await refetch({ id });
    if (!result.data?.work) {
      router.replace(marketplaceRoutes.discover);
    }
  }, [id, refetch, router]);

  useWorkRealtime({
    workId: id,
    onWorkChange: () => {
      void handleWorkChange();
    },
    onWorkDeleted: handleWorkDeleted,
  });

  let content: ReactNode;

  if (error) {
    content = <div>Error: {error.message}</div>;
  } else if (!isInitialLoading && !work) {
    content = (
      <main className="min-h-screen bg-white px-6 py-16 text-center text-sm font-medium text-gray-500">
        삭제되었거나 존재하지 않는 작품입니다.
      </main>
    );
  } else {
    content = (
      <main className="min-h-screen bg-white text-[#141416]">
        <WorkHeader />

        <div className="container mx-auto">
          <div className="h-full w-full">
            <WorkMobileHeroImage work={work} loading={isInitialLoading} />

            <article className="mx-auto flex flex-wrap px-[24px] lg:px-[96px] max-lg:flex-col">
              <WorkDesktopHeroImage work={work} loading={isInitialLoading} />
              <WorkPriceBlock work={work} loading={isInitialLoading} />

              <section className="order-3 mt-14 w-[calc(100%-365px)] max-lg:order-2 max-lg:mt-6 max-lg:w-full">
                <WorkContentsDetail work={work} loading={isInitialLoading} />
              </section>

              <div className="order-4 w-[calc(100%-365px)] max-lg:w-full">
                <HistoryWork work={work} loading={isInitialLoading} />
                <OtherWorks
                  currentId={work?.id}
                  creatorId={work?.creator?.id}
                  creatorHandle={work?.creator?.handle}
                  creatorName={work?.creator?.name}
                  loading={isInitialLoading}
                />
              </div>
            </article>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <ScrollToTop dep={id} />
      {content}
    </>
  );
}

"use client";

import { useCallback, useEffect } from "react";
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
import { useWorkDetailStore } from "@/lib/image-marketplace-flow/workDetailStore";
import { useWorkRealtime } from "@/lib/image-marketplace-flow/useWorkRealtime";

const DISCOVER_PATH = "/demos/image-marketplace-flow";

export default function WorkMain({ id }: { id: string }) {
  const router = useRouter();
  const forceUpdateTrigger = useWorkDetailStore(
    (state) => state.forceUpdateTrigger,
  );
  const pendingWorkId = useWorkDetailStore((state) => state.pendingWorkId);
  const clearRefresh = useWorkDetailStore((state) => state.clearRefresh);

  const { data, loading, error, refetch } = useQuery<
    WorkDetailQueryResponse,
    { id: string }
  >(WORK_DETAIL_QUERY, {
    variables: { id },
    fetchPolicy: "network-only",
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });

  const isInitialLoading =
    loading && (!data?.work || data.work.id !== id);

  useEffect(() => {
    if (!forceUpdateTrigger || pendingWorkId !== id) {
      return;
    }

    void refetch({ id }).finally(() => {
      clearRefresh();
    });
  }, [clearRefresh, forceUpdateTrigger, id, pendingWorkId, refetch]);

  const handleWorkDeleted = useCallback(() => {
    router.replace(DISCOVER_PATH);
  }, [router]);

  const handleWorkChange = useCallback(async () => {
    const result = await refetch({ id });
    if (!result.data?.work) {
      router.replace(DISCOVER_PATH);
    }
  }, [id, refetch, router]);

  useWorkRealtime({
    workId: id,
    onWorkChange: () => {
      void handleWorkChange();
    },
    onWorkDeleted: handleWorkDeleted,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isInitialLoading && !data?.work) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-center text-sm font-medium text-gray-500">
        삭제되었거나 존재하지 않는 작품입니다.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#141416]">
      <WorkHeader />

      <div className="container mx-auto">
        <div className="h-full w-full">
          <WorkMobileHeroImage work={data?.work} loading={isInitialLoading} />

          <article className="mx-auto flex flex-wrap px-[24px] lg:px-[96px] max-lg:flex-col">
            <WorkDesktopHeroImage work={data?.work} loading={isInitialLoading} />
            <WorkPriceBlock work={data?.work} loading={isInitialLoading} />

            <section className="order-3 mt-14 w-[calc(100%-365px)] max-lg:order-2 max-lg:mt-6 max-lg:w-full">
              <WorkContentsDetail work={data?.work} loading={isInitialLoading} />
            </section>

            <div className="order-4 w-[calc(100%-365px)] max-lg:w-full">
              <HistoryWork work={data?.work} loading={isInitialLoading} />
              <OtherWorks currentId={data?.work?.id} loading={isInitialLoading} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

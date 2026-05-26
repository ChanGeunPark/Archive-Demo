"use client";

import { useEffect } from "react";
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

export default function WorkMain({ id }: { id: string }) {
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
    },
  );

  useEffect(() => {
    if (!forceUpdateTrigger || pendingWorkId !== id) {
      return;
    }

    void refetch({ id }).finally(() => {
      clearRefresh();
    });
  }, [clearRefresh, forceUpdateTrigger, id, pendingWorkId, refetch]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-white text-[#141416]">
      <WorkHeader />

      <div className="container mx-auto">
        <div className="h-full w-full">
          <WorkMobileHeroImage work={data?.work} loading={loading} />

          <article className="mx-auto flex flex-wrap px-[24px] lg:px-[96px] max-lg:flex-col">
            <WorkDesktopHeroImage work={data?.work} loading={loading} />
            <WorkPriceBlock work={data?.work} loading={loading} />

            <section className="order-3 mt-14 w-[calc(100%-365px)] max-lg:order-2 max-lg:mt-6 max-lg:w-full">
              <WorkContentsDetail work={data?.work} loading={loading} />
            </section>

            <div className="order-4 w-[calc(100%-365px)] max-lg:w-full">
              <HistoryWork work={data?.work} loading={loading} />
              <OtherWorks currentId={data?.work?.id} loading={loading} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

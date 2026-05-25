"use client";

import type { WorkItem } from "./chizuData";
import HistoryWork from "./work/HistoryWork";
import OtherWorks from "./work/OtherWorks";
import WorkContentsDetail from "./work/WorkContentsDetail";
import WorkHeader from "./work/WorkHeader";
import {
  WorkDesktopHeroImage,
  WorkMobileHeroImage,
} from "./work/WorkHeroImage";
import WorkPriceBlock from "./work/WorkPriceBlock";

export default function WorkMain({ work }: { work: WorkItem }) {
  return (
    <main className="min-h-screen bg-white text-[#141416]">
      <WorkHeader />

      <div className="container mx-auto">
        <div className="h-full w-full">
          <WorkMobileHeroImage work={work} />

          <article className="mx-auto flex flex-wrap px-[24px] lg:px-[96px] max-lg:flex-col">
            <WorkDesktopHeroImage work={work} />
            <WorkPriceBlock work={work} />

            <section className="order-3 mt-14 w-[calc(100%-365px)] max-lg:order-2 max-lg:mt-6 max-lg:w-full">
              <WorkContentsDetail work={work} />
            </section>

            <div className="order-4 w-[calc(100%-365px)] max-lg:w-full">
              <HistoryWork work={work} />
              <OtherWorks currentId={work.id} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

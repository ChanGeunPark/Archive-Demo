import WorkHeader from "./WorkHeader";
import WorkPriceBlockSkeleton from "./WorkPriceBlock/WorkPriceBlockSkeleton";
import { Skeleton } from "./Skeleton";

function WorkMobileHeroImageSkeleton() {
  return (
    <div className="flex w-full justify-center overflow-hidden lg:hidden">
      <figure className="w-full bg-white">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
      </figure>
    </div>
  );
}

function WorkDesktopHeroImageSkeleton() {
  return (
    <label className="order-1 flex w-[calc(100%-365px)] justify-center overflow-hidden bg-white max-w-full max-lg:w-full">
      <figure className="relative flex h-[90vh] w-full items-center justify-center bg-zinc-100 max-lg:hidden">
        <Skeleton className="h-[min(72vh,640px)] w-[min(88%,520px)] rounded-xl" />
      </figure>
    </label>
  );
}

export default function WorkMainSkeleton() {
  return (
    <main className="min-h-screen bg-white text-[#141416]">
      <WorkHeader />

      <div className="container mx-auto">
        <div className="h-full w-full">
          <WorkMobileHeroImageSkeleton />

          <article className="mx-auto flex flex-wrap px-[24px] lg:px-[96px] max-lg:flex-col">
            <WorkDesktopHeroImageSkeleton />
            <WorkPriceBlockSkeleton />

            <section className="order-3 mt-14 w-[calc(100%-365px)] max-lg:order-2 max-lg:mt-6 max-lg:w-full">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}

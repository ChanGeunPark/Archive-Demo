import { Skeleton } from "../Skeleton";

export default function WorkPriceBlockSkeleton() {
  return (
    <section className="order-2 mt-2 flex w-full flex-col max-lg:order-3 lg:sticky lg:top-20 lg:w-[365px] lg:self-start lg:px-6 lg:mt-0">
      <div className="mt-8 flex w-full flex-col max-lg:mt-0">
        <div className="max-lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="mt-3 h-9 w-4/5" />
              <Skeleton className="mt-3 h-4 w-32" />
            </div>
            <Skeleton className="h-7 w-16 shrink-0 rounded-full" />
          </div>
        </div>

        <article className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_30px_rgba(20,20,22,0.06)] max-lg:mt-0">
          <div className="border-t border-zinc-100 px-5 py-4">
            <Skeleton className="h-3 w-14" />
            <div className="mt-2 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>

          <div className="border-t border-zinc-100 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((item) => (
                <div key={item} className="rounded-xl bg-zinc-50 p-3">
                  <Skeleton className="h-3 w-12" />
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="mt-5">
          <div className="rounded-xl bg-zinc-50 p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-9 w-40" />
            <Skeleton className="mt-3 h-3 w-16" />
          </div>

          <Skeleton className="mt-4 h-12 w-full rounded-xl" />
          <Skeleton className="mt-4 h-[74px] w-full rounded-xl" />
          <Skeleton className="mt-3 h-11 w-full rounded-xl" />
        </article>
      </div>
    </section>
  );
}

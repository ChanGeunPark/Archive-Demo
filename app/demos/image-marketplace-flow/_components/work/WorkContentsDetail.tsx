import Link from "next/link";
import { getArtworkTagLabel } from "@/lib/image-marketplace-flow/artworkTags";
import { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import { Skeleton } from "./Skeleton";
import { IoCheckmark } from "react-icons/io5";

function WorkContentsDetailSkeleton() {
  return (
    <section className="w-full">
      <div className="hidden max-lg:block">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-3 h-4 w-36" />
      </div>

      <article className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white max-lg:mt-6">
        <div className="flex h-[52px] items-center px-4">
          <Skeleton className="h-4 w-10" />
        </div>

        <div className="border-t border-gray-100 px-4 py-[21px]">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {[0, 1, 2, 3].map((section) => (
            <div key={section} className="mt-6 w-full">
              <Skeleton className="h-3 w-16" />
              {section === 3 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-14 rounded-full" />
                </div>
              ) : section === 1 ? (
                <Skeleton className="mt-2 h-[72px] w-full rounded-lg" />
              ) : section === 2 ? (
                <div className="mt-2 flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              )}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default function WorkContentsDetail({
  work,
  loading,
}: {
  work?: Work | null;
  loading?: boolean;
}) {
  if (loading || !work) {
    return <WorkContentsDetailSkeleton />;
  }

  return (
    <section className="w-full">
      <div className="hidden max-lg:block">
        <p className="text-sm font-semibold text-gray-400">작품</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">{work.title}</h1>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          by {work.creator.name}
        </p>
      </div>

      <article className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white max-lg:mt-6">
        <div className="flex h-[52px] items-center px-4">
          <h2 className="text-sm font-semibold text-gray-500">상세</h2>
        </div>

        <div className="border-t border-gray-100 px-4 py-[21px]">
          <p className="text-sm font-medium leading-6 text-gray-700">
            {work.description}
          </p>
          {/* 
          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">연령 등급</h3>
            <div className="mt-2 inline-flex items-center">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#05A67B] text-[10px] font-black text-white">
                <IoCheckmark className="w-3 h-3" />
              </span>
              <p className="ml-1.5 text-sm font-semibold text-gray-800">
                All age
              </p>
            </div>
          </div> */}

          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">태그</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <Link
                  key={tag}
                  href={marketplaceRoutes.discover}
                  className="inline-flex rounded-full bg-[#F3F4F8] px-3 py-1 text-xs font-semibold text-gray-800 transition hover:bg-[#FFE55C]"
                >
                  #{getArtworkTagLabel(tag)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

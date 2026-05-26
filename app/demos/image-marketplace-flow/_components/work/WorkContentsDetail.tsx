import Image from "next/image";
import Link from "next/link";
import { getArtworkTagLabel } from "@/lib/image-marketplace-flow/artworkTags";
import { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { Skeleton } from "./Skeleton";

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
            {work.title}는 Chizu 아카이브 데모를 위해 구성된 이미지 작품입니다.
            구매 이후에도 작품은 마켓플레이스에 남고, 현재 소유자에게 가격
            제안을 보낼 수 있는 독점 라이선스 거래 흐름을 보여줍니다.
          </p>

          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">거래 모델</h3>
            <p className="mt-2 rounded-lg bg-[#F8FAFC] p-3 text-sm font-medium leading-6 text-gray-700">
              이벤트 payload는 소유권 변경의 근거로 직접 사용하지 않고, “상세
              정보를 다시 조회해야 한다”는 신호로만 사용합니다. UI는 서버 기준의
              현재 소유자, 최근 거래가, 제안 수를 다시 반영하는 것으로
              구성했습니다.
            </p>
          </div>

          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">컬렉션</h3>
            <Link
              href="/demos/image-marketplace-flow"
              className="mt-2 inline-flex max-w-full items-center rounded-lg transition-all hover:opacity-80"
            >
              <Image
                src="/images/marketplace/mock/mymyberries-autumn-9079361_1920.jpg"
                alt="collection"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-cover"
              />
              <p className="ml-[6px] truncate text-sm font-semibold text-gray-800">
                Signal Garden
              </p>
            </Link>
          </div>

          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">연령 등급</h3>
            <div className="mt-2 inline-flex items-center">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#05A67B] text-[10px] font-black text-white">
                ✓
              </span>
              <p className="ml-1.5 text-sm font-semibold text-gray-800">
                All age
              </p>
            </div>
          </div>

          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">태그</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <Link
                  key={tag}
                  href="/demos/image-marketplace-flow"
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

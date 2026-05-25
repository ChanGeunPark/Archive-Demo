import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "../chizuData";

export default function WorkContentsDetail({ work }: { work: WorkItem }) {
  return (
    <section className="w-full">
      <div className="hidden max-lg:block">
        <p className="text-sm font-semibold text-gray-400">작품</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">{work.title}</h1>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          by {work.artist}
        </p>
      </div>

      <article className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white max-lg:mt-6">
        <div className="flex h-[52px] items-center px-4">
          <h2 className="text-sm font-semibold text-gray-500">상세</h2>
        </div>

        <div className="border-t border-gray-100 px-4 py-[21px]">
          <p className="text-sm font-medium leading-6 text-gray-700">
            {work.title}는 Chizu 아카이브 데모를 위해 구성된 이미지 작품입니다.
            라이선스, 소유자, 태그, 히스토리 정보가 한 화면에서 이어지도록
            WorkUI의 상세 페이지 흐름을 따릅니다.
          </p>

          <div className="mt-6 w-full">
            <h3 className="text-xs font-medium text-gray-500">컬렉션</h3>
            <Link
              href="/demos/image-marketplace-flow"
              className="mt-2 inline-flex max-w-full items-center rounded-lg transition-all hover:opacity-80"
            >
              <Image
                src="/images/chizu/cover_default_1.png"
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
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

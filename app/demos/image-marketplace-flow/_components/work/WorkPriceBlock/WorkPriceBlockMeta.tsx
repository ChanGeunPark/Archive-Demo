import Image from "next/image";
import Link from "next/link";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import type { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";

type WorkPriceBlockMetaProps = {
  work: Work;
  isListed: boolean;
};

export default function WorkPriceBlockMeta({
  work,
  isListed,
}: WorkPriceBlockMetaProps) {
  const owner = work.owner;

  return (
    <>
      <div className="max-lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              작품
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
              {work.title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              by{" "}
              <span className="font-semibold text-gray-700">
                {work.creator.name}
              </span>
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-[#F4F5F6] px-3 py-1.5 text-xs font-bold text-[#3F444B]">
            {isListed ? "판매중" : "제안 가능"}
          </span>
        </div>
      </div>

      <article className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_8px_30px_rgba(20,20,22,0.06)] max-lg:mt-0">
        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="text-xs font-medium text-gray-500">권리 범위</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {work.usageRights.map((right) => (
              <span
                key={right.label}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                  right.enabled
                    ? "bg-[#ECFDF5] text-[#047857]"
                    : "bg-zinc-100 text-gray-400"
                }`}
              >
                {right.enabled ? "✓" : "×"} {right.label}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-100 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={marketplaceRoutes.userProfile(work.creator.handle)}
              className="group rounded-xl bg-zinc-50 p-3 transition hover:bg-zinc-100"
            >
              <p className="text-[11px] font-medium text-gray-500">제작자</p>
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={work.creator.avatar}
                  alt={`${work.creator.name} profile`}
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                />
                <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                  {work.creator.name}
                </p>
              </div>
            </Link>

            <Link
              href={marketplaceRoutes.userProfile(owner.handle)}
              className="group rounded-xl bg-zinc-50 p-3 transition hover:bg-zinc-100"
            >
              <p className="text-[11px] font-medium text-gray-500">
                현재 소유자
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={owner.avatar}
                  alt="owner profile"
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white"
                />
                <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                  {owner.name}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

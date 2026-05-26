import Image from "next/image";
import type { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import { Skeleton } from "./Skeleton";

type WorkHeroImageProps = {
  work?: Work | null;
  loading?: boolean;
};

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

export function WorkMobileHeroImage({ work, loading }: WorkHeroImageProps) {
  if (loading || !work) {
    return <WorkMobileHeroImageSkeleton />;
  }

  return (
    <div className="flex w-full justify-center overflow-hidden max-w-full lg:hidden">
      <figure className="w-full bg-white">
        <Image
          src={work.imageUrl}
          height={work.height}
          width={work.width}
          className="h-auto w-full! object-contain! bg-white"
          alt={work.title}
        />
      </figure>
    </div>
  );
}

export function WorkDesktopHeroImage({ work, loading }: WorkHeroImageProps) {
  if (loading || !work) {
    return <WorkDesktopHeroImageSkeleton />;
  }

  return (
    <label className="order-1 flex w-[calc(100%-365px)] cursor-pointer justify-center overflow-hidden bg-white max-w-full max-lg:w-full">
      <figure className="relative flex h-[90vh] w-full items-center justify-center transition-all max-lg:hidden bg-zinc-100">
        <div
          className="relative mx-auto block max-h-full max-w-full"
          style={{
            aspectRatio: `${work.width}/${work.height}`,
            width: work.width > work.height ? "100%" : "auto",
            height: work.width > work.height ? "auto" : "100%",
          }}
        >
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            sizes="(min-width: 1024px) calc(100vw - 560px), 100vw"
            className="object-contain"
          />
        </div>
      </figure>
    </label>
  );
}

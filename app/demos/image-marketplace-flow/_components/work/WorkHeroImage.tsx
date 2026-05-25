import Image from "next/image";
import type { WorkItem } from "../chizuData";

export function WorkMobileHeroImage({ work }: { work: WorkItem }) {
  return (
    <div className="flex w-full justify-center overflow-hidden max-w-full lg:hidden">
      <figure className="w-full bg-white">
        <Image
          src={work.image}
          height={work.height}
          width={work.width}
          className="h-auto w-full! object-contain! bg-white"
          alt={work.title}
        />
      </figure>
    </div>
  );
}

export function WorkDesktopHeroImage({ work }: { work: WorkItem }) {
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
            src={work.image}
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

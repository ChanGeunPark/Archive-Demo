import Image from "next/image";

export default function ArtworkPreview({
  previewImage,
}: {
  previewImage: string;
}) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" className="peer hidden" />
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.25rem] bg-white shadow-[0_14px_36px_rgba(23,25,28,0.13)]">
        <Image
          src={previewImage}
          alt="작품 미리보기"
          fill
          sizes="(min-width: 1024px) 402px, 100vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <Image
        src={previewImage}
        alt="확대된 작품 미리보기"
        width={1200}
        height={1200}
        unoptimized
        className="hidden object-contain peer-checked:fixed peer-checked:left-1/2 peer-checked:top-1/2 peer-checked:z-[52] peer-checked:flex peer-checked:max-h-[90vh] peer-checked:max-w-[90vw] peer-checked:-translate-x-1/2 peer-checked:-translate-y-1/2"
      />
      <div className="fixed left-0 top-0 z-[51] hidden h-full w-full bg-black/70 peer-checked:block" />
    </label>
  );
}

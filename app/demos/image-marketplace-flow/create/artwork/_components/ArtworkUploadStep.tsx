"use client";

import { useRef } from "react";

type ArtworkUploadStepProps = {
  onUpload: (files: File[]) => void;
};

export default function ArtworkUploadStep({ onUpload }: ArtworkUploadStepProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
      <h1 className="text-3xl font-black tracking-normal">작품 이미지 등록</h1>
      <p className="mt-4 max-w-2xl break-keep text-base leading-7 text-[#656B73]">
        판매할 작품의 대표 이미지를 업로드해 주세요. JPG, PNG, GIF 이미지를
        사용할 수 있으며 등록 과정에서 우측 미리보기로 확인할 수 있습니다.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className="mt-10 flex min-h-[280px] w-full flex-col items-center justify-center rounded-[1.25rem] border-2 border-dashed border-[#D8DBDE] bg-[#FAFAFB] px-6 text-center transition hover:border-[#17191C] hover:bg-white"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#17191C] text-3xl font-light text-white">
          +
        </span>
        <span className="mt-5 text-lg font-black">이미지를 끌어오거나 클릭</span>
        <span className="mt-2 text-sm text-[#777D84]">
          작품 마켓플레이스에 노출될 대표 이미지를 선택하세요.
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </section>
  );
}

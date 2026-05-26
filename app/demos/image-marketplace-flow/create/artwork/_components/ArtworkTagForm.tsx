"use client";

import { useState } from "react";
import { cls } from "@/lib/client/utils";
import {
  artworkTagCategories,
  getArtworkTagLabel,
} from "@/lib/image-marketplace-flow/artworkTags";

type ArtworkTagFormProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export default function ArtworkTagForm({
  tags,
  onAddTag,
  onDeleteTag,
  onBack,
  onSubmit,
}: ArtworkTagFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(
    artworkTagCategories[0].id,
  );

  const activeCategory =
    artworkTagCategories.find((category) => category.id === activeCategoryId) ||
    artworkTagCategories[0];

  const addTag = () => {
    onAddTag(tagInput);
    setTagInput("");
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      onDeleteTag(tag);
      return;
    }

    onAddTag(tag);
  };

  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-normal">태그 추가</h1>
          <p className="mt-4 max-w-2xl break-keep text-base leading-7 text-[#656B73]">
            대분류를 고른 뒤 하위 태그를 선택해 주세요. 작품을 검색하고
            분류할 때 사용되며, 태그는 선택 사항입니다.
          </p>
        </div>
        <span className="mt-2 text-sm font-bold text-[#A7ABB0]">Optional</span>
      </div>

      <div className="mt-9">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-[#3F444B]">태그 분류 선택</h2>
          <span className="text-xs font-bold text-[#A7ABB0]">
            {tags.length}개 선택
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)]">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {artworkTagCategories.map((category) => {
              const categorySelectedCount = category.tags.filter((tag) =>
                tags.includes(tag.value),
              ).length;
              const selected = category.id === activeCategoryId;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={cls(
                    "flex h-11 shrink-0 items-center justify-between gap-3 rounded-full border px-4 text-sm font-black transition lg:w-full lg:rounded-xl",
                    selected
                      ? "border-[#17191C] bg-[#17191C] text-white"
                      : "border-[#D8DBDE] bg-white text-[#3F444B] hover:border-[#17191C]",
                  )}
                >
                  <span>{category.label}</span>
                  {categorySelectedCount > 0 ? (
                    <span
                      className={cls(
                        "rounded-full px-2 py-0.5 text-xs",
                        selected ? "bg-white text-[#17191C]" : "bg-[#F4F5F6]",
                      )}
                    >
                      {categorySelectedCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-[#ECEEF0] bg-[#FAFAFB] p-4">
            <div className="mb-4">
              <h3 className="text-base font-black">{activeCategory.label}</h3>
              <p className="mt-1 text-sm leading-6 text-[#777D84]">
                {activeCategory.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeCategory.tags.map((tag) => {
                const selected = tags.includes(tag.value);

                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={cls(
                      "h-10 rounded-full border px-4 text-sm font-black transition",
                      selected
                        ? "border-[#17191C] bg-[#17191C] text-white"
                        : "border-[#D8DBDE] bg-white text-[#3F444B] hover:border-[#17191C]",
                    )}
                    aria-pressed={selected}
                  >
                    #{tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-9 flex gap-2">
        <input
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder="직접 입력: 예) 웹툰, 프로필 이미지"
          className="h-12 min-w-0 flex-1 rounded-xl border-2 border-[#ECEEF0] px-4 outline-none transition placeholder:text-[#A7ABB0] focus:border-[#17191C]"
        />
        <button
          type="button"
          onClick={addTag}
          className="h-12 rounded-full border border-[#D8DBDE] px-5 text-sm font-black"
        >
          추가
        </button>
      </div>

      <div className="mt-5 flex min-h-12 flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onDeleteTag(tag)}
              className="rounded-full bg-[#F4F5F6] px-4 py-2 text-sm font-bold text-[#3F444B]"
            >
              #{getArtworkTagLabel(tag)} ×
            </button>
          ))
        ) : (
          <p className="py-2 text-sm text-[#8A9097]">
            선택된 태그가 없습니다. 추천 태그를 누르거나 직접 입력해 주세요.
          </p>
        )}
      </div>

      <div className="mt-12 flex justify-end gap-2">
        <button
          type="button"
          onClick={onBack}
          className="h-12 rounded-full border border-[#D8DBDE] px-6 text-sm font-black text-[#3F444B]"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="h-12 rounded-full bg-[#17191C] px-6 text-sm font-black text-white"
        >
          작품 등록
        </button>
      </div>
    </section>
  );
}

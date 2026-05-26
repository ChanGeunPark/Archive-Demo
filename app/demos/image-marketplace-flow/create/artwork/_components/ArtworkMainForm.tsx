"use client";

import { forwardRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { ArtworkFormData } from "@/lib/image-marketplace-flow/createArtworkStore";
import { cls } from "@/lib/client/utils";

type ArtworkMainFormProps = {
  defaultValues: ArtworkFormData;
  onSubmit: (formData: ArtworkFormData) => void;
  onBack: () => void;
};

export default function ArtworkMainForm({
  defaultValues,
  onSubmit,
  onBack,
}: ArtworkMainFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ArtworkFormData>({
    defaultValues: {
      allowOffers: true,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues.artistId) {
      setValue("artistId", defaultValues.artistId);
    }
  }, [defaultValues.artistId, setValue]);

  const descriptionLength =
    useWatch({ control, name: "description" })?.length || 0;

  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-black tracking-normal">작품 정보 입력</h1>
        <p className="mt-4 max-w-2xl break-keep text-base leading-7 text-[#656B73]">
          작품명, 설명, 판매가를 입력해 주세요. 등록 시 마켓플레이스 work
          스키마에 맞는 정보가 저장됩니다.
        </p>

        <div className="mt-8 space-y-7">
          <TextField
            label="작품명"
            required
            placeholder="작품 제목을 입력하세요"
            error={errors.title?.message}
            {...register("title", {
              required: "작품명을 입력해 주세요.",
              maxLength: { value: 30, message: "30자 이하로 입력해 주세요." },
            })}
          />

          <div>
            <label className="mb-3 block text-sm font-bold text-[#3F444B]">
              작품 설명 <span className="font-normal text-[#A7ABB0]">선택</span>
            </label>
            <textarea
              rows={5}
              placeholder="작품의 분위기, 제작 의도, 구매자가 알아야 할 내용을 적어주세요."
              className={cls(
                "w-full resize-none rounded-xl border-2 border-[#ECEEF0] bg-white p-4 text-base outline-none transition placeholder:text-[#A7ABB0] focus:border-[#17191C]",
                errors.description && "border-[#D64532]",
              )}
              {...register("description", {
                maxLength: {
                  value: 280,
                  message: "280자 이하로 입력해 주세요.",
                },
              })}
            />
            <div className="mt-2 flex justify-between text-xs">
              <p className="text-[#D64532]">{errors.description?.message}</p>
              <p className="text-[#8A9097]">{descriptionLength}/280</p>
            </div>
          </div>

          <TextField
            label="아티스트 ID"
            readOnly
            placeholder="로그인 ID"
            error={errors.artistId?.message}
            {...register("artistId", {
              required: "로그인 ID가 필요합니다.",
            })}
            className="bg-[#FAFAFB] text-[#3F444B] p-2 focus:outline-none"
          />

          <TextField
            label="판매가"
            type="number"
            min={0}
            step={1000}
            placeholder="0"
            suffix="KRW"
            error={errors.askingPrice?.message}
            {...register("askingPrice", {
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) {
                  return undefined;
                }

                const parsed = Number(value);
                return Number.isNaN(parsed) ? undefined : parsed;
              },
              min: { value: 0, message: "0원 이상으로 입력해 주세요." },
            })}
          />

          <div>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-[#ECEEF0] p-4">
              <span>
                <span className="block text-sm font-black">가격 제안 허용</span>
                <span className="mt-1 block text-sm text-[#777D84]">
                  구매자가 별도 제안을 보낼 수 있습니다.
                </span>
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#17191C]"
                {...register("allowOffers")}
              />
            </label>
          </div>
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
            type="submit"
            className="h-12 rounded-full bg-[#17191C] px-6 text-sm font-black text-white"
          >
            계속
          </button>
        </div>
      </form>
    </section>
  );
}

const TextField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    required?: boolean;
    error?: string;
    suffix?: string;
  }
>(function TextField({ label, required, error, suffix, ...props }, ref) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-bold text-[#3F444B]">
        {label} {required ? <span className="text-[#D64532]">*</span> : null}
      </span>
      <span className="relative block">
        <input
          ref={ref}
          className={cls(
            "h-12 w-full rounded-xl border-2 border-[#ECEEF0] bg-white px-4 text-base outline-none transition placeholder:text-[#A7ABB0] focus:border-[#17191C] p-2",
            suffix && "pr-16",
            error && "border-[#D64532]",
          )}
          {...props}
        />
        {suffix ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#656B73]">
            {suffix}
          </span>
        ) : null}
      </span>
      {error ? (
        <span className="mt-2 block text-xs text-[#D64532]">{error}</span>
      ) : null}
    </label>
  );
});

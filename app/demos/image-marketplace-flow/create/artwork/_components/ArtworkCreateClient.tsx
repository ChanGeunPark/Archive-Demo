"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useCreateArtworkStore } from "@/lib/image-marketplace-flow/createArtworkStore";
import type {
  ArtworkFormData,
  ArtworkLicensePolicy,
  CreateArtworkStep,
} from "@/lib/image-marketplace-flow/createArtworkStore";
import { cls } from "@/lib/client/utils";
import ArtworkPreview from "./ArtworkPreview";
import ArtworkUploadStep from "./ArtworkUploadStep";
import ArtworkMainForm from "./ArtworkMainForm";
import ArtworkLicenseForm from "./ArtworkLicenseForm";
import ArtworkTagForm from "./ArtworkTagForm";

const stepLabels: Record<CreateArtworkStep, string> = {
  FORM_IMAGE: "이미지",
  FORM_MAIN: "작품 정보",
  FORM_LICENSE: "이용 조건",
  FORM_TAG: "태그",
  UPLOAD: "등록",
  UPLOAD_LOADING: "등록",
  UPLOAD_SUCCESS: "완료",
  UPLOAD_FAIL: "오류",
};

export default function ArtworkCreateClient() {
  const store = useCreateArtworkStore();
  const currentStep = useCreateArtworkStore((state) => state.currentStep);
  const previewImage = useCreateArtworkStore((state) => state.previewImage);
  const cleanData = useCreateArtworkStore((state) => state.cleanData);
  const setCurrentStep = useCreateArtworkStore((state) => state.setCurrentStep);
  const createArtwork = useCreateArtworkStore((state) => state.createArtwork);

  const activeIndex = useMemo(() => {
    const order: CreateArtworkStep[] = [
      "FORM_IMAGE",
      "FORM_MAIN",
      "FORM_LICENSE",
      "FORM_TAG",
      "UPLOAD_SUCCESS",
    ];
    return Math.max(0, order.indexOf(currentStep));
  }, [currentStep]);

  useEffect(() => {
    cleanData();
  }, [cleanData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "UPLOAD") {
      return;
    }

    setCurrentStep("UPLOAD_LOADING");

    const timer = window.setTimeout(() => {
      createArtwork();
      setCurrentStep("UPLOAD_SUCCESS");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [createArtwork, currentStep, setCurrentStep]);

  const handleImageUpload = (files: File[]) => {
    const artwork = files[0];
    if (!artwork) {
      return;
    }

    store.setPreviewImage(URL.createObjectURL(artwork));
    store.setArtworkFiles(files);
    store.setCurrentStep("FORM_MAIN");
  };

  const renderStep = () => {
    switch (store.currentStep) {
      case "FORM_IMAGE":
        return <ArtworkUploadStep onUpload={handleImageUpload} />;
      case "FORM_MAIN":
        return (
          <ArtworkMainForm
            defaultValues={store.formData}
            onBack={() => store.cleanData()}
            onSubmit={(formData: ArtworkFormData) => {
              store.setFormData(formData);
              store.setPrice(Number(formData.price || 0));
              store.setCurrentStep("FORM_LICENSE");
            }}
          />
        );
      case "FORM_LICENSE":
        return (
          <ArtworkLicenseForm
            selectedPolicy={store.formData.licensePolicy}
            onBack={() => store.setCurrentStep("FORM_MAIN")}
            onSubmit={(policy: ArtworkLicensePolicy) => {
              store.setLicensePolicy(policy);
              store.setCurrentStep("FORM_TAG");
            }}
          />
        );
      case "FORM_TAG":
        return (
          <ArtworkTagForm
            tags={store.tags}
            onAddTag={store.addTag}
            onDeleteTag={store.deleteTag}
            onBack={() => store.setCurrentStep("FORM_LICENSE")}
            onSubmit={() => store.setCurrentStep("UPLOAD")}
          />
        );
      case "UPLOAD_LOADING":
        return (
          <ProcessCard
            title="작품 등록 중"
            description="작품 이미지와 판매 정보를 저장하고 있어요."
          />
        );
      case "UPLOAD_FAIL":
        return (
          <ProcessCard
            tone="error"
            title="등록에 실패했어요"
            description="입력한 정보를 확인한 뒤 다시 시도해 주세요."
          />
        );
      case "UPLOAD_SUCCESS":
        return <SuccessCard />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F5F6] px-4 py-8 text-[#17191C] lg:px-6 lg:py-18">
      <div className="mx-auto max-w-[1024px]">
        <header className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/demos/image-marketplace-flow"
            className="text-sm font-semibold text-[#3F444B] transition hover:text-[#17191C]"
          >
            뒤로가기
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            {Object.entries(stepLabels)
              .filter(([key]) => !["UPLOAD", "UPLOAD_LOADING", "UPLOAD_FAIL"].includes(key))
              .map(([, label], index) => (
                <span
                  key={label}
                  className={cls(
                    "h-8 rounded-full px-3 pt-[7px] text-xs font-bold",
                    index <= activeIndex
                      ? "bg-[#17191C] text-white"
                      : "bg-white text-[#8A9097]",
                  )}
                >
                  {label}
                </span>
              ))}
          </div>
        </header>

        {previewImage && currentStep !== "FORM_IMAGE" ? (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_25.125rem]">
            <div className="min-w-0">{renderStep()}</div>
            <aside className="order-first lg:sticky lg:top-24 lg:order-none">
              <ArtworkPreview previewImage={previewImage} />
            </aside>
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </main>
  );
}

function ProcessCard({
  title,
  description,
  tone = "default",
}: {
  title: string;
  description: string;
  tone?: "default" | "error";
}) {
  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
      <div
        className={cls(
          "mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl",
          tone === "error" ? "bg-[#FFE8E4] text-[#D64532]" : "bg-[#FFF4C7]",
        )}
      >
        {tone === "error" ? "!" : ""}
      </div>
      <h1 className="text-3xl font-black tracking-normal">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-[#656B73]">
        {description}
      </p>
    </section>
  );
}

function SuccessCard() {
  const store = useCreateArtworkStore();

  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
      <p className="text-sm font-black uppercase text-[#C39A00]">
        Artwork Created
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-normal">
        작품 등록이 완료됐어요
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-[#656B73]">
        {store.formData.title} 작품이 마켓플레이스 데모에 등록되었습니다.
        지금은 로컬 데모 저장소에 보관되며, 새 작품 등록 플로우를 바로 다시
        확인할 수 있습니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/demos/image-marketplace-flow"
          className="inline-flex h-12 items-center rounded-full bg-[#17191C] px-6 text-sm font-black text-white"
        >
          마켓플레이스 보기
        </Link>
        <button
          type="button"
          onClick={() => store.cleanData()}
          className="h-12 rounded-full border border-[#D8DBDE] px-6 text-sm font-black text-[#3F444B]"
        >
          새 작품 등록
        </button>
      </div>
    </section>
  );
}

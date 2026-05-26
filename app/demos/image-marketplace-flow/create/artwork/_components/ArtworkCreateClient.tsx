"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useCreateArtworkStore } from "@/lib/image-marketplace-flow/createArtworkStore";
import type {
  ArtworkFormData,
  CreateArtworkStep,
} from "@/lib/image-marketplace-flow/createArtworkStore";
import type { ArtworkLicensePolicy } from "@/lib/image-marketplace-flow/artworkCreateUtils";
import {
  buildCreateWorkVariables,
  uploadMarketplaceArtworkImage,
} from "@/lib/image-marketplace-flow/marketplaceApiClient";
import {
  CREATE_WORK_MUTATION,
  DEFAULT_WORKS_QUERY_VARIABLES,
  WORKS_QUERY,
} from "@/lib/image-marketplace-flow/graphql/operations";
import type { CreateWorkMutationResponse } from "@/lib/image-marketplace-flow/graphql/types";
import {
  hydrateMarketplaceAuthFromStorage,
  useMarketplaceStore,
} from "@/lib/image-marketplace-flow/marketplaceStore";
import MarketplaceLogin from "../../../_components/auth/MarketplaceLogin";
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
  // --- Router / State Management ---
  const router = useRouter();
  const currentStep = useCreateArtworkStore((state) => state.currentStep);
  const previewImage = useCreateArtworkStore((state) => state.previewImage);
  const formData = useCreateArtworkStore((state) => state.formData);
  const tags = useCreateArtworkStore((state) => state.tags);
  const cleanData = useCreateArtworkStore((state) => state.cleanData);
  const setCurrentStep = useCreateArtworkStore((state) => state.setCurrentStep);
  const setArtworkId = useCreateArtworkStore((state) => state.setArtworkId);
  const setUploadError = useCreateArtworkStore((state) => state.setUploadError);
  const setFormData = useCreateArtworkStore((state) => state.setFormData);
  const setPreviewImage = useCreateArtworkStore(
    (state) => state.setPreviewImage,
  );
  const setArtworkFiles = useCreateArtworkStore(
    (state) => state.setArtworkFiles,
  );
  const setImageDimensions = useCreateArtworkStore(
    (state) => state.setImageDimensions,
  );
  const setLicensePolicy = useCreateArtworkStore(
    (state) => state.setLicensePolicy,
  );
  const addTag = useCreateArtworkStore((state) => state.addTag);
  const deleteTag = useCreateArtworkStore((state) => state.deleteTag);
  const uploadError = useCreateArtworkStore((state) => state.uploadError);
  const currentUser = useMarketplaceStore((state) => state.currentUser);

  // --- Apollo Client ---
  const [createWorkMutation] =
    useMutation<CreateWorkMutationResponse>(CREATE_WORK_MUTATION);
  const submitStartedRef = useRef(false);

  hydrateMarketplaceAuthFromStorage();

  // --- Effects ---
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
    if (!currentUser) {
      return;
    }

    setFormData({ artistId: currentUser.id });
  }, [currentUser, setFormData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "UPLOAD_LOADING") {
      submitStartedRef.current = false;
      return;
    }

    if (submitStartedRef.current) {
      return;
    }

    submitStartedRef.current = true;
    setUploadError("");

    let cancelled = false;

    async function submitArtwork() {
      const state = useCreateArtworkStore.getState();
      const loggedInUser = useMarketplaceStore.getState().currentUser;
      const artworkFile = state.artworkFiles[0];

      if (!loggedInUser) {
        if (!cancelled) {
          setUploadError("작품 등록 전에 로그인해 주세요.");
          setCurrentStep("UPLOAD_FAIL");
        }
        return;
      }

      if (!artworkFile) {
        if (!cancelled) {
          setUploadError("업로드할 이미지 파일이 없습니다.");
          setCurrentStep("UPLOAD_FAIL");
        }
        return;
      }

      try {
        const draftWorkId = `work-${Date.now()}`;
        const upload = await uploadMarketplaceArtworkImage({
          file: artworkFile,
          workId: draftWorkId,
        });

        const variables = buildCreateWorkVariables({
          id: draftWorkId,
          formData: {
            ...state.formData,
            artistId: loggedInUser.id,
          },
          tags: state.tags,
          imageWidth: state.imageWidth,
          imageHeight: state.imageHeight,
          imageUrl: upload.url,
          creatorId: loggedInUser.id,
          imageId: upload.id,
        });

        const { data } = await createWorkMutation({
          variables,
          refetchQueries: [
            { query: WORKS_QUERY, variables: DEFAULT_WORKS_QUERY_VARIABLES },
          ],
        });

        if (cancelled) {
          return;
        }

        if (!data?.createWork?.id) {
          throw new Error("작품 등록 응답이 올바르지 않습니다.");
        }

        setArtworkId(data.createWork.id);
        router.replace(
          `/demos/image-marketplace-flow/work/${data.createWork.id}`,
        );
        return;
      } catch (error) {
        if (cancelled) {
          return;
        }

        setUploadError(
          error instanceof Error ? error.message : "작품 등록에 실패했습니다.",
        );
        setCurrentStep("UPLOAD_FAIL");
      }
    }

    void submitArtwork();

    return () => {
      cancelled = true;
    };
  }, [
    createWorkMutation,
    currentStep,
    router,
    setArtworkId,
    setCurrentStep,
    setUploadError,
  ]);

  const handleImageUpload = async (files: File[]) => {
    const artwork = files[0];
    if (!artwork) {
      return;
    }

    const previewUrl = URL.createObjectURL(artwork);

    try {
      const dimensions = await readImageDimensions(previewUrl);

      setUploadError("");
      setPreviewImage(previewUrl);
      setArtworkFiles([artwork]);
      setImageDimensions(dimensions.width, dimensions.height);
      setCurrentStep("FORM_MAIN");
    } catch {
      URL.revokeObjectURL(previewUrl);
      setUploadError(
        "이미지 정보를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.",
      );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "FORM_IMAGE":
        return (
          <>
            {uploadError ? (
              <p className="mb-4 rounded-xl border border-[#F2C4BC] bg-[#FFF4F2] px-4 py-3 text-sm text-[#D64532]">
                {uploadError}
              </p>
            ) : null}
            <ArtworkUploadStep onUpload={handleImageUpload} />
          </>
        );
      case "FORM_MAIN":
        return (
          <ArtworkMainForm
            defaultValues={{
              ...formData,
              artistId: currentUser?.id ?? formData.artistId,
            }}
            onBack={cleanData}
            onSubmit={(nextFormData: ArtworkFormData) => {
              setFormData(nextFormData);
              setCurrentStep("FORM_LICENSE");
            }}
          />
        );
      case "FORM_LICENSE":
        return (
          <ArtworkLicenseForm
            selectedPolicy={formData.licensePolicy}
            onBack={() => setCurrentStep("FORM_MAIN")}
            onSubmit={(policy: ArtworkLicensePolicy) => {
              setLicensePolicy(policy);
              setCurrentStep("FORM_TAG");
            }}
          />
        );
      case "FORM_TAG":
        return (
          <ArtworkTagForm
            tags={tags}
            onAddTag={addTag}
            onDeleteTag={deleteTag}
            onBack={() => setCurrentStep("FORM_LICENSE")}
            onSubmit={() => setCurrentStep("UPLOAD_LOADING")}
          />
        );
      case "UPLOAD_LOADING":
        return (
          <ProcessCard
            title="작품 등록 중"
            description="작품 등록 중입니다. 잠시만 기다려 주세요."
          />
        );
      case "UPLOAD_FAIL":
        return (
          <ProcessCard
            tone="error"
            title="등록에 실패했어요"
            description={
              uploadError || "입력한 정보를 확인한 뒤 다시 시도해 주세요."
            }
            actionLabel="다시 시도"
            onAction={() => setCurrentStep("UPLOAD_LOADING")}
          />
        );
      default:
        return null;
    }
  };

  if (!currentUser) {
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
            <MarketplaceLogin />
          </header>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_25.125rem]">
            <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
              <p className="text-sm font-black uppercase text-[#C39A00]">
                Login Required
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-normal">
                로그인 후 작품을 등록할 수 있어요
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#656B73]">
                작품 등록을 시작하려면 오른쪽에서 ID로 로그인해 주세요. 로그인
                ID는 localStorage에 저장되며, 작품 정보의 아티스트 ID에 자동으로
                반영됩니다.
              </p>
            </section>
            <aside className="lg:sticky lg:top-24">
              <MarketplaceLogin variant="panel" />
            </aside>
          </div>
        </div>
      </main>
    );
  }

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
              .filter(
                ([key]) =>
                  !["UPLOAD", "UPLOAD_LOADING", "UPLOAD_FAIL"].includes(key),
              )
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
          <MarketplaceLogin />
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

function readImageDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth || 1000,
        height: image.naturalHeight || 1000,
      });
    };
    image.onerror = () => {
      reject(new Error("Failed to read image dimensions."));
    };
    image.src = src;
  });
}

function ProcessCard({
  title,
  description,
  tone = "default",
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  tone?: "default" | "error";
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="rounded-[1.25rem] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-14">
      <h1 className="text-3xl font-black tracking-normal">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-[#656B73]">
        {description}
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 h-11 rounded-full border border-[#D8DBDE] px-5 text-sm font-black text-[#3F444B]"
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

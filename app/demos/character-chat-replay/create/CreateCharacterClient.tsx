"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import Typography from "@/components/typography/Typography";
import { useCreateDemoCharacterMutation } from "@/lib/ai-chat-demo/api";
import { createCharacterMockForms } from "@/lib/ai-chat-demo/mock-data";
import {
  CreateCharacterHeader,
  CreateCharacterStep,
  CreatorIdModal,
  StepActions,
  Stepper,
  initialForm,
  normalizeCreatorId,
  type FormState,
} from "./_components";

export default function CreateCharacterClient() {
  // --- Router / API ---
  const router = useRouter();
  const createCharacterMutation = useCreateDemoCharacterMutation();
  const {
    control,
    handleSubmit: handleFormSubmit,
    register,
    reset,
    setValue,
  } = useForm<FormState>({
    defaultValues: initialForm,
  });

  // --- State Management ---
  const [step, setStep] = useState(0);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [canCreateFromTestStep, setCanCreateFromTestStep] = useState(false);
  const [creatorId, setCreatorId] = useState("");
  const [creatorIdModalOpen, setCreatorIdModalOpen] = useState(false);
  const [selectedMockFormId, setSelectedMockFormId] = useState("");
  const [pendingFormValues, setPendingFormValues] = useState<FormState | null>(
    null,
  );

  // --- React Hook Form ---
  const form = useWatch({ control }) as FormState;
  const loading = createCharacterMutation.isPending;

  // --- Effects ---
  useEffect(() => {
    (Object.keys(initialForm) as (keyof FormState)[]).forEach((key) => {
      register(key);
    });
  }, [register]);

  // --- Normalization ---
  const canSubmit = useMemo(
    () =>
      Boolean(
        form.category &&
        form.gender &&
        form.name &&
        profileImage &&
        form.description &&
        form.personality &&
        !loading,
      ),
    [
      form.category,
      form.description,
      form.gender,
      form.name,
      form.personality,
      loading,
      profileImage,
    ],
  );

  const canGoNext = useMemo(() => {
    if (step === 0) return Boolean(form.category && form.gender && form.name);
    if (step === 1)
      return Boolean(profileImage && form.description && form.personality);
    if (step === 2) return canSubmit;
    return canSubmit;
  }, [
    canSubmit,
    form.category,
    form.description,
    form.gender,
    form.name,
    form.personality,
    profileImage,
    step,
  ]);

  // --- Effects ---
  useEffect(() => {
    if (step !== 3) return;

    const timeoutId = window.setTimeout(() => {
      setCanCreateFromTestStep(true);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [step]);

  // --- Event Handlers ---
  function updateForm(key: keyof FormState, value: string) {
    setValue(key, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCanCreateFromTestStep(false);
  }

  // --- Event Handlers [스탭 변경] ---
  function handleStepChange(action: React.SetStateAction<number>) {
    setCanCreateFromTestStep(false);
    setStep(action);
  }

  // --- Event Handlers [이미지 업로드] ---
  function handleImage(file: File | null, type: "profile" | "banner") {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("이미지는 5MB 이하의 파일만 업로드할 수 있습니다.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "profile") {
      setProfileImage(file);
      setProfilePreview(previewUrl);
      setCanCreateFromTestStep(false);
      return;
    }

    setBannerImage(file);
    setBannerPreview(previewUrl);
    setCanCreateFromTestStep(false);
  }

  // --- Event Handlers [폼 초기화] ---
  function resetForm() {
    reset(initialForm);
    setProfileImage(null);
    setBannerImage(null);
    setProfilePreview("");
    setBannerPreview("");
    setErrorMessage("");
    setCanCreateFromTestStep(false);
    setCreatorId("");
    setCreatorIdModalOpen(false);
    setPendingFormValues(null);
    setSelectedMockFormId("");
    setStep(0);
  }

  // --- Event Handlers [목업 데이터 적용] ---
  function applyMockData(mockFormId: string) {
    const mockForm = createCharacterMockForms.find(
      (item) => item.id === mockFormId,
    );
    if (!mockForm) return;

    setSelectedMockFormId(mockFormId);
    reset(mockForm.form);
    setErrorMessage("");
    setCanCreateFromTestStep(false);
    setPendingFormValues(null);
  }

  // --- Event Handlers [폼 제출] ---
  async function handleSubmit(values: FormState) {
    if (step < 3) {
      setStep(3);
      return;
    }
    if (!profileImage) return;
    if (!canCreateFromTestStep) {
      setErrorMessage("테스트 화면을 확인한 뒤 캐릭터를 생성해주세요.");
      return;
    }

    setPendingFormValues(values);
    setCreatorIdModalOpen(true);
  }

  // --- Event Handlers [캐릭터 생성] ---
  async function createCharacterWithCreatorId(
    inputCreatorId: string,
    values: FormState,
  ) {
    const normalizedCreatorId = normalizeCreatorId(inputCreatorId);

    if (!profileImage) return;
    if (!normalizedCreatorId) {
      setErrorMessage("캐릭터 생성 ID를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setCreatorIdModalOpen(false);

    try {
      const data = await createCharacterMutation.mutateAsync({
        values,
        profileImage,
        bannerImage,
        creatorId: normalizedCreatorId,
      });

      router.push(
        `/demos/character-chat-replay/chat/${data.character.id}?roomId=${encodeURIComponent(data.roomId || normalizedCreatorId)}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "캐릭터 생성에 실패했습니다.",
      );
      return;
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#17191C]">
      <article className="mx-auto min-h-screen w-full max-w-[620px] bg-[#F8F9FA]">
        <CreateCharacterHeader
          onApplyMockData={applyMockData}
          onReset={resetForm}
          selectedMockFormId={selectedMockFormId}
        />

        <form
          onSubmit={handleFormSubmit(handleSubmit)}
          className="min-h-screen px-4 pb-[156px] pt-16 max-sm:px-2"
        >
          <Stepper step={step} />
          <CreateCharacterStep
            bannerPreview={bannerPreview}
            form={form}
            handleImage={handleImage}
            profilePreview={profilePreview}
            step={step}
            updateForm={updateForm}
          />
          {errorMessage && (
            <Typography
              variant="body2"
              weight={600}
              color="#EE4553"
              className="mt-4"
            >
              {errorMessage}
            </Typography>
          )}
          <StepActions
            canGoNext={canGoNext}
            canCreateFromTestStep={canCreateFromTestStep}
            canSubmit={canSubmit && canCreateFromTestStep}
            loading={loading}
            onStepChange={handleStepChange}
            step={step}
          />
        </form>
        <CreatorIdModal
          creatorId={creatorId}
          loading={loading}
          open={creatorIdModalOpen}
          onChange={setCreatorId}
          onClose={() => setCreatorIdModalOpen(false)}
          onConfirm={() =>
            createCharacterWithCreatorId(creatorId, pendingFormValues ?? form)
          }
        />
      </article>
    </main>
  );
}

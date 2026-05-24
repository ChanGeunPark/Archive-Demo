"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useCreateDemoCharacterMutation } from "@/lib/ai-chat-demo/api";
import { createCharacterMockForms } from "@/lib/ai-chat-demo/mock-data";
import { StepButton, Stepper } from "./_components/CreateCharacterPrimitives";
import {
  BasicInfoStep,
  CharacterSettingsStep,
  ChatSettingsStep,
  PreviewChat,
  ProfileStep,
} from "./_components/CreateCharacterSteps";
import {
  initialForm,
  type FormState,
} from "./_components/create-character.types";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import Typography from "@/components/typography/Typography";

export default function CreateCharacterClient() {
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
  const form = useWatch({ control }) as FormState;
  const loading = createCharacterMutation.isPending;

  useEffect(() => {
    (Object.keys(initialForm) as (keyof FormState)[]).forEach((key) => {
      register(key);
    });
  }, [register]);

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

  useEffect(() => {
    if (step !== 3) return;

    const timeoutId = window.setTimeout(() => {
      setCanCreateFromTestStep(true);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [step]);

  function updateForm(key: keyof FormState, value: string) {
    setValue(key, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCanCreateFromTestStep(false);
  }

  function handleStepChange(action: React.SetStateAction<number>) {
    setCanCreateFromTestStep(false);
    setStep(action);
  }

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

  async function createCharacterWithCreatorId(
    inputCreatorId: string,
    values: FormState,
  ) {
    const normalizedCreatorId = inputCreatorId
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);

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

function CreatorIdModal({
  creatorId,
  loading,
  open,
  onChange,
  onClose,
  onConfirm,
}: {
  creatorId: string;
  loading: boolean;
  open: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const normalizedCreatorId = creatorId
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
      <section className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <Typography variant="h4" color="#17191C">
          생성 ID 입력
        </Typography>
        <Typography variant="body2" color="#60656C" className="mt-2">
          이 ID로 채팅방을 만들고, 나중에 캐릭터 삭제 권한을 확인합니다.
        </Typography>
        <label className="mt-4 block">
          <Typography as="span" variant="body2" weight={700} color="#17191C">
            User ID
          </Typography>
          <input
            autoFocus
            value={creatorId}
            onChange={(event) => onChange(event.target.value)}
            placeholder="예: my-user-id"
            className="mt-2 h-12 w-full rounded-lg border-2 border-[#F4F5F6] px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
          />
          {creatorId && normalizedCreatorId !== creatorId && (
            <Typography
              as="span"
              variant="body3"
              weight={500}
              color="#72777E"
              className="mt-1 block"
            >
              공백은 `-`로 바뀌어 `{normalizedCreatorId}`로 저장됩니다.
            </Typography>
          )}
        </label>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-11 flex-1 rounded-full border border-[#D8DBDE] text-sm font-bold text-[#17191C] disabled:opacity-50"
          >
            <Typography as="span" variant="body2" weight={700} color="#17191C">
              취소
            </Typography>
          </button>
          <button
            type="button"
            disabled={!normalizedCreatorId || loading}
            onClick={onConfirm}
            className="h-11 flex-1 rounded-full rounded-tr-none bg-[#FFE55C] text-sm font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
          >
            <Typography as="span" variant="body2" weight={700} color="inherit">
              {loading ? "생성 중..." : "생성하기"}
            </Typography>
          </button>
        </div>
      </section>
    </div>
  );
}

function CreateCharacterHeader({
  onApplyMockData,
  onReset,
  selectedMockFormId,
}: {
  onApplyMockData: (mockFormId: string) => void;
  onReset: () => void;
  selectedMockFormId: string;
}) {
  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-screen bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-full w-full max-w-[620px] items-center justify-between px-4">
        <Link
          href="/demos/character-chat-replay"
          className="flex h-full items-center gap-2 text-base font-bold"
        >
          <span className="text-2xl leading-none text-[#17191C]">
            <KeyboardArrowLeftIcon />
          </span>
          <Typography as="span" variant="body1" weight={700} color="#17191C">
            캐릭터 만들기
          </Typography>
        </Link>
        <div className="flex items-center gap-2">
          <select
            aria-label="mock 데이터 선택"
            value={selectedMockFormId}
            onChange={(event) => onApplyMockData(event.target.value)}
            className="h-7 w-[90px] rounded-full bg-[#FFE55C] px-3 text-xs font-bold text-[#17191C] outline-none"
            style={{
              backgroundImage: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            <option value="" className="">
              mock 데이터
            </option>
            {createCharacterMockForms.map((mockForm) => (
              <option
                key={mockForm.id}
                value={mockForm.id}
                className="w-[158px]"
              >
                {mockForm.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onReset}
            className="h-7 rounded-full border border-[#D8DBDE] px-3 text-xs font-bold text-[#17191C]"
          >
            <Typography as="span" variant="body3" weight={700} color="#17191C">
              초기화
            </Typography>
          </button>
        </div>
      </div>
    </header>
  );
}

function CreateCharacterStep({
  bannerPreview,
  form,
  handleImage,
  profilePreview,
  step,
  updateForm,
}: {
  bannerPreview: string;
  form: FormState;
  handleImage: (file: File | null, type: "profile" | "banner") => void;
  profilePreview: string;
  step: number;
  updateForm: (key: keyof FormState, value: string) => void;
}) {
  if (step === 0) {
    return <BasicInfoStep form={form} updateForm={updateForm} />;
  }

  if (step === 1) {
    return (
      <>
        <ProfileStep
          bannerPreview={bannerPreview}
          form={form}
          handleImage={handleImage}
          profilePreview={profilePreview}
          updateForm={updateForm}
        />
        <CharacterSettingsStep form={form} updateForm={updateForm} />
      </>
    );
  }

  if (step === 2) {
    return (
      <ChatSettingsStep
        form={form}
        profilePreview={profilePreview}
        updateForm={updateForm}
      />
    );
  }

  return (
    <div className="mt-4">
      <PreviewChat
        form={form}
        profilePreview={profilePreview}
        bannerPreview={bannerPreview}
      />
    </div>
  );
}

function StepActions({
  canCreateFromTestStep,
  canGoNext,
  canSubmit,
  loading,
  onStepChange,
  step,
}: {
  canCreateFromTestStep: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  loading: boolean;
  onStepChange: React.Dispatch<React.SetStateAction<number>>;
  step: number;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[620px] -translate-x-1/2 gap-3 bg-white/20 p-4 backdrop-blur-xl">
      <StepButton
        disabled={step === 0 || loading}
        onClick={() => onStepChange((current) => Math.max(0, current - 1))}
        variant="black"
      >
        이전 단계로
      </StepButton>
      {step < 3 ? (
        <StepButton
          disabled={!canGoNext}
          onClick={() => onStepChange((current) => Math.min(3, current + 1))}
          variant="primary"
        >
          다음 단계로
        </StepButton>
      ) : (
        <StepButton type="submit" disabled={!canSubmit} variant="primary">
          {loading
            ? "생성 중..."
            : canCreateFromTestStep
              ? "캐릭터 생성하기"
              : "테스트 확인 중..."}
        </StepButton>
      )}
    </div>
  );
}

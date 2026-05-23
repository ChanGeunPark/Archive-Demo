"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import { StepButton, Stepper } from "./_components/CreateCharacterPrimitives";
import {
  BasicInfoStep,
  CharacterSettingsStep,
  ChatSettingsStep,
  PreviewChat,
  ProfileStep,
} from "./_components/CreateCharacterSteps";
import { initialForm, type FormState } from "./_components/create-character.types";

export default function CreateCharacterClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    [form.category, form.description, form.gender, form.name, form.personality, loading, profileImage],
  );

  const canGoNext = useMemo(() => {
    if (step === 0) return Boolean(form.category && form.gender && form.name);
    if (step === 1) return Boolean(profileImage && form.description && form.personality);
    if (step === 2) return canSubmit;
    return canSubmit;
  }, [canSubmit, form.category, form.description, form.gender, form.name, form.personality, profileImage, step]);

  function updateForm(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
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
      return;
    }

    setBannerImage(file);
    setBannerPreview(previewUrl);
  }

  function resetForm() {
    setForm(initialForm);
    setProfileImage(null);
    setBannerImage(null);
    setProfilePreview("");
    setBannerPreview("");
    setErrorMessage("");
    setStep(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profileImage) return;

    setLoading(true);
    setErrorMessage("");

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      body.append(key, value);
    });
    body.append("profileImage", profileImage);

    if (bannerImage) {
      body.append("bannerImage", bannerImage);
    }

    const response = await fetch("/api/ai-chat-demo/characters/create", {
      method: "POST",
      body,
    });

    const data = (await response.json()) as {
      character?: DemoPublicCharacter;
      error?: string;
    };

    setLoading(false);

    if (!response.ok || !data.character) {
      setErrorMessage(data.error || "캐릭터 생성에 실패했습니다.");
      return;
    }

    router.push(`/demos/character-chat-replay/chat/${data.character.id}`);
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#17191C]">
      <article className="mx-auto min-h-screen w-full max-w-[620px] bg-[#F8F9FA]">
        <CreateCharacterHeader
          onReset={resetForm}
        />

        <form onSubmit={handleSubmit} className="min-h-screen px-4 pb-[156px] pt-16 max-sm:px-2">
          <Stepper step={step} />
          <CreateCharacterStep
            bannerPreview={bannerPreview}
            form={form}
            handleImage={handleImage}
            profilePreview={profilePreview}
            step={step}
            updateForm={updateForm}
          />
          {errorMessage && <p className="mt-4 text-sm font-semibold text-[#EE4553]">{errorMessage}</p>}
          <StepActions
            canGoNext={canGoNext}
            canSubmit={canSubmit}
            loading={loading}
            onStepChange={setStep}
            step={step}
          />
        </form>
      </article>
    </main>
  );
}

function CreateCharacterHeader({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-screen bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-full w-full max-w-[620px] items-center justify-between px-4">
        <Link href="/demos/character-chat-replay" className="flex h-full items-center gap-2 text-base font-bold">
          <span className="text-2xl leading-none text-[#17191C]">‹</span>
          <span>캐릭터 만들기</span>
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="h-7 rounded-full border border-[#D8DBDE] px-3 text-xs font-bold text-[#17191C]"
        >
          초기화
        </button>
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
    return <ChatSettingsStep form={form} updateForm={updateForm} />;
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
  canGoNext,
  canSubmit,
  loading,
  onStepChange,
  step,
}: {
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
        <StepButton
          type="submit"
          disabled={!canSubmit}
          variant="primary"
        >
          {loading ? "생성 중..." : "캐릭터 생성하기"}
        </StepButton>
      )}
    </div>
  );
}

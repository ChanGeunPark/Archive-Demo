import type { FormState } from "./create-character.types";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { CharacterSettingsStep } from "./steps/CharacterSettingsStep";
import { ChatSettingsStep } from "./steps/ChatSettingsStep";
import { PreviewChat } from "./steps/PreviewChat";
import { ProfileStep } from "./steps/ProfileStep";

type CreateCharacterStepProps = {
  bannerPreview: string;
  form: FormState;
  handleImage: (file: File | null, type: "profile" | "banner") => void;
  profilePreview: string;
  step: number;
  updateForm: (key: keyof FormState, value: string) => void;
};

export function CreateCharacterStep({
  bannerPreview,
  form,
  handleImage,
  profilePreview,
  step,
  updateForm,
}: CreateCharacterStepProps) {
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

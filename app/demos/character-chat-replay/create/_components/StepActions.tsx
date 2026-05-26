import { StepButton } from "./CreateCharacterPrimitives";

type StepActionsProps = {
  canCreateFromTestStep: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  loading: boolean;
  onStepChange: React.Dispatch<React.SetStateAction<number>>;
  step: number;
};

export function StepActions({
  canCreateFromTestStep,
  canGoNext,
  canSubmit,
  loading,
  onStepChange,
  step,
}: StepActionsProps) {
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

import Link from "next/link";
import { createCharacterMockForms } from "@/lib/ai-chat-demo/mock-data";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import Typography from "@/components/typography/Typography";

type CreateCharacterHeaderProps = {
  onApplyMockData: (mockFormId: string) => void;
  onReset: () => void;
  selectedMockFormId: string;
};

export function CreateCharacterHeader({
  onApplyMockData,
  onReset,
  selectedMockFormId,
}: CreateCharacterHeaderProps) {
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

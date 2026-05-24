import { useState } from "react";
import {
  Card,
  HelperBar,
  SectionTitle,
  TextArea,
} from "../CreateCharacterPrimitives";
import {
  initialDescriptionDraft,
  type DescriptionDraft,
  type FormState,
} from "../create-character.types";
import {
  personalityKeywords,
  personalityTabs,
  type PersonalityTab,
} from "../personality-keywords";
import type { UpdateForm } from "./types";
import Typography from "@/components/typography/Typography";

export function CharacterSettingsStep({
  form,
  updateForm,
}: {
  form: FormState;
  updateForm: UpdateForm;
}) {
  const [descriptionMode, setDescriptionMode] = useState<"basic" | "free">(
    "basic",
  );
  const [draft, setDraft] = useState<DescriptionDraft>(initialDescriptionDraft);
  const [showDictionary, setShowDictionary] = useState(false);

  function updateDraft(key: keyof DescriptionDraft, value: string) {
    const nextDraft = { ...draft, [key]: value };
    setDraft(nextDraft);
    updateForm(
      "description",
      buildDescription(form.name, nextDraft).slice(0, 300),
    );
  }

  return (
    <Card className="mt-4">
      <section>
        <div className="flex items-center justify-between gap-3">
          <SectionTitle title="캐릭터 소개" required />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDescriptionMode("basic")}
              className={`h-8 rounded-lg px-3 text-xs font-bold ${descriptionMode === "basic" ? "bg-[#FFE55C] text-[#17191C]" : "bg-[#F4F5F6] text-[#93989F]"}`}
            >
              <Typography as="span" variant="body3" weight={700} color="inherit">
                기본 양식
              </Typography>
            </button>
            <button
              type="button"
              onClick={() => setDescriptionMode("free")}
              className={`h-8 rounded-lg px-3 text-xs font-bold ${descriptionMode === "free" ? "bg-[#FFE55C] text-[#17191C]" : "bg-[#F4F5F6] text-[#93989F]"}`}
            >
              <Typography as="span" variant="body3" weight={700} color="inherit">
                자유 양식
              </Typography>
            </button>
          </div>
        </div>
        {descriptionMode === "basic" ? (
          <>
            <div className="mt-3 overflow-hidden rounded-lg border-2 border-[#F4F5F6]">
              <BuilderInput
                label="컨셉 한줄요약"
                value={draft.concept}
                maxLength={50}
                placeholder="ex) 차가운 도시의 소녀"
                onChange={(value) => updateDraft("concept", value)}
              />
              <BuilderInput
                label="나이"
                value={draft.age}
                maxLength={5}
                placeholder="ex) 19"
                onChange={(value) =>
                  updateDraft("age", value.replace(/[^0-9]/g, ""))
                }
              />
              <BuilderInput
                label="캐릭터 직업"
                value={draft.job}
                maxLength={24}
                placeholder="ex) 인기 최절정의 K-POP 아이돌"
                onChange={(value) => updateDraft("job", value)}
              />
              <BuilderInput
                label="외모 묘사"
                value={draft.appearance}
                maxLength={60}
                placeholder="ex) 금발 헤어스타일과 파란 귀걸이"
                onChange={(value) => updateDraft("appearance", value)}
              />
              <BuilderInput
                label="캐릭터 장점"
                value={draft.merits}
                maxLength={50}
                placeholder="ex) 어떤 상황에도 좌절하지 않는다"
                onChange={(value) => updateDraft("merits", value)}
              />
              <BuilderInput
                label="캐릭터 단점"
                value={draft.demerits}
                maxLength={50}
                placeholder="ex) 가끔 상처 주는 말을 한다"
                onChange={(value) => updateDraft("demerits", value)}
              />
              <BuilderInput
                label="특수 설정"
                value={draft.extra}
                maxLength={60}
                placeholder="ex) 어딜 가도 시선을 끄는 매력"
                onChange={(value) => updateDraft("extra", value)}
                isLast
              />
            </div>
            <textarea
              value={form.description}
              readOnly
              maxLength={300}
              className="mt-2 min-h-28 w-full resize-none rounded-lg bg-[#F8F9FA] p-3 text-sm leading-6 text-[#60656C] outline-none"
            />
            <Typography
              variant="body3"
              weight={500}
              color="#93989F"
              align="right"
              className="mt-1"
            >
              {form.description.length}/300
            </Typography>
          </>
        ) : (
          <TextArea
            value={form.description}
            placeholder={
              "캐릭터를 소개해주세요. 소개를 자세하게 작성하면 더 똑똑한 AI 캐릭터를 만들 수 있어요.\n\nex) 16세 아이돌이며, 짙은 보라색 머리와 별 모양 눈동자를 가졌다."
            }
            onChange={(value) => updateForm("description", value.slice(0, 300))}
          />
        )}
      </section>
      <TextArea
        className="mt-8"
        label="성격"
        required
        value={form.personality}
        placeholder={
          "성격은 캐릭터의 말투를 결정짓는 중요한 요소예요.\n\nex) 극도의 마이페이스이며, 중요한 일에는 신중해지는 면모가 있다."
        }
        onChange={(value) => updateForm("personality", value.slice(0, 100))}
      />
      <Typography
        variant="body3"
        weight={500}
        color="#93989F"
        align="right"
        className="mt-1"
      >
        {form.personality.length}/100
      </Typography>
      <HelperBar
        actionLabel="키워드 사전"
        onAction={() => setShowDictionary(true)}
      >
        좋은 단어가 생각나지 않는다면?
      </HelperBar>
      {showDictionary && (
        <PersonalityKeywordSheet
          personality={form.personality}
          onClose={() => setShowDictionary(false)}
          onApply={(value) => updateForm("personality", value)}
        />
      )}
    </Card>
  );
}

function BuilderInput({
  isLast = false,
  label,
  maxLength,
  onChange,
  placeholder,
  value,
}: {
  isLast?: boolean;
  label: string;
  maxLength: number;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label
      className={`block p-3 ${isLast ? "" : "border-b-2 border-[#F4F5F6]"}`}
    >
      <Typography as="span" variant="body2" weight={700} color="#17191C" className="block">
        {label}
      </Typography>
      <input
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
        className="mt-1 h-7 w-full bg-transparent text-sm outline-none placeholder:text-[#AEB2B8]"
      />
    </label>
  );
}

function PersonalityKeywordSheet({
  onApply,
  onClose,
  personality,
}: {
  onApply: (value: string) => void;
  onClose: () => void;
  personality: string;
}) {
  const [tab, setTab] = useState<PersonalityTab>("ㄱ");
  const [selected, setSelected] = useState<string[]>(() =>
    personality
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  const totalLength = selected.join(",").length;

  function toggleKeyword(keyword: string) {
    if (selected.includes(keyword)) {
      setSelected((current) => current.filter((item) => item !== keyword));
      return;
    }
    if (totalLength + keyword.length + (selected.length > 0 ? 1 : 0) > 100)
      return;
    setSelected((current) => [...current, keyword]);
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/45 px-4 pt-10"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex h-[calc(100vh-40px)] max-w-[500px] flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-[#EDEEEF] p-4">
          <Typography variant="h4" color="#17191C">
            성격 키워드 사전
          </Typography>
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-lg border border-[#D8DBDE] px-3 text-xs font-bold"
          >
            <Typography as="span" variant="body3" weight={700} color="#17191C">
              닫기
            </Typography>
          </button>
        </div>
        <div className="p-3">
          <div className="flex min-h-14 gap-2 overflow-x-auto rounded-lg bg-[#F8F9FA] p-2">
            {selected.length === 0 ? (
              <Typography
                variant="body2"
                weight={500}
                color="#AEB2B8"
                className="self-center"
              >
                키워드를 선택해주세요.
              </Typography>
            ) : (
              selected.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => toggleKeyword(keyword)}
                  className="h-9 shrink-0 rounded-full bg-[#FFE55C] px-3 text-xs font-bold text-[#17191C]"
                >
                  <Typography as="span" variant="body3" weight={700} color="#17191C">
                    {keyword} ×
                  </Typography>
                </button>
              ))
            )}
          </div>
          <Typography
            variant="body3"
            weight={500}
            color="#93989F"
            align="right"
            className="mt-1"
          >
            {totalLength}/100
          </Typography>
          <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
            {personalityTabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`h-9 w-9 shrink-0 rounded-lg text-sm font-bold ${tab === item ? "bg-[#17191C] text-white" : "bg-[#F4F5F6] text-[#60656C]"}`}
              >
                <Typography as="span" variant="body2" weight={700} color="inherit">
                  {item}
                </Typography>
              </button>
            ))}
          </div>
        </div>
        <div className="grid flex-1 auto-rows-min grid-cols-2 gap-2 overflow-y-auto px-3 pb-24 sm:grid-cols-3">
          {personalityKeywords[tab].map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => toggleKeyword(keyword)}
              className={`min-h-10 rounded-lg px-2 text-sm font-bold ${selected.includes(keyword) ? "bg-[#FFE55C] text-[#17191C]" : "border border-[#D8DBDE] text-[#60656C]"}`}
            >
              <Typography as="span" variant="body2" weight={700} color="inherit">
                {keyword}
              </Typography>
            </button>
          ))}
        </div>
        <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white p-3">
          <button
            type="button"
            disabled={selected.length === 0 || totalLength > 100}
            onClick={() => {
              onApply(selected.join(",").slice(0, 100));
              onClose();
            }}
            className="h-12 w-full rounded-full bg-[#FFE55C] text-base font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
          >
            <Typography as="span" variant="body1" weight={700} color="inherit">
              추가하기
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}

function buildDescription(name: string, draft: DescriptionDraft) {
  const nameText = name ? `${name}의 ` : "";
  const conceptText = draft.concept ? `컨셉은 ${draft.concept}이며,` : "";
  const ageText = draft.age ? ` 나이는 ${draft.age}세이다.` : "";
  const jobText = draft.job ? ` 직업은 ${draft.job}이다.` : "";
  const appearanceText = draft.appearance
    ? ` 외모는 ${withPeriod(draft.appearance)}`
    : "";
  const meritsText = draft.merits ? ` 장점은 ${withPeriod(draft.merits)}` : "";
  const demeritsText = draft.demerits
    ? ` 단점은 ${withPeriod(draft.demerits)}`
    : "";
  const extraText = draft.extra ? ` ${withPeriod(draft.extra)}` : "";

  return `${nameText}${conceptText}${ageText}${jobText}${appearanceText}${meritsText}${demeritsText}${extraText}`.trim();
}

function withPeriod(value: string) {
  const trimmed = value.trim();
  return trimmed.endsWith(".") ||
    trimmed.endsWith("다") ||
    trimmed.endsWith("요")
    ? trimmed
    : `${trimmed}.`;
}

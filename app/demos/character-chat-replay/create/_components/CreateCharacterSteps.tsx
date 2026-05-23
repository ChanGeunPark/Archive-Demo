import { useMemo, useState } from "react";
import {
  Card,
  HelperBar,
  InfoBanner,
  SectionTitle,
  Segmented,
  TextArea,
  TextInput,
} from "./CreateCharacterPrimitives";
import {
  categories,
  exampleCharacters,
  genders,
  initialDescriptionDraft,
  type DescriptionDraft,
  type FormState,
} from "./create-character.types";
import {
  personalityKeywords,
  personalityTabs,
  type PersonalityTab,
} from "./personality-keywords";

type UpdateForm = (key: keyof FormState, value: string) => void;

export function BasicInfoStep({
  form,
  updateForm,
}: {
  form: FormState;
  updateForm: UpdateForm;
}) {
  return (
    <>
      <InfoBanner />
      <Card className="mt-4">
        <SectionTitle title="캐릭터 카테고리" required />
        <Segmented
          options={categories}
          value={form.category}
          onChange={(value) => updateForm("category", value)}
        />
        {form.category && (
          <p className="mt-2 text-xs font-medium text-[#93989F]">
            ex) {exampleCharacters[form.category]}
          </p>
        )}
        <SectionTitle title="캐릭터 성별" required className="mt-8" />
        <Segmented
          options={genders}
          value={form.gender}
          onChange={(value) => updateForm("gender", value)}
        />
        <TextInput
          className="mt-8"
          label="캐릭터 이름"
          required
          value={form.name}
          maxLength={20}
          placeholder="최대 20글자 입력"
          onChange={(value) => updateForm("name", value)}
        />
      </Card>
    </>
  );
}

export function ProfileStep({
  bannerPreview,
  form,
  handleImage,
  profilePreview,
  updateForm,
}: {
  bannerPreview: string;
  form: FormState;
  handleImage: (file: File | null, type: "profile" | "banner") => void;
  profilePreview: string;
  updateForm: UpdateForm;
}) {
  const [tagInput, setTagInput] = useState("");
  const tags = useMemo(() => parseTags(form.tags), [form.tags]);

  function addTag() {
    const nextTag = tagInput.replaceAll("#", "").trim().slice(0, 8);
    if (!nextTag || tags.includes(nextTag) || tags.length >= 3) return;
    updateForm("tags", [...tags, nextTag].join("\n"));
    setTagInput("");
  }

  function removeTag(tag: string) {
    updateForm("tags", tags.filter((item) => item !== tag).join("\n"));
  }

  return (
    <Card className="mt-4">
      <section className="relative w-full">
        <SectionTitle title="캐릭터 프로필" required />
        <span className="ml-2.5 text-xs font-medium text-[#93989F]">
          (배경 이미지: 선택항목)
        </span>
        <div className="relative mt-4 aspect-square w-full max-w-[400px] overflow-hidden rounded-lg border border-dashed border-[#D8DBDE] bg-white p-2">
          <label className="absolute inset-2 z-0 cursor-pointer overflow-hidden rounded-lg bg-[#F4F5F6]">
            {bannerPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerPreview}
                alt=""
                className="h-full w-full object-cover brightness-50"
              />
            ) : (
              <div className="flex h-full flex-col items-center pt-3 text-sm font-semibold text-[#AEB2B8]">
                <span>5MB 이하의 JPG, PNG</span>
                <span className="mt-10 text-4xl font-light">+</span>
              </div>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) =>
                handleImage(event.target.files?.[0] ?? null, "banner")
              }
            />
          </label>
          <div className="absolute inset-x-0 bottom-0 z-10 flex h-[60%] flex-col items-center justify-center">
            <label className="flex h-[116px] w-[116px] cursor-pointer items-center justify-center rounded-full border border-dashed border-[#D8DBDE] p-2">
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#FFE55C] text-xs font-bold text-[#17191C]">
                {profilePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePreview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "프로필"
                )}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) =>
                  handleImage(event.target.files?.[0] ?? null, "profile")
                }
              />
            </label>
            <h2
              className={`mt-2 w-full px-4 text-center text-xl font-bold ${bannerPreview ? "text-white" : "text-[#17191C]"}`}
            >
              {form.name || "캐릭터 이름"}
            </h2>
            {form.statusMessage && (
              <p
                className={`mt-1 w-full px-4 text-center text-xs font-medium opacity-60 ${bannerPreview ? "text-white" : "text-[#17191C]"}`}
              >
                {form.statusMessage}
              </p>
            )}
          </div>
        </div>
        <TextInput
          className="mt-8"
          label="프로필 상태 메시지"
          value={form.statusMessage}
          maxLength={20}
          placeholder="최대 20글자 입력"
          onChange={(value) => updateForm("statusMessage", value)}
        />
        <section className="mt-8">
          <SectionTitle title="캐릭터 태그" />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm font-bold text-[#60656C]">#</span>
            <input
              value={tagInput}
              maxLength={8}
              placeholder="캐릭터 태그 입력"
              onChange={(event) =>
                setTagInput(event.target.value.replaceAll("#", ""))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              className="h-12 min-w-0 flex-1 rounded-lg border-2 border-[#F4F5F6] bg-transparent px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
            />
            <button
              type="button"
              disabled={!tagInput.trim() || tags.length >= 3}
              onClick={addTag}
              className="h-12 rounded-lg bg-[#FFE55C] px-4 text-sm font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
            >
              추가
            </button>
          </div>
          <div className="mt-3 flex min-h-12 flex-wrap gap-2 rounded-lg bg-[#F8F9FA] p-3">
            {tags.length === 0 ? (
              <p className="text-sm font-medium text-[#AEB2B8]">
                추가한 태그가 없습니다.
              </p>
            ) : (
              tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full bg-[#17191C] px-3 py-1.5 text-xs font-bold text-white"
                >
                  #{tag} ×
                </button>
              ))
            )}
          </div>
          <p className="mt-1 text-right text-xs font-medium text-[#93989F]">
            {tags.length}/3
          </p>
        </section>
      </section>
    </Card>
  );
}

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
              기본 양식
            </button>
            <button
              type="button"
              onClick={() => setDescriptionMode("free")}
              className={`h-8 rounded-lg px-3 text-xs font-bold ${descriptionMode === "free" ? "bg-[#FFE55C] text-[#17191C]" : "bg-[#F4F5F6] text-[#93989F]"}`}
            >
              자유 양식
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
            <p className="mt-1 text-right text-xs font-medium text-[#93989F]">
              {form.description.length}/300
            </p>
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
      <p className="mt-1 text-right text-xs font-medium text-[#93989F]">
        {form.personality.length}/100
      </p>
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

export function ChatSettingsStep({
  form,
  updateForm,
}: {
  form: FormState;
  updateForm: UpdateForm;
}) {
  return (
    <Card className="mt-4">
      <TextArea
        label="캐릭터 비밀 설정"
        value={form.secretContext}
        placeholder="다른 유저에게 보이지 않는 이 캐릭터만의 비밀 설정"
        onChange={(value) => updateForm("secretContext", value)}
      />
      <TextArea
        className="mt-6"
        label="첫 인사"
        value={form.openingMessage}
        placeholder="채팅방 첫 메시지"
        onChange={(value) => updateForm("openingMessage", value)}
      />
      <TextArea
        className="mt-6"
        label="시드 채팅"
        value={form.seedChat}
        placeholder={"_human::안녕\n_ai::어서 와."}
        onChange={(value) => updateForm("seedChat", value)}
      />
      <TextArea
        className="mt-6"
        label="예시 메시지"
        value={form.sampleMessages}
        placeholder={
          "한 줄에 하나씩 입력\n오늘 기분은 어때?\n이 장면을 요약해줘."
        }
        onChange={(value) => updateForm("sampleMessages", value)}
      />
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
      <span className="block text-sm font-bold text-[#17191C]">{label}</span>
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
          <h3 className="text-lg font-bold">성격 키워드 사전</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-lg border border-[#D8DBDE] px-3 text-xs font-bold"
          >
            닫기
          </button>
        </div>
        <div className="p-3">
          <div className="flex min-h-14 gap-2 overflow-x-auto rounded-lg bg-[#F8F9FA] p-2">
            {selected.length === 0 ? (
              <p className="self-center text-sm font-medium text-[#AEB2B8]">
                키워드를 선택해주세요.
              </p>
            ) : (
              selected.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => toggleKeyword(keyword)}
                  className="h-9 shrink-0 rounded-full bg-[#FFE55C] px-3 text-xs font-bold text-[#17191C]"
                >
                  {keyword} ×
                </button>
              ))
            )}
          </div>
          <p className="mt-1 text-right text-xs font-medium text-[#93989F]">
            {totalLength}/100
          </p>
          <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
            {personalityTabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`h-9 w-9 shrink-0 rounded-lg text-sm font-bold ${tab === item ? "bg-[#17191C] text-white" : "bg-[#F4F5F6] text-[#60656C]"}`}
              >
                {item}
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
              {keyword}
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
            추가하기
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

function parseTags(value: string) {
  return value
    .split("\n")
    .map((item) => item.replaceAll("#", "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function PreviewChat({
  form,
  profilePreview,
  bannerPreview,
}: {
  form: FormState;
  profilePreview: string;
  bannerPreview: string;
}) {
  return (
    <div className="mx-auto min-h-[calc(100vh-112px)] w-full max-w-[620px] overflow-hidden rounded-lg bg-white shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)]">
      <div className="relative h-52 bg-[#17191C]">
        {bannerPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerPreview}
            alt=""
            className="h-full w-full object-cover brightness-50"
          />
        )}
        <div className="absolute inset-x-0 bottom-5 flex flex-col items-center">
          {profilePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePreview}
              alt=""
              className="h-24 w-24 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <span className="h-24 w-24 rounded-full border-4 border-white bg-[#FFE55C]" />
          )}
          <h2 className="mt-2 text-xl font-bold text-white">
            {form.name || "캐릭터 이름"}
          </h2>
          <p className="text-xs font-medium text-white/60">
            {form.statusMessage || "상태 메시지"}
          </p>
        </div>
      </div>
      <div className="space-y-4 p-4 pb-20">
        <p className="rounded-lg bg-[#F4F5F6] p-4 text-sm leading-6 text-[#60656C]">
          {form.description}
        </p>
        <div className="flex items-end gap-2">
          {profilePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePreview}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="h-8 w-8 rounded-full bg-[#FFE55C]" />
          )}
          <p className="max-w-[75%] rounded-2xl rounded-bl-none bg-[#F4F5F6] px-4 py-3 text-sm leading-6">
            {form.openingMessage ||
              `${form.name || "캐릭터"}와 대화를 시작합니다.`}
          </p>
        </div>
        <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-none bg-[#FFE55C] px-4 py-3 text-sm font-medium">
          안녕, 오늘은 어떤 이야기를 해볼까?
        </div>
      </div>
    </div>
  );
}

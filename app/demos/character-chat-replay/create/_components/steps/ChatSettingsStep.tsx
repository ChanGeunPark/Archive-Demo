import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Card, SectionTitle, TextArea } from "../CreateCharacterPrimitives";
import type { FormState } from "../create-character.types";
import { parseSampleMessages } from "./message-utils";
import type { UpdateForm } from "./types";
import Typography from "@/components/typography/Typography";

export function ChatSettingsStep({
  form,
  profilePreview,
  updateForm,
}: {
  form: FormState;
  profilePreview: string;
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
      <SeedChatEditor
        className="mt-10"
        characterName={form.name}
        profilePreview={profilePreview}
        value={form.seedChat}
        onChange={(value) => updateForm("seedChat", value)}
      />
      <SampleMessageEditor
        className="mt-10"
        value={form.sampleMessages}
        onChange={(value) => updateForm("sampleMessages", value)}
      />
    </Card>
  );
}

function SeedChatEditor({
  characterName,
  className = "",
  onChange,
  profilePreview,
  value,
}: {
  characterName: string;
  className?: string;
  onChange: (value: string) => void;
  profilePreview: string;
  value: string;
}) {
  const parsedPairs = parseSeedChat(value);
  const [pairCount, setPairCount] = useState(() => parsedPairs.length);
  const pairs = Array.from(
    { length: Math.max(pairCount, parsedPairs.length, 1) },
    (_, index) => parsedPairs[index] ?? { human: "", ai: "" },
  ).slice(0, 8);

  function updatePair(index: number, key: keyof SeedPair, nextValue: string) {
    const nextPairs = pairs.map((pair, pairIndex) =>
      pairIndex === index ? { ...pair, [key]: nextValue.slice(0, 50) } : pair,
    );
    onChange(formatSeedChat(nextPairs));
  }

  function addPair() {
    if (pairs.length >= 8) return;
    setPairCount((current) => Math.min(8, Math.max(current, pairs.length) + 1));
  }

  function removePair(index: number) {
    const nextPairs = pairs.filter((_, pairIndex) => pairIndex !== index);
    setPairCount(Math.max(1, nextPairs.length));
    onChange(
      formatSeedChat(
        nextPairs.length > 0 ? nextPairs : [{ human: "", ai: "" }],
      ),
    );
  }

  return (
    <section className={className}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <SectionTitle title="AI 학습" />
          <Typography
            as="span"
            variant="body3"
            weight={500}
            color="#93989F"
            className="ml-1"
          >
            (수정불가)
          </Typography>
        </div>
        <InfoTooltip>
          캐릭터가 실제로 말할 것 같은 짧은 대화 예시를 넣으면, 말투와 반응을 더
          안정적으로 따라갑니다.
        </InfoTooltip>
      </div>

      <div className="rounded-lg bg-[#F8F9FA] p-2">
        <div className="space-y-5">
          {pairs.map((pair, index) => (
            <div key={`seed-${index}`} className="space-y-3">
              <div className="flex justify-end">
                <label className="block w-[78%] max-w-[420px]">
                  <span className="sr-only">유저 예상 대사 {index + 1}</span>
                  <input
                    value={pair.human}
                    maxLength={50}
                    placeholder="유저 대사 입력 (최대 50자)"
                    onChange={(event) =>
                      updatePair(index, "human", event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.preventDefault();
                    }}
                    className="h-12 w-full rounded-lg rounded-tr-none border-2 border-[#FFE55C] bg-white px-3 text-sm outline-none placeholder:text-[#AEB2B8]"
                  />
                </label>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {profilePreview ? (
                    <Image
                      src={profilePreview}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <Typography
                      as="span"
                      variant="body3"
                      weight={700}
                      color="#17191C"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE55C]"
                    >
                      AI
                    </Typography>
                  )}
                  <Typography as="span" variant="body2" weight={700} color="#17191C">
                    {characterName || "캐릭터 이름"}
                  </Typography>
                </div>
                <div className="flex items-center gap-2 pl-[50px]">
                  <label className="block w-[78%] max-w-[420px]">
                    <span className="sr-only">캐릭터 답변 {index + 1}</span>
                    <input
                      value={pair.ai}
                      maxLength={50}
                      placeholder="캐릭터 대사 입력 (최대 50자)"
                      onChange={(event) =>
                        updatePair(index, "ai", event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.preventDefault();
                      }}
                      className="h-12 w-full rounded-lg rounded-tl-none border-2 border-white bg-white px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
                    />
                  </label>
                  {pairs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePair(index)}
                      className="h-9 w-9 rounded-full border border-[#D8DBDE] text-sm font-bold text-[#60656C]"
                      aria-label={`${index + 1}번째 시드 채팅 삭제`}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={pairs.length >= 8}
          onClick={addPair}
          className="ml-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#17191C] text-2xl leading-none text-white disabled:bg-[#D8DBDE]"
          aria-label="시드 채팅 추가"
        >
          <Typography as="span" variant="h2" weight={400} color="white">
            +
          </Typography>
        </button>
      </div>
      <Typography
        variant="body3"
        weight={500}
        color="#93989F"
        align="right"
        className="mt-2"
      >
        {pairs.length}/8
      </Typography>
    </section>
  );
}

function SampleMessageEditor({
  className = "",
  onChange,
  value,
}: {
  className?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const [input, setInput] = useState("");
  const messages = useMemo(() => parseSampleMessages(value), [value]);

  function addMessage() {
    const nextMessage = input.trim().slice(0, 20);
    if (!nextMessage || messages.includes(nextMessage) || messages.length >= 5)
      return;
    onChange([...messages, nextMessage].join("\n"));
    setInput("");
  }

  function removeMessage(message: string) {
    onChange(messages.filter((item) => item !== message).join("\n"));
  }

  return (
    <section className={className}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <SectionTitle title="예시 대화" />
        <InfoTooltip>
          채팅방에 빠른 시작 문장으로 보여줄 메시지예요. 유저가 누르면 바로
          대화를 시작할 수 있습니다.
        </InfoTooltip>
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          maxLength={20}
          placeholder="예시 대화 작성 (최대 20자)"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addMessage();
            }
          }}
          className="h-12 min-w-0 flex-1 rounded-lg border-2 border-[#F4F5F6] bg-transparent px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
        />
        <button
          type="button"
          disabled={!input.trim() || messages.length >= 5}
          onClick={addMessage}
          className="h-12 rounded-lg bg-[#FFE55C] px-4 text-sm font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
        >
          <Typography as="span" variant="body2" weight={700} color="inherit">
            추가
          </Typography>
        </button>
      </div>
      <div className="mt-3 flex min-h-12 flex-wrap gap-2 rounded-lg bg-[#F8F9FA] p-3">
        {messages.length === 0 ? (
          <Typography variant="body2" weight={500} color="#AEB2B8">
            예시 대화를 추가해주세요.
          </Typography>
        ) : (
          messages.map((message) => (
            <button
              key={message}
              type="button"
              onClick={() => removeMessage(message)}
              className="rounded-full bg-[#17191C] px-3 py-1.5 text-xs font-bold text-white"
            >
              <Typography as="span" variant="body3" weight={700} color="white">
                {message} ×
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
        {messages.length}/5
      </Typography>
    </section>
  );
}

function InfoTooltip({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8DBDE] text-sm font-bold text-[#60656C]"
        aria-label="도움말"
      >
        <Typography as="span" variant="body2" weight={700} color="#60656C">
          i
        </Typography>
      </button>
      {open && (
        <Typography
          as="div"
          variant="body3"
          weight={500}
          color="white"
          className="absolute right-0 top-10 z-20 w-[min(300px,calc(100vw-48px))] rounded-lg bg-[#17191C] p-3 shadow-lg"
        >
          {children}
        </Typography>
      )}
    </div>
  );
}

type SeedPair = {
  human: string;
  ai: string;
};

function parseSeedChat(value: string): SeedPair[] {
  const lines = value.split("\n").map((line) => line.trim());
  const pairs: SeedPair[] = [];

  for (let index = 0; index < lines.length; index += 2) {
    const human = lines[index]?.replace(/^_human::/, "") ?? "";
    const ai = lines[index + 1]?.replace(/^_ai::/, "") ?? "";
    pairs.push({ human, ai });
  }

  const nonTrailingPairs = [...pairs];
  while (
    nonTrailingPairs.length > 1 &&
    !nonTrailingPairs[nonTrailingPairs.length - 1]?.human &&
    !nonTrailingPairs[nonTrailingPairs.length - 1]?.ai
  ) {
    nonTrailingPairs.pop();
  }

  return nonTrailingPairs.length > 0
    ? nonTrailingPairs.slice(0, 8)
    : [{ human: "", ai: "" }];
}

function formatSeedChat(pairs: SeedPair[]) {
  return pairs
    .flatMap((pair) => [
      pair.human ? `_human::${pair.human}` : "",
      pair.ai ? `_ai::${pair.ai}` : "",
    ])
    .join("\n");
}

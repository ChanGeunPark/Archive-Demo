"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Typography from "@/components/typography/Typography";

export function InfoBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center gap-4 rounded-lg bg-[#FFF7B8] p-3 text-left transition active:scale-[0.99]"
      >
        <Typography
          as="span"
          variant="body2"
          weight={700}
          color="#FFE55C"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FFE55C] bg-[#17191C] lg:h-10 lg:w-10"
        >
          i
        </Typography>
        <div className="flex flex-col">
          <Typography as="strong" variant="body1" weight={700} color="#17191C">
            고퀄 캐릭터를 만들고 싶다면?
          </Typography>
          <Typography as="span" variant="body3" weight={500} color="#60656C">
            캐릭터 만들기 꿀팁
          </Typography>
        </div>
      </button>
      <AiCharacterCreateInfoBottomSheet
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function AiCharacterCreateInfoBottomSheet({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (info.offset.y > 120 || info.velocity.y > 800) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="캐릭터 만들기 꿀팁"
            className="fixed bottom-0 left-1/2 z-[101] max-h-[86vh] w-full max-w-[500px] overflow-y-auto rounded-t-2xl bg-white pb-8 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]"
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={handleDragEnd}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex h-10 items-center justify-center bg-white">
              <span className="h-1 w-12 rounded-full bg-[#D8DBDE]" />
            </div>
            <div className="mx-auto px-4">
              <Typography variant="h3" color="#17191C">
                {`<기본편>`}
              </Typography>

              <InfoGuideSection
                description="어떤 캐릭터인지 한 눈에 봐도 알아챌 수 있는 사진을 선택해주세요."
                image="/images/ai/img_character_create_1.jpg"
                title="1. 프로필 사진"
              />

              <InfoGuideSection
                description="최대한 자세하게 서술해야, 내가 의도한 캐릭터를 만들 수 있어요."
                title="2. 캐릭터 소개"
              >
                <InfoGuideExample
                  image="/images/ai/img_character_create_2.jpg"
                  tone="good"
                >
                  좋은 예시1&#41; 캐릭터의 설정을 상세하게 줄글로 풀어쓰기
                </InfoGuideExample>
                <InfoGuideExample
                  image="/images/ai/img_character_create_3.jpg"
                  tone="good"
                >
                  좋은 예시2&#41; 캐릭터의 설정을 체계적으로 정리하기
                </InfoGuideExample>
                <InfoGuideExample
                  image="/images/ai/img_character_create_4.jpg"
                  tone="bad"
                >
                  나쁜 예시1&#41; 짧은 묘사
                </InfoGuideExample>
                <InfoGuideExample
                  image="/images/ai/img_character_create_5.jpg"
                  tone="bad"
                >
                  나쁜 예시2&#41; 모호하고, 명확하지 않은 묘사
                </InfoGuideExample>
              </InfoGuideSection>

              <InfoGuideSection
                description="성격은 캐릭터의 말투를 결정하는 요소로, 정교한 단어를 선택해야 실감나는 캐릭터를 만들 수 있어요."
                title="3. 성격"
              >
                <InfoGuideExample
                  image="/images/ai/img_character_create_6.jpg"
                  tone="good"
                >
                  좋은 예시&#41; 자세하고, 정교한 성격 조합
                </InfoGuideExample>
                <InfoGuideExample
                  image="/images/ai/img_character_create_7.jpg"
                  tone="bad"
                >
                  나쁜 예시&#41; 서로 모순되는 성격
                </InfoGuideExample>
              </InfoGuideSection>

              <Typography variant="h3" color="#17191C" className="mt-10">
                {`<심화편>`}
              </Typography>

              <InfoGuideSection
                description="캐릭터 해석에 충실한 대화를 나누고 싶다면, 캐릭터에게 말투와 행동에 대해 구체적인 명령어를 작성해주세요."
                title="4. 캐릭터 명령어 설정"
              >
                <InfoGuideExample
                  image="/images/ai/img_character_create_8.jpg"
                  tone="good"
                >
                  좋은 예시&#41; 상세하면서도 명확한 설명
                </InfoGuideExample>
              </InfoGuideSection>

              <InfoGuideSection
                description={
                  <>
                    진짜 같은 캐릭터를 만들기 위한 화룡점정, 캐릭터에게 구체적인
                    대화 정보를 학습시킬 수 있어요.
                    <br />
                    &#40;다만, AI 모델의 특성상 항상 원하는 답변이 나오지 않을
                    수 있으니 참고해주세요.&#41;
                  </>
                }
                title="5. AI 학습"
              >
                <InfoGuideExample
                  image="/images/ai/img_character_create_10.jpg"
                  tone="good"
                >
                  좋은 예시&#41; 성격과 캐릭터 정보를 모두 함축할 수 있는 질문과
                  답변
                </InfoGuideExample>
              </InfoGuideSection>

              <InfoGuideSection
                description="캐릭터의 본질을 찌르는 질문을 추가하면, 다른 사람들도 원활하게 캐릭터와 관계를 시작할 수 있어요."
                title="6. 예시 대화"
              >
                <InfoGuideExample
                  image="/images/ai/img_character_create_11.jpg"
                  tone="good"
                >
                  좋은 예시&#41; 캐릭터 소개, 성격, 세계관에 대한 질문
                </InfoGuideExample>
              </InfoGuideSection>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoGuideSection({
  children,
  description,
  image,
  title,
}: {
  children?: ReactNode;
  description: ReactNode;
  image?: string;
  title: string;
}) {
  return (
    <section className={title.startsWith("1.") ? "mt-8" : "mt-16"}>
      <Typography variant="h5" color="#17191C" className="mb-2">
        {title}
      </Typography>
      <Typography variant="body2" color="#3F444B">
        {description}
      </Typography>
      {image && <InfoGuideImage src={image} className="mt-4 rounded-lg" />}
      {children}
    </section>
  );
}

function InfoGuideExample({
  children,
  image,
  tone,
}: {
  children: ReactNode;
  image: string;
  tone: "good" | "bad";
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg">
      <div className="w-full rounded-t-lg border border-b-0 border-[#EDEEEF] bg-[#F8F9FA] px-2 py-3">
        <Typography
          variant="body2"
          weight={700}
          color={tone === "good" ? "#1976D2" : "#EE4553"}
        >
          {children}
        </Typography>
      </div>
      <InfoGuideImage src={image} className="rounded-b-lg" />
    </div>
  );
}

function InfoGuideImage({
  className = "",
  src,
}: {
  className?: string;
  src: string;
}) {
  return (
    <Image
      alt=""
      src={src}
      width={500}
      height={200}
      className={`h-auto w-full border border-[#EDEEEF] object-cover ${className}`}
    />
  );
}

export function Stepper({ step }: { step: number }) {
  const steps = ["시작하기", "프로필", "채팅 설정", "테스트"];

  return (
    <div className="pt-4">
      <div className="grid grid-cols-4 gap-2">
        {steps.map((item, index) => (
          <div key={item}>
            <div
              className={`h-1.5 rounded-full ${index <= step ? "bg-[#FFE55C]" : "bg-[#EDEEEF]"}`}
            />
            <Typography
              as="span"
              variant="caption"
              weight={700}
              color={index === step ? "#17191C" : "#93989F"}
              align="center"
              className="mt-2 block"
            >
              {item}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepButton({
  children,
  className = "",
  disabled,
  onClick,
  type = "button",
  variant,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  variant: "black" | "primary";
}) {
  const variantClass =
    variant === "primary"
      ? "bg-[#FFE55C] text-[#17191C]"
      : "bg-[#17191C] text-white";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`h-12 w-full rounded-full px-4 text-sm font-bold transition disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8] sm:text-base ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg bg-white p-4 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  required = false,
  className = "",
}: {
  title: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Typography
      as="h2"
      variant="body1"
      weight={700}
      color="#17191C"
      className={`relative inline-block ${className}`}
    >
      {title}
      {required && (
        <Typography
          as="span"
          variant="body3"
          color="#EE4553"
          className="absolute -right-2 -top-0.5"
        >
          *
        </Typography>
      )}
    </Typography>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { ko: string; en: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.en}
          type="button"
          onClick={() => onChange(option.en)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            value === option.en
              ? "scale-110 bg-[#FFE55C] text-[#17191C]"
              : "bg-[#F4F5F6] text-[#93989F]"
          }`}
        >
          <Typography
            as="span"
            variant="body2"
            weight={600}
            color={value === option.en ? "#17191C" : "#93989F"}
          >
            {option.ko}
          </Typography>
        </button>
      ))}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <SectionTitle title={label} required={required} />
      <input
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full rounded-lg border-2 border-[#F4F5F6] bg-transparent px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
      />
    </label>
  );
}

export function HelperBar({
  actionLabel,
  children,
  onAction,
}: {
  actionLabel: string;
  children: ReactNode;
  onAction: () => void;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[#F8F9FA] px-3 py-2">
      <Typography variant="body3" weight={600} color="#60656C">
        {children}
      </Typography>
      <button
        type="button"
        onClick={onAction}
        className="h-8 shrink-0 rounded-lg bg-[#FFE55C] px-3 text-xs font-bold text-[#17191C]"
      >
        <Typography as="span" variant="body3" weight={700} color="#17191C">
          {actionLabel}
        </Typography>
      </button>
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      {label && <SectionTitle title={label} required={required} />}
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${label ? "mt-3" : ""} min-h-28 w-full resize-none rounded-lg border-2 border-[#F4F5F6] bg-transparent p-3 text-sm leading-6 outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]`}
      />
    </label>
  );
}

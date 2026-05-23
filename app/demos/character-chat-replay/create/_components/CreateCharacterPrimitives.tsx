export function InfoBanner() {
  return (
    <button
      type="button"
      className="mt-4 flex w-full items-center gap-4 rounded-lg bg-[#FFF7B8] p-3 text-left"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FFE55C] bg-[#17191C] text-sm font-bold text-[#FFE55C] lg:h-10 lg:w-10">
        i
      </span>
      <span>
        <strong className="block text-base font-bold text-[#17191C]">고퀄 캐릭터를 만들고 싶다면?</strong>
        <span className="text-xs font-medium text-[#60656C]">캐릭터 만들기 꿀팁</span>
      </span>
    </button>
  );
}

export function Stepper({ step }: { step: number }) {
  const steps = ["시작하기", "프로필", "채팅 설정", "테스트"];

  return (
    <div className="pt-4">
      <div className="grid grid-cols-4 gap-2">
        {steps.map((item, index) => (
          <div key={item}>
            <div className={`h-1.5 rounded-full ${index <= step ? "bg-[#FFE55C]" : "bg-[#EDEEEF]"}`} />
            <span className={`mt-2 block text-center text-[11px] font-bold ${index === step ? "text-[#17191C]" : "text-[#93989F]"}`}>
              {item}
            </span>
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
  children: React.ReactNode;
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

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg bg-white p-4 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)] ${className}`}>{children}</section>;
}

export function SectionTitle({ title, required = false, className = "" }: { title: string; required?: boolean; className?: string }) {
  return (
    <h2 className={`relative inline-block text-base font-bold ${className}`}>
      {title}
      {required && <span className="absolute -right-2 -top-0.5 text-xs text-[#EE4553]">*</span>}
    </h2>
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
            value === option.en ? "scale-110 bg-[#FFE55C] text-[#17191C]" : "bg-[#F4F5F6] text-[#93989F]"
          }`}
        >
          {option.ko}
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
  children: React.ReactNode;
  onAction: () => void;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[#F8F9FA] px-3 py-2">
      <p className="text-xs font-semibold text-[#60656C]">{children}</p>
      <button
        type="button"
        onClick={onAction}
        className="h-8 shrink-0 rounded-lg bg-[#FFE55C] px-3 text-xs font-bold text-[#17191C]"
      >
        {actionLabel}
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

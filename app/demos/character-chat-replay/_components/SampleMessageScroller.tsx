import Typography from "@/components/typography/Typography";

type SampleMessageScrollerProps = {
  disabled: boolean;
  onSelect: (message: string) => void;
  samples: string[];
};

export function SampleMessageScroller({
  disabled,
  onSelect,
  samples,
}: SampleMessageScrollerProps) {
  return (
    <div className="flex-shrink-0 bg-[#F4F5F6] px-4 pb-2">
      <div className="flex gap-2 overflow-x-auto py-2">
        {samples.map((sample) => (
          <button
            key={sample}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(sample)}
            className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#60656C] disabled:opacity-50"
          >
            <Typography as="span" variant="body3" weight={600} color="#60656C">
              {sample}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
}

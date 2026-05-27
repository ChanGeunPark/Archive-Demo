import { formatKrw } from "@/lib/image-marketplace-flow/format";

export type PriceFilterRange = {
  minPrice?: number;
  maxPrice?: number;
};

export type PriceFilterOption = {
  id: string;
  label: string;
  range: PriceFilterRange;
};

export const PRICE_FILTER_OPTIONS: PriceFilterOption[] = [
  { id: "all", label: "전체", range: {} },
  { id: "under-200k", label: "20만원 이하", range: { maxPrice: 200_000 } },
  {
    id: "200k-300k",
    label: "20만원 ~ 30만원",
    range: { minPrice: 200_000, maxPrice: 300_000 },
  },
  {
    id: "300k-400k",
    label: "30만원 ~ 40만원",
    range: { minPrice: 300_000, maxPrice: 400_000 },
  },
  { id: "over-400k", label: "40만원 이상", range: { minPrice: 400_000 } },
];

export const DEFAULT_PRICE_FILTER_OPTION = PRICE_FILTER_OPTIONS[0];

export function isSamePriceRange(a: PriceFilterRange, b: PriceFilterRange) {
  return a.minPrice === b.minPrice && a.maxPrice === b.maxPrice;
}

export function hasActivePriceFilter(range: PriceFilterRange) {
  return range.minPrice != null || range.maxPrice != null;
}

export function findPriceFilterOptionByRange(range: PriceFilterRange) {
  return PRICE_FILTER_OPTIONS.find((option) =>
    isSamePriceRange(option.range, range),
  );
}

export function formatPriceFilterLabel(range: PriceFilterRange) {
  const preset = findPriceFilterOptionByRange(range);
  if (preset) {
    return preset.label;
  }

  const min = range.minPrice != null ? formatKrw(range.minPrice) : "";
  const max = range.maxPrice != null ? formatKrw(range.maxPrice) : "";

  if (min && max) {
    return `${min} ~ ${max}`;
  }
  if (min) {
    return `${min} 이상`;
  }
  if (max) {
    return `${max} 이하`;
  }
  return "전체";
}

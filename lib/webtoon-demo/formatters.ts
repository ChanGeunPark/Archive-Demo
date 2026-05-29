import type {
  CensorshipType,
  IntervalType,
  SeriesGenre,
} from "./types";

const INTERVAL_LABELS: Record<IntervalType, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const GENRE_LABELS: Record<SeriesGenre, string> = {
  ROMANCE: "로맨스",
  FANTASY: "판타지",
  ACTION: "액션",
  COMEDY: "코미디",
  THRILLER: "스릴러",
  DAILY: "일상",
};

const CENSORSHIP_LABELS: Record<CensorshipType, string> = {
  ALL: "전체 이용가",
  "15": "15세 이용가",
  "19": "19세 이용가",
};

export function formatIntervalType(interval: IntervalType): string {
  return INTERVAL_LABELS[interval] ?? interval;
}

export function formatGenreType(genre: SeriesGenre): string {
  return GENRE_LABELS[genre] ?? genre;
}

export function formatCensorship(censorship: CensorshipType): string {
  return CENSORSHIP_LABELS[censorship] ?? censorship;
}

export function formatAuthors(authorsRole: string) {
  try {
    const parsed = JSON.parse(authorsRole) as Record<string, string[]>;
    return Object.entries(parsed).map(([role, names]) => ({
      [role]: names.join(", "),
      value: names,
    }));
  } catch {
    return [];
  }
}

export function dateFormatting({
  time,
  customOptions,
}: {
  time?: string | Date;
  language?: string;
  customOptions?: Intl.DateTimeFormatOptions;
}): string {
  if (!time) return "-";
  const date = time instanceof Date ? time : new Date(time);
  return new Intl.DateTimeFormat("ko-KR", customOptions).format(date);
}

export function enterTextFormatter(text: string): string {
  return text.replace(/\\n/g, "\n");
}

export function numberWithComma(num: number): string {
  return num.toLocaleString("ko-KR");
}

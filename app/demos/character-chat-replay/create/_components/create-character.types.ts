export const categories = [
  { ko: "셀럽", en: "PERSON" },
  { ko: "캐릭터", en: "CHARACTER" },
  { ko: "자캐", en: "FICTIONAL" },
  { ko: "기타", en: "ETC" },
];

export const exampleCharacters: Record<string, string> = {
  PERSON: "아이돌, 배우, 스포츠 스타, 역사 인물",
  CHARACTER: "웹툰 주인공, 게임 NPC, 소설 속 조력자",
  FICTIONAL: "직접 만든 세계관의 주인공, 오리지널 캐릭터",
  ETC: "상담 파트너, 학습 도우미, 세계관 해설자",
};

export const genders = [
  { ko: "여자", en: "FEMALE" },
  { ko: "남자", en: "MALE" },
  { ko: "기타", en: "ETC" },
];

export type FormState = {
  category: string;
  gender: string;
  name: string;
  statusMessage: string;
  description: string;
  personality: string;
  secretContext: string;
  openingMessage: string;
  tags: string;
  seedChat: string;
  sampleMessages: string;
};

export type DescriptionDraft = {
  concept: string;
  age: string;
  job: string;
  appearance: string;
  merits: string;
  demerits: string;
  extra: string;
};

export const initialDescriptionDraft: DescriptionDraft = {
  concept: "",
  age: "",
  job: "",
  appearance: "",
  merits: "",
  demerits: "",
  extra: "",
};

export const initialForm: FormState = {
  category: "CHARACTER",
  gender: "FEMALE",
  name: "",
  statusMessage: "",
  description: "",
  personality: "",
  secretContext: "",
  openingMessage: "",
  tags: "",
  seedChat: "",
  sampleMessages: "",
};

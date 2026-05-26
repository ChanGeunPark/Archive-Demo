export type ArtworkTagItem = {
  value: string;
  label: string;
};

export type ArtworkTagCategory = {
  id: string;
  label: string;
  description: string;
  tags: ArtworkTagItem[];
};

export const artworkTagCategories: ArtworkTagCategory[] = [
  {
    id: "genre",
    label: "장르",
    description: "작품의 큰 형식과 제작 분야",
    tags: [
      { value: "illustration", label: "일러스트" },
      { value: "character", label: "캐릭터" },
      { value: "portrait", label: "초상화" },
      { value: "background", label: "배경" },
      { value: "concept-art", label: "컨셉 아트" },
      { value: "manga", label: "만화" },
      { value: "animation", label: "애니메이션" },
      { value: "3d", label: "3D" },
      { value: "pixel-art", label: "픽셀 아트" },
      { value: "design", label: "디자인" },
    ],
  },
  {
    id: "mood",
    label: "분위기",
    description: "구매자가 작품의 인상을 빠르게 파악하는 태그",
    tags: [
      { value: "cute", label: "귀여움" },
      { value: "cool", label: "멋짐" },
      { value: "beautiful", label: "아름다움" },
      { value: "calm", label: "차분함" },
      { value: "dreamy", label: "몽환적" },
      { value: "dark", label: "다크" },
      { value: "colorful", label: "컬러풀" },
      { value: "minimal", label: "미니멀" },
      { value: "retro", label: "레트로" },
      { value: "neon", label: "네온" },
    ],
  },
  {
    id: "subject",
    label: "소재",
    description: "작품 안에 등장하는 인물, 사물, 배경 요소",
    tags: [
      { value: "girl", label: "소녀" },
      { value: "boy", label: "소년" },
      { value: "animal", label: "동물" },
      { value: "flower", label: "꽃" },
      { value: "sky", label: "하늘" },
      { value: "sea", label: "바다" },
      { value: "city", label: "도시" },
      { value: "room", label: "공간" },
      { value: "robot", label: "로봇" },
      { value: "food", label: "음식" },
    ],
  },
  {
    id: "world",
    label: "세계관",
    description: "작품이 속한 설정이나 장르적 배경",
    tags: [
      { value: "fantasy", label: "판타지" },
      { value: "sci-fi", label: "SF" },
      { value: "school", label: "학교" },
      { value: "daily-life", label: "일상" },
      { value: "traditional", label: "전통" },
      { value: "cyberpunk", label: "사이버펑크" },
      { value: "fairy-tale", label: "동화" },
      { value: "game", label: "게임" },
      { value: "music", label: "음악" },
      { value: "festival", label: "축제" },
    ],
  },
  {
    id: "style",
    label: "화풍/기법",
    description: "표현 방식과 제작 재료",
    tags: [
      { value: "digital", label: "디지털" },
      { value: "watercolor", label: "수채화" },
      { value: "pencil", label: "연필" },
      { value: "line-art", label: "선화" },
      { value: "monochrome", label: "흑백" },
      { value: "flat-color", label: "플랫 컬러" },
      { value: "impasto", label: "두꺼운 채색" },
      { value: "sketch", label: "스케치" },
      { value: "hand-drawn", label: "손그림" },
      { value: "collage", label: "콜라주" },
    ],
  },
  {
    id: "market",
    label: "판매/권리",
    description: "마켓플레이스 구매 조건과 이용 범위",
    tags: [
      { value: "original", label: "오리지널" },
      { value: "fan-art", label: "팬아트" },
      { value: "commission", label: "커미션" },
      { value: "exclusive", label: "독점" },
      { value: "license", label: "라이선스" },
      { value: "commercial-use", label: "상업 이용" },
      { value: "personal-use", label: "개인 이용" },
      { value: "limited-edition", label: "한정판" },
      { value: "downloadable", label: "다운로드 가능" },
      { value: "print-ready", label: "프린트 가능" },
    ],
  },
];

export const artworkTagLabelByValue = artworkTagCategories
  .flatMap((category) => category.tags)
  .reduce<Record<string, string>>((acc, tag) => {
    acc[tag.value] = tag.label;
    return acc;
  }, {});

export function getArtworkTagLabel(tag: string) {
  return artworkTagLabelByValue[tag] || tag;
}

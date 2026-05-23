import type { DemoCharacter, DemoChatMessage } from "./types";

export function createDemoAiResponse(input: {
  character: DemoCharacter;
  message: string;
  history: DemoChatMessage[];
}) {
  const recentContext = input.history
    .slice(-4)
    .map((message) => `${message.role === "human" ? "사용자" : input.character.name}: ${message.content}`)
    .join(" / ");

  const contextLine = recentContext
    ? `방금 흐름도 기억하고 있어요. ${recentContext}`
    : input.character.openingMessage;

  return `${input.character.name} 응답: "${input.message}"라고 말해줬네요. ${contextLine} ${input.character.worldView} 지금 데모에서는 이 답변이 서버 Route Handler에서 스트리밍되고, 대화 히스토리는 Supabase 테이블에 저장되도록 구성되어 있어요.`;
}

export function splitForStream(content: string) {
  return content.match(/.{1,8}/g) ?? [content];
}

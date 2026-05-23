import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import type { DemoCharacter, DemoChatMessage } from "./types";

const SESSION_TTL_MS = Number(process.env.AI_CHAT_SESSION_TTL_MS || 12 * 60 * 60 * 1000);
const SESSION_HISTORY_LIMIT = Number(process.env.AI_CHAT_SESSION_HISTORY_LIMIT || 16);

type ChatSessionInstance = {
  chain: ReturnType<typeof createCharacterChain>;
  historyMessages: BaseMessage[];
  timeout: ReturnType<typeof setTimeout>;
  createdAt: number;
  lastUsedAt: number;
};

const sessionsByRoomId = new Map<string, ChatSessionInstance>();

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

function createCharacterChain(character: DemoCharacter) {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      [
        "너는 포트폴리오 데모의 AI 캐릭터 채팅 엔진이다.",
        "항상 한국어로 답하고, 사용자가 선택한 캐릭터의 말투와 세계관을 유지한다.",
        "답변은 모바일 채팅 말풍선에 맞게 2~5문장으로 간결하게 작성한다.",
        `캐릭터 이름: ${character.name}`,
        `캐릭터 역할: ${character.role}`,
        `캐릭터 세계관: ${character.worldView}`,
      ].join("\n"),
    ],
    new MessagesPlaceholder("history"),
    ["human", "{message}"],
  ]);

  const model = new ChatOpenAI({
    model: process.env.LANGCHAIN_OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.8,
  });

  return prompt.pipe(model);
}

function toLangChainMessages(history: DemoChatMessage[]) {
  return history.slice(-SESSION_HISTORY_LIMIT).map((message) => {
    if (message.role === "human") {
      return new HumanMessage(message.content);
    }

    return new AIMessage(message.content);
  });
}

function removeSession(roomId: string) {
  const session = sessionsByRoomId.get(roomId);

  if (session) {
    clearTimeout(session.timeout);
    sessionsByRoomId.delete(roomId);
  }
}

function armSessionTtl(roomId: string, session: ChatSessionInstance) {
  clearTimeout(session.timeout);
  session.timeout = setTimeout(() => {
    removeSession(roomId);
  }, SESSION_TTL_MS);
}

function getOrCreateSession(input: {
  roomId: string;
  character: DemoCharacter;
  history: DemoChatMessage[];
}) {
  const existingSession = sessionsByRoomId.get(input.roomId);

  if (existingSession) {
    existingSession.lastUsedAt = Date.now();
    armSessionTtl(input.roomId, existingSession);
    return existingSession;
  }

  const session: ChatSessionInstance = {
    chain: createCharacterChain(input.character),
    historyMessages: toLangChainMessages(input.history),
    timeout: setTimeout(() => {
      removeSession(input.roomId);
    }, SESSION_TTL_MS),
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
  };

  sessionsByRoomId.set(input.roomId, session);

  return session;
}

function stringifyChunkContent(content: unknown) {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String(item.text ?? "");
        }
        return "";
      })
      .join("");
  }

  return "";
}

export async function* streamLangChainCharacterResponse(input: {
  roomId: string;
  character: DemoCharacter;
  message: string;
  history: DemoChatMessage[];
}) {
  if (!process.env.OPENAI_API_KEY) {
    const fallback = createDemoAiResponse(input);

    for (const chunk of splitForStream(fallback)) {
      yield chunk;
      await new Promise((resolve) => setTimeout(resolve, 45));
    }

    return;
  }

  const session = getOrCreateSession(input);
  const stream = await session.chain.stream({
    history: session.historyMessages.slice(-SESSION_HISTORY_LIMIT),
    message: input.message,
  });
  let response = "";

  for await (const chunk of stream) {
    const token = stringifyChunkContent(chunk.content);
    if (token) {
      response += token;
      yield token;
    }
  }

  session.historyMessages = [
    ...session.historyMessages,
    new HumanMessage(input.message),
    new AIMessage(response),
  ].slice(-SESSION_HISTORY_LIMIT);
  session.lastUsedAt = Date.now();
  armSessionTtl(input.roomId, session);
}

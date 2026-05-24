import type {
  DemoChatMessage,
  DemoPublicCharacter,
  FormState,
} from "@/lib/ai-chat-demo/types";

export type FetchDemoCharactersResult = DemoPublicCharacter[];
export type FetchDemoChatHistoryResult = DemoChatMessage[];

export type CreateDemoCharacterInput = {
  values: FormState;
  profileImage: File;
  bannerImage: File | null;
  creatorId: string;
};

export type CreateDemoCharacterResult = {
  character: DemoPublicCharacter;
  roomId?: string;
};

export type CreateDemoChatRoomInput = {
  characterId: string;
  roomId: string;
};

export type CreateDemoChatRoomResult = {
  roomId: string;
  characterId: string;
};

export type DeleteDemoCharacterInput = {
  characterId: string;
  deleteId: string;
};

export type DeleteDemoCharacterResult = string;
export type DeleteDemoChatRoomResult = string;

export type PreviewChatInput = {
  form: FormState;
  message: string;
  history: Array<{
    role: "human" | "ai";
    content: string;
  }>;
};

export type PreviewChatResult = string;

export type StreamingChatInput = {
  characterId: string;
  roomId: string;
  message: string;
};

export type StreamingChatResult = Response;

async function readError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };

  return data.error || data.message || fallback;
}

// 캐릭터 목록 조회
export async function fetchDemoCharacters(): Promise<FetchDemoCharactersResult> {
  const response = await fetch("/api/ai-chat-demo/characters", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readError(response, "캐릭터 목록을 불러오지 못했습니다."),
    );
  }

  const data = (await response.json()) as {
    characters?: DemoPublicCharacter[];
  };

  return data.characters ?? [];
}

// 채팅방 메시지 조회
export async function fetchDemoChatHistory(
  roomId: string,
): Promise<FetchDemoChatHistoryResult> {
  const response = await fetch(
    `/api/ai-chat-demo/history?roomId=${encodeURIComponent(roomId)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(
      await readError(response, "채팅 기록을 불러오지 못했습니다."),
    );
  }

  const data = (await response.json()) as {
    messages?: DemoChatMessage[];
  };

  return data.messages ?? [];
}

// 캐릭터 생성
export async function createDemoCharacter(
  input: CreateDemoCharacterInput,
): Promise<CreateDemoCharacterResult> {
  const body = new FormData();

  Object.entries(input.values).forEach(([key, value]) => {
    body.append(key, value);
  });
  body.append("profileImage", input.profileImage);
  body.append("creatorId", input.creatorId);

  if (input.bannerImage) {
    body.append("bannerImage", input.bannerImage);
  }

  const response = await fetch("/api/ai-chat-demo/characters/create", {
    method: "POST",
    body,
  });

  const data = (await response.json().catch(() => ({}))) as {
    character?: DemoPublicCharacter;
    roomId?: string;
    error?: string;
  };

  if (!response.ok || !data.character) {
    throw new Error(data.error || "캐릭터 생성에 실패했습니다.");
  }

  return {
    character: data.character,
    roomId: data.roomId,
  };
}

// 채팅방 생성
export async function createDemoChatRoom(
  input: CreateDemoChatRoomInput,
): Promise<CreateDemoChatRoomResult> {
  const response = await fetch("/api/ai-chat-demo/rooms/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json().catch(() => ({}))) as {
    roomId?: string;
    characterId?: string;
    error?: string;
  };

  if (!response.ok || !data.roomId || !data.characterId) {
    throw new Error(data.error || "채팅방을 만들지 못했습니다.");
  }

  return { roomId: data.roomId, characterId: data.characterId };
}

// 캐릭터 삭제
export async function deleteDemoCharacter(
  input: DeleteDemoCharacterInput,
): Promise<DeleteDemoCharacterResult> {
  const response = await fetch(
    `/api/ai-chat-demo/characters/${encodeURIComponent(input.characterId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteId: input.deleteId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response, "캐릭터를 삭제하지 못했습니다."));
  }

  return input.characterId;
}

// 채팅방 삭제
export async function deleteDemoChatRoom(
  roomId: string,
): Promise<DeleteDemoChatRoomResult> {
  const response = await fetch(
    `/api/ai-chat-demo/rooms/${encodeURIComponent(roomId)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response, "채팅방을 삭제하지 못했습니다."));
  }

  return roomId;
}

// 테스트 채팅 요청
export async function requestPreviewChat(
  input: PreviewChatInput,
): Promise<PreviewChatResult> {
  const response = await fetch("/api/ai-chat-demo/characters/preview-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...input.form,
      message: input.message,
      history: input.history,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
  };

  if (!response.ok || !data.message) {
    throw new Error(data.error || "테스트 채팅 응답을 불러오지 못했습니다.");
  }

  return data.message;
}

// 스트리밍 채팅 요청
export async function requestStreamingChat(
  input: StreamingChatInput,
): Promise<StreamingChatResult> {
  const response = await fetch("/api/ai-chat-demo/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok || !response.body) {
    throw new Error(
      await readError(response, "서버 응답을 불러오지 못했습니다."),
    );
  }

  return response;
}

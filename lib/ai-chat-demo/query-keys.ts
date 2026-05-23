export const aiChatDemoKeys = {
  all: ["ai-chat-demo"] as const,
  characters: () => [...aiChatDemoKeys.all, "characters"] as const,
  character: (characterId: string) =>
    [...aiChatDemoKeys.characters(), characterId] as const,
  history: (roomId: string) =>
    [...aiChatDemoKeys.all, "history", roomId] as const,
};

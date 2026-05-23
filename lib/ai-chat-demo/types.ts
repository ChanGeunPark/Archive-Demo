export type DemoCharacter = {
  id: string;
  name: string;
  role: string;
  imageGradient: string;
  tags: string[];
  description: string;
  worldView: string;
  openingMessage: string;
  sampleMessages: string[];
  totalChatCount: number;
};

export type DemoChatMessage = {
  id: string;
  roomId: string;
  characterId: string;
  role: "human" | "ai";
  content: string;
  createdAt: string;
};

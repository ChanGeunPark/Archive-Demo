export type DemoCharacter = {
  id: string;
  name: string;
  role: string;
  category: string;
  gender: string;
  imageUrl: string | null;
  imageId: string | null;
  bannerImageUrl: string | null;
  bannerImageId: string | null;
  imageGradient: string;
  tags: string[];
  description: string;
  statusMessage: string | null;
  worldView: string;
  openingMessage: string;
  seedChat: string[];
  sampleMessages: string[];
  totalChatCount: number;
};

export type DemoPublicCharacter = Omit<DemoCharacter, "worldView">;

export type DemoChatMessage = {
  id: string;
  roomId: string;
  characterId: string;
  role: "human" | "ai";
  content: string;
  createdAt: string;
};

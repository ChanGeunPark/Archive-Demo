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
  secretContext: string;
  creatorId: string;
  openingMessage: string;
  seedChat: string[];
  sampleMessages: string[];
  totalChatCount: number;
};

export type DemoPublicCharacter = Omit<
  DemoCharacter,
  "worldView" | "secretContext" | "creatorId"
>;

export type DemoChatMessage = {
  id: string;
  roomId: string;
  characterId: string;
  role: "human" | "ai";
  content: string;
  createdAt: string;
};

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

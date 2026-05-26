import { randomUUID } from "node:crypto";
import {
  buildDemoChatRoomId,
  createDemoChatRoom,
  createDemoCharacter,
  toPublicCharacter,
} from "@/lib/ai-chat-demo/repository";
import { buildDemoCharacterWorldView } from "@/lib/ai-chat-demo/generator";
import { uploadImageToCloudflare } from "@/lib/cloudflare/images";

function safeText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .replaceAll("{", "(")
    .replaceAll("}", ")")
    .replaceAll("[", "(")
    .replaceAll("]", ")");
}

function parseList(value: FormDataEntryValue | null) {
  return safeText(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCreatorId(value: FormDataEntryValue | null) {
  return safeText(value)
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = safeText(formData.get("name")).slice(0, 20);
  const category = safeText(formData.get("category")) || "CHARACTER";
  const gender = safeText(formData.get("gender")) || "ETC";
  const description = safeText(formData.get("description")).slice(0, 500);
  const personality = safeText(formData.get("personality")).slice(0, 500);
  const statusMessage =
    safeText(formData.get("statusMessage")).slice(0, 40) || null;
  const secretContext = safeText(formData.get("secretContext")).slice(0, 800);
  const openingMessage = safeText(formData.get("openingMessage")).slice(0, 240);
  const tags = parseList(formData.get("tags")).slice(0, 8);
  const seedChat = parseList(formData.get("seedChat")).slice(0, 10);
  const sampleMessages = parseList(formData.get("sampleMessages")).slice(0, 5);
  const creatorId = normalizeCreatorId(formData.get("creatorId"));
  const profileImage = formData.get("profileImage");
  const bannerImage = formData.get("bannerImage");

  if (!name || !description || !personality || !creatorId) {
    return Response.json(
      { error: "name, description, personality, and creatorId are required." },
      { status: 400 },
    );
  }

  if (!(profileImage instanceof File)) {
    return Response.json(
      { error: "profileImage is required." },
      { status: 400 },
    );
  }

  const characterId = randomUUID();
  const profileUpload = await uploadImageToCloudflare({
    file: profileImage,
    id: `ai-demo/${characterId}/profile`,
    metadata: {
      characterId,
      kind: "profile",
    },
  });

  const bannerUpload =
    bannerImage instanceof File && bannerImage.size > 0
      ? await uploadImageToCloudflare({
          file: bannerImage,
          id: `ai-demo/${characterId}/banner`,
          metadata: {
            characterId,
            kind: "banner",
          },
        })
      : null;

  const worldView = buildDemoCharacterWorldView({
    name,
    gender,
    personality,
    description,
  });

  const character = await createDemoCharacter({
    id: characterId,
    name,
    role: statusMessage || `${category} 캐릭터`,
    category,
    gender,
    imageUrl: profileUpload.url,
    imageId: profileUpload.id,
    bannerImageUrl: bannerUpload?.url ?? null,
    bannerImageId: bannerUpload?.id ?? null,
    imageGradient: "from-[#FFE55C] via-[#FFBF5C] to-[#FF8F5C]",
    tags,
    description,
    statusMessage,
    worldView,
    secretContext,
    creatorId,
    openingMessage,
    seedChat,
    sampleMessages,
  });

  const roomId = buildDemoChatRoomId({
    characterId: character.id,
    roomId: creatorId,
  });

  await createDemoChatRoom({
    characterId: character.id,
    roomId,
  });

  return Response.json(
    { character: toPublicCharacter(character), roomId },
    { status: 201 },
  );
}

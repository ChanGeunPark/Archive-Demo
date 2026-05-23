import {
  buildDemoChatRoomId,
  createDemoChatRoom,
  getDemoCharacter,
} from "@/lib/ai-chat-demo/repository";

type CreateRoomRequestBody = {
  characterId?: string;
  roomId?: string;
};

function normalizeRoomId(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[/?#&=]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateRoomRequestBody;
  const characterId = body.characterId?.trim();
  const requestedRoomId = normalizeRoomId(body.roomId ?? "");

  if (!characterId || !requestedRoomId) {
    return Response.json(
      { error: "characterId and roomId are required." },
      { status: 400 },
    );
  }

  const character = await getDemoCharacter(characterId);

  if (!character) {
    return Response.json({ error: "Character not found." }, { status: 404 });
  }

  const roomId = buildDemoChatRoomId({
    characterId: character.id,
    roomId: requestedRoomId,
  });

  await createDemoChatRoom({
    characterId,
    roomId,
  });

  return Response.json({ roomId, characterId }, { status: 201 });
}

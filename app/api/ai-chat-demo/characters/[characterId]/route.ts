import {
  deleteDemoCharacterById,
  getDemoCharacter,
} from "@/lib/ai-chat-demo/repository";
import { deleteImageFromCloudflare } from "@/lib/cloudflare/images";

type DeleteCharacterRequestBody = {
  deleteId?: string;
};

function normalizeId(value: string | undefined) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ characterId: string }> },
) {
  const { characterId } = await params;
  const body = (await request.json()) as DeleteCharacterRequestBody;
  const deleteId = normalizeId(body.deleteId);
  const adminId = normalizeId(process.env.AI_DEMO_ADMIN_ID || "admin");

  if (!deleteId) {
    return Response.json({ error: "deleteId is required." }, { status: 400 });
  }

  const character = await getDemoCharacter(characterId);

  if (!character) {
    return Response.json({ error: "Character not found." }, { status: 404 });
  }

  if (deleteId !== character.creatorId && (!adminId || deleteId !== adminId)) {
    return Response.json(
      { error: "캐릭터를 삭제할 권한이 없습니다." },
      { status: 403 },
    );
  }

  const imageIds = [character.imageId, character.bannerImageId].filter(
    (imageId): imageId is string => Boolean(imageId),
  );

  try {
    await Promise.all(
      imageIds.map((imageId) => deleteImageFromCloudflare(imageId)),
    );
    await deleteDemoCharacterById(characterId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete character.";

    return Response.json({ error: message }, { status: 502 });
  }

  return Response.json({ characterId }, { status: 200 });
}

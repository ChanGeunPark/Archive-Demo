import { deleteDemoChatRoomById } from "@/lib/ai-chat-demo/repository";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;
  const normalizedRoomId = roomId.trim();

  if (!normalizedRoomId) {
    return Response.json({ error: "roomId is required." }, { status: 400 });
  }

  try {
    await deleteDemoChatRoomById(normalizedRoomId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete chat room.";

    return Response.json({ error: message }, { status: 502 });
  }

  return Response.json({ roomId: normalizedRoomId }, { status: 200 });
}

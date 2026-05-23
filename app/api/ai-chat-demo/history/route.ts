import { getDemoChatHistory } from "@/lib/ai-chat-demo/repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");

  if (!roomId) {
    return Response.json({ error: "roomId is required." }, { status: 400 });
  }

  const messages = await getDemoChatHistory(roomId);

  return Response.json({ messages });
}

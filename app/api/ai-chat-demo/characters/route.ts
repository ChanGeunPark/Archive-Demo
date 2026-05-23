import { getDemoCharacters } from "@/lib/ai-chat-demo/repository";

export async function GET() {
  const characters = await getDemoCharacters();

  return Response.json({ characters });
}

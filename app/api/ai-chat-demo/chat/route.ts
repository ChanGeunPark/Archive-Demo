import { randomUUID } from "node:crypto";
import { streamLangChainCharacterResponse } from "@/lib/ai-chat-demo/generator";
import {
  getDemoCharacter,
  getDemoChatHistory,
  saveDemoMessage,
} from "@/lib/ai-chat-demo/repository";

type ChatRequestBody = {
  roomId?: string;
  characterId?: string;
  message?: string;
};

const encoder = new TextEncoder();

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequestBody;
  const roomId = body.roomId || randomUUID();
  const characterId = body.characterId;
  const userMessage = body.message?.trim();

  if (!characterId || !userMessage) {
    return Response.json(
      { error: "characterId and message are required." },
      { status: 400 },
    );
  }

  const character = await getDemoCharacter(characterId);

  if (!character) {
    return Response.json({ error: "Character not found." }, { status: 404 });
  }

  const history = await getDemoChatHistory(roomId);
  await saveDemoMessage({
    roomId,
    characterId,
    role: "human",
    content: userMessage,
  });

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`event: meta\ndata: ${JSON.stringify({ roomId })}\n\n`));
      let aiResponse = "";

      for await (const chunk of streamLangChainCharacterResponse({
        roomId,
        character,
        message: userMessage,
        history,
      })) {
        aiResponse += chunk;
        controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`));
      }

      await saveDemoMessage({
        roomId,
        characterId,
        role: "ai",
        content: aiResponse,
      });

      controller.enqueue(encoder.encode("event: done\ndata: {}\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

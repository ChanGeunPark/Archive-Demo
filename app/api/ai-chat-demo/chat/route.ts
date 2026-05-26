import { randomUUID } from "node:crypto";
import {
  hasCachedSession,
  streamLangChainCharacterResponse,
} from "@/lib/ai-chat-demo/generator";
import {
  getDemoCharacter,
  getDemoChatHistory,
  saveDemoMessage,
} from "@/lib/ai-chat-demo/repository";
import { hasSupabaseAdminEnv } from "@/lib/supabase/admin";

type ChatRequestBody = {
  roomId?: string;
  characterId?: string;
  message?: string;
};

const encoder = new TextEncoder();

function encodeSseEvent(event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

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

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encodeSseEvent("meta", { roomId }));

      try {
        const useCachedHistory = hasCachedSession(roomId);
        const [character, history] = await Promise.all([
          getDemoCharacter(characterId),
          useCachedHistory ? Promise.resolve([]) : getDemoChatHistory(roomId),
        ]);

        if (!character) {
          controller.enqueue(
            encodeSseEvent("error", { error: "Character not found." }),
          );
          controller.close();
          return;
        }

        const savedUserMessage = await saveDemoMessage({
          roomId,
          characterId,
          role: "human",
          content: userMessage,
        });

        if (hasSupabaseAdminEnv() && !savedUserMessage) {
          controller.enqueue(
            encodeSseEvent("error", { error: "Failed to save message." }),
          );
          controller.close();
          return;
        }

        let aiResponse = "";

        for await (const chunk of streamLangChainCharacterResponse({
          roomId,
          character,
          message: userMessage,
          history,
        })) {
          aiResponse += chunk;
          controller.enqueue(encodeSseEvent("token", { token: chunk }));
        }

        const savedAiMessage = await saveDemoMessage({
          roomId,
          characterId,
          role: "ai",
          content: aiResponse,
        });

        if (hasSupabaseAdminEnv() && !savedAiMessage) {
          console.error("[ai-chat-demo] Failed to persist AI response.", {
            roomId,
          });
        }

        controller.enqueue(encodeSseEvent("done", {}));
        controller.close();
      } catch (error) {
        console.error("[ai-chat-demo] chat stream failed.", error);
        controller.enqueue(
          encodeSseEvent("error", {
            error: "Failed to generate response.",
          }),
        );
        controller.close();
      }
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

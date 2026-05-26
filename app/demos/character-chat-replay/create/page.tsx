import type { Metadata } from "next";
import CreateCharacterClient from "./CreateCharacterClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "캐릭터 생성",
  description:
    "CHIZU COMICS AI 채팅 데모에서 새 캐릭터를 생성하고 미리보기할 수 있습니다.",
  path: "/demos/character-chat-replay/create",
});

export default function CreateCharacterPage() {
  return <CreateCharacterClient />;
}

import CharacterSelectClient from "./_components/CharacterSelectClient";
import {
  getDemoCharacters,
  toPublicCharacter,
} from "@/lib/ai-chat-demo/repository";

export default async function CharacterChatReplayDemo() {
  const characters = await getDemoCharacters();

  return <CharacterSelectClient characters={characters.map(toPublicCharacter)} />;
}

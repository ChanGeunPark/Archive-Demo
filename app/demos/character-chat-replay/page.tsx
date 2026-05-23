import Link from "next/link";
import { getDemoCharacters } from "@/lib/ai-chat-demo/repository";

export default async function CharacterChatReplayDemo() {
  const characters = await getDemoCharacters();

  return (
    <main className="min-h-screen bg-[#F4F5F6] text-[#17191C]">
      <section className="mx-auto min-h-screen w-full max-w-[620px] bg-white">
        <header className="sticky top-0 z-10 border-b border-[#EDEEEF] bg-white/95 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-[#60656C]">
              Archive Demo
            </Link>
            <span className="rounded-full bg-[#FFFACC] px-3 py-1 text-xs font-semibold text-[#17191C]">
              AI Chat
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-normal">
            AI 캐릭터 선택
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#72777E]">
            Chizu Comics의 AI 캐릭터 화면 톤을 바탕으로, 캐릭터 선택에서 채팅방까지 이어지는 Supabase 기반 데모입니다.
          </p>
        </header>

        <section className="px-4 py-5">
          <div className="rounded-2xl bg-[#17191C] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE55C]">
              Character Chat Demo
            </p>
            <h2 className="mt-3 text-xl font-bold">먼저 대화할 캐릭터를 고르세요</h2>
            <p className="mt-2 text-sm leading-6 text-[#D8DBDE]">
              선택한 캐릭터로 채팅방이 열리고, 메시지는 API Route를 통해 스트리밍됩니다. Supabase 환경변수가 있으면 히스토리가 저장됩니다.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3 bg-[#F4F5F6] px-3 py-4">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/demos/character-chat-replay/chat/${character.id}`}
              className="flex h-[170px] flex-col items-center justify-center rounded-lg bg-white p-2 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_8px_40px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5"
            >
              <div className="relative overflow-hidden rounded-xl border border-[#F4F5F6]">
                <div
                  className={`h-[92px] w-[92px] bg-gradient-to-br ${character.imageGradient}`}
                />
                <div className="absolute bottom-0 left-0 flex w-full items-center justify-center bg-black/60 py-0.5 text-[11px] font-semibold text-white">
                  {character.totalChatCount.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex h-[46px] flex-col items-center justify-center text-center">
                <h3 className="max-w-[92px] truncate text-sm font-bold">
                  {character.name}
                </h3>
                <p className="mt-1 max-w-[96px] truncate text-[11px] text-[#72777E]">
                  {character.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}

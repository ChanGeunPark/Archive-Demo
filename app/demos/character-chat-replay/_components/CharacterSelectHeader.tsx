import Link from "next/link";

export function CharacterSelectHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#EDEEEF] bg-white/95 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-[#60656C]">
          Archive Demo
        </Link>
        <Link
          href="/demos/character-chat-replay/create"
          className="rounded-full bg-[#FFE55C] px-3 py-1 text-xs font-semibold text-[#17191C]"
        >
          캐릭터 만들기
        </Link>
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-normal">
        AI 캐릭터 선택
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#72777E]">
        Chizu Comics의 AI 캐릭터 화면 톤을 바탕으로, 캐릭터 선택에서 채팅방까지
        이어지는 Supabase 기반 데모입니다. 실제 프로젝트에선 GraphQL을
        사용하지만, 데모에선 REST API와 TanStack Query로 재구성했습니다.
      </p>
    </header>
  );
}

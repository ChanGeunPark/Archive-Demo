import Link from "next/link";
import Typography from "@/components/typography/Typography";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";

export function CharacterSelectHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#EDEEEF] bg-white/95 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 transition group hover:opacity-80"
        >
          <KeyboardArrowLeftIcon className="group-hover:opacity-80 fill-[#60656C]" />
          <Typography
            as="span"
            variant="body2"
            weight={600}
            color="#60656C"
            className="group-hover:opacity-80"
          >
            Archive Demo
          </Typography>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/demos/character-chat-replay/technical-notes"
            className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-white"
          >
            <Typography as="span" variant="body3" weight={600} color="white">
              기술 노트
            </Typography>
          </Link>
          <Link
            href="/demos/character-chat-replay/create"
            className="rounded-full bg-[#FFE55C] px-3 py-1 text-xs font-semibold text-[#17191C]"
          >
            <Typography as="span" variant="body3" weight={600} color="#17191C">
              캐릭터 만들기
            </Typography>
          </Link>
        </div>
      </div>
      <Typography variant="h2" color="#17191C" className="mt-4">
        AI 캐릭터 선택
      </Typography>
      <Typography variant="body2" color="#72777E" className="mt-2">
        Chizu Comics의 AI 캐릭터 화면 톤을 바탕으로, 캐릭터 선택에서 채팅방까지
        이어지는 Supabase 기반 데모입니다. 실제 프로젝트에선 GraphQL을
        사용하지만, 데모에선 REST API와 TanStack Query로 재구성했습니다.
      </Typography>
    </header>
  );
}

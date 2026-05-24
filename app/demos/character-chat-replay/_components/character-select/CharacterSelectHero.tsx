import Typography from "@/components/typography/Typography";

export function CharacterSelectHero() {
  return (
    <section className="px-4 py-5">
      <div className="rounded-2xl bg-[#17191C] p-5 text-white">
        <Typography
          variant="body3"
          weight={600}
          color="#FFE55C"
          className="uppercase tracking-[0.18em]"
        >
          Character Chat Demo
        </Typography>
        <Typography variant="h3" color="white" className="mt-3">
          먼저 대화할 캐릭터를 고르세요
        </Typography>
        <Typography variant="body2" color="#D8DBDE" className="mt-2">
          캐릭터 정보를 확인한 뒤 원하는 채팅 ID로 채팅방을 시작할 수
          있습니다.
        </Typography>
      </div>
    </section>
  );
}

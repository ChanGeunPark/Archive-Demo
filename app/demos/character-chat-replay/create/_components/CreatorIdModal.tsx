import Typography from "@/components/typography/Typography";
import { normalizeCreatorId } from "./create-character.utils";

type CreatorIdModalProps = {
  creatorId: string;
  loading: boolean;
  open: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function CreatorIdModal({
  creatorId,
  loading,
  open,
  onChange,
  onClose,
  onConfirm,
}: CreatorIdModalProps) {
  const normalizedCreatorId = normalizeCreatorId(creatorId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
      <section className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <Typography variant="h4" color="#17191C">
          생성 ID 입력
        </Typography>
        <Typography variant="body2" color="#60656C" className="mt-2">
          이 ID로 채팅방을 만들고, 나중에 캐릭터 삭제 권한을 확인합니다.
        </Typography>
        <label className="mt-4 block">
          <Typography as="span" variant="body2" weight={700} color="#17191C">
            User ID
          </Typography>
          <input
            autoFocus
            value={creatorId}
            onChange={(event) => onChange(event.target.value)}
            placeholder="예: my-user-id"
            className="mt-2 h-12 w-full rounded-lg border-2 border-[#F4F5F6] px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
          />
          {creatorId && normalizedCreatorId !== creatorId && (
            <Typography
              as="span"
              variant="body3"
              weight={500}
              color="#72777E"
              className="mt-1 block"
            >
              공백은 `-`로 바뀌어 `{normalizedCreatorId}`로 저장됩니다.
            </Typography>
          )}
        </label>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-11 flex-1 rounded-full border border-[#D8DBDE] text-sm font-bold text-[#17191C] disabled:opacity-50"
          >
            <Typography as="span" variant="body2" weight={700} color="#17191C">
              취소
            </Typography>
          </button>
          <button
            type="button"
            disabled={!normalizedCreatorId || loading}
            onClick={onConfirm}
            className="h-11 flex-1 rounded-full rounded-tr-none bg-[#FFE55C] text-sm font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
          >
            <Typography as="span" variant="body2" weight={700} color="inherit">
              {loading ? "생성 중..." : "생성하기"}
            </Typography>
          </button>
        </div>
      </section>
    </div>
  );
}

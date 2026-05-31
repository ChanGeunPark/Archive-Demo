import { useMemo, useState } from "react";
import Image from "next/image";
import { Card, SectionTitle, TextInput } from "../CreateCharacterPrimitives";
import type { FormState } from "../create-character.types";
import type { UpdateForm } from "./types";
import Typography from "@/components/typography/Typography";

export function ProfileStep({
  bannerPreview,
  form,
  handleImage,
  profilePreview,
  updateForm,
}: {
  bannerPreview: string;
  form: FormState;
  handleImage: (file: File | null, type: "profile" | "banner") => void;
  profilePreview: string;
  updateForm: UpdateForm;
}) {
  const [tagInput, setTagInput] = useState("");
  const tags = useMemo(() => parseTags(form.tags), [form.tags]);

  function addTag() {
    const nextTag = tagInput.replaceAll("#", "").trim().slice(0, 8);
    if (!nextTag || tags.includes(nextTag) || tags.length >= 3) return;
    updateForm("tags", [...tags, nextTag].join("\n"));
    setTagInput("");
  }

  function removeTag(tag: string) {
    updateForm("tags", tags.filter((item) => item !== tag).join("\n"));
  }

  return (
    <Card className="mt-4">
      <section className="relative w-full">
        <SectionTitle title="캐릭터 프로필" required />
        <Typography
          as="span"
          variant="body3"
          weight={500}
          color="#93989F"
          className="ml-2.5"
        >
          (배경 이미지: 선택항목)
        </Typography>
        <div className="relative mt-4 aspect-square w-full max-w-[350px] overflow-hidden rounded-lg border border-dashed border-[#D8DBDE] bg-white p-2">
          <label className="absolute inset-2 z-0 cursor-pointer overflow-hidden rounded-lg bg-[#F4F5F6]">
            {bannerPreview ? (
              <Image
                src={bannerPreview}
                alt=""
                fill
                sizes="(max-width: 400px) 100vw, 400px"
                className="object-cover brightness-50"
                unoptimized
              />
            ) : (
              <div className="flex h-full flex-col items-center pt-3">
                <Typography
                  as="span"
                  variant="body2"
                  weight={600}
                  color="#AEB2B8"
                >
                  5MB 이하의 JPG, PNG
                </Typography>
                <Typography
                  as="span"
                  variant="h2"
                  weight={300}
                  color="#AEB2B8"
                  className="mt-10"
                >
                  +
                </Typography>
              </div>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) =>
                handleImage(event.target.files?.[0] ?? null, "banner")
              }
            />
          </label>
          <div className="absolute inset-x-0 bottom-0 z-10 flex h-[60%] flex-col items-center justify-center">
            <label className="flex h-[116px] w-[116px] cursor-pointer items-center justify-center rounded-full border border-dashed border-[#D8DBDE] p-2">
              <Typography
                as="span"
                variant="body3"
                weight={700}
                color="#17191C"
                className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#FFE55C]"
              >
                {profilePreview ? (
                  <Image
                    src={profilePreview}
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  "프로필"
                )}
              </Typography>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) =>
                  handleImage(event.target.files?.[0] ?? null, "profile")
                }
              />
            </label>
            <Typography
              variant="h3"
              color={bannerPreview ? "white" : "#17191C"}
              align="center"
              className="mt-2 w-full px-4"
            >
              {form.name || "캐릭터 이름"}
            </Typography>
            {form.statusMessage && (
              <Typography
                variant="body3"
                weight={500}
                color={bannerPreview ? "white" : "#17191C"}
                align="center"
                className="mt-1 w-full px-4 opacity-60"
              >
                {form.statusMessage}
              </Typography>
            )}
          </div>
        </div>
        <TextInput
          className="mt-8"
          label="프로필 상태 메시지"
          value={form.statusMessage}
          maxLength={20}
          placeholder="최대 20글자 입력"
          onChange={(value) => updateForm("statusMessage", value)}
        />
        <section className="mt-8">
          <SectionTitle title="캐릭터 태그" />
          <div className="mt-3 flex items-center gap-2">
            <Typography as="span" variant="body2" weight={700} color="#60656C">
              #
            </Typography>
            <input
              value={tagInput}
              maxLength={8}
              placeholder="캐릭터 태그 입력"
              onChange={(event) =>
                setTagInput(event.target.value.replaceAll("#", ""))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              className="h-12 min-w-0 flex-1 rounded-lg border-2 border-[#F4F5F6] bg-transparent px-3 text-sm outline-none placeholder:text-[#AEB2B8] focus:border-[#FFE55C]"
            />
            <button
              type="button"
              disabled={!tagInput.trim() || tags.length >= 3}
              onClick={addTag}
              className="h-12 rounded-lg bg-[#FFE55C] px-4 text-sm font-bold text-[#17191C] disabled:bg-[#EDEEEF] disabled:text-[#AEB2B8]"
            >
              <Typography
                as="span"
                variant="body2"
                weight={700}
                color="inherit"
              >
                추가
              </Typography>
            </button>
          </div>
          <div className="mt-3 flex min-h-12 flex-wrap gap-2 rounded-lg bg-[#F8F9FA] p-3">
            {tags.length === 0 ? (
              <Typography variant="body2" weight={500} color="#AEB2B8">
                추가한 태그가 없습니다.
              </Typography>
            ) : (
              tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full bg-[#17191C] px-3 py-1.5 text-xs font-bold text-white"
                >
                  <Typography
                    as="span"
                    variant="body3"
                    weight={700}
                    color="white"
                  >
                    #{tag} ×
                  </Typography>
                </button>
              ))
            )}
          </div>
          <Typography
            variant="body3"
            weight={500}
            color="#93989F"
            align="right"
            className="mt-1"
          >
            {tags.length}/3
          </Typography>
        </section>
      </section>
    </Card>
  );
}

function parseTags(value: string) {
  return value
    .split("\n")
    .map((item) => item.replaceAll("#", "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

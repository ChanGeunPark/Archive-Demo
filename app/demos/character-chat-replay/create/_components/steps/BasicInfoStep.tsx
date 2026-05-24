import {
  Card,
  InfoBanner,
  SectionTitle,
  Segmented,
  TextInput,
} from "../CreateCharacterPrimitives";
import {
  categories,
  exampleCharacters,
  genders,
  type FormState,
} from "../create-character.types";
import type { UpdateForm } from "./types";
import Typography from "@/components/typography/Typography";

export function BasicInfoStep({
  form,
  updateForm,
}: {
  form: FormState;
  updateForm: UpdateForm;
}) {
  return (
    <>
      <InfoBanner />
      <Card className="mt-4">
        <SectionTitle title="캐릭터 카테고리" required />
        <Segmented
          options={categories}
          value={form.category}
          onChange={(value) => updateForm("category", value)}
        />
        {form.category && (
          <Typography
            variant="body3"
            weight={500}
            color="#93989F"
            className="mt-2"
          >
            ex) {exampleCharacters[form.category]}
          </Typography>
        )}
        <SectionTitle title="캐릭터 성별" required className="mt-8" />
        <Segmented
          options={genders}
          value={form.gender}
          onChange={(value) => updateForm("gender", value)}
        />
        <TextInput
          className="mt-8"
          label="캐릭터 이름"
          required
          value={form.name}
          maxLength={20}
          placeholder="최대 20글자 입력"
          onChange={(value) => updateForm("name", value)}
        />
      </Card>
    </>
  );
}

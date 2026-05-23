import type { FormState } from "../create-character.types";

export type UpdateForm = (key: keyof FormState, value: string) => void;

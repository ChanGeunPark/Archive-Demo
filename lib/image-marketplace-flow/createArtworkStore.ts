"use client";

import { create } from "zustand";
import type { ArtworkLicensePolicy } from "./artworkCreateUtils";

export type { ArtworkLicensePolicy } from "./artworkCreateUtils";

export type CreateArtworkStep =
  | "FORM_IMAGE"
  | "FORM_MAIN"
  | "FORM_LICENSE"
  | "FORM_TAG"
  | "UPLOAD"
  | "UPLOAD_LOADING"
  | "UPLOAD_SUCCESS"
  | "UPLOAD_FAIL";

/** marketplace_demo_works 입력 폼에 대응하는 필드 */
export interface ArtworkFormData {
  title?: string;
  description?: string;
  artistId?: string;
  askingPrice?: number;
  allowOffers?: boolean;
  licensePolicy?: ArtworkLicensePolicy;
}

type CreateArtworkState = {
  currentStep: CreateArtworkStep;
  artworkId: string;
  previewImage: string;
  artworkFiles: File[];
  imageWidth: number;
  imageHeight: number;
  formData: ArtworkFormData;
  tags: string[];
  uploadError: string;
  setCurrentStep: (nextStep: CreateArtworkStep) => void;
  setArtworkId: (id: string) => void;
  setPreviewImage: (nextPreviewImage: string) => void;
  setArtworkFiles: (nextArtworkFiles: File[]) => void;
  setImageDimensions: (width: number, height: number) => void;
  setFormData: (nextFormData: ArtworkFormData) => void;
  cleanFormData: () => void;
  setLicensePolicy: (nextPolicy: ArtworkLicensePolicy) => void;
  setUploadError: (message: string) => void;
  addTag: (name: string) => void;
  deleteTag: (name: string) => void;
  cleanTags: () => void;
  cleanData: () => void;
};

export const useCreateArtworkStore = create<CreateArtworkState>((set) => ({
  currentStep: "FORM_IMAGE",
  artworkId: "",
  previewImage: "",
  artworkFiles: [],
  imageWidth: 1000,
  imageHeight: 1000,
  formData: {},
  tags: [],
  uploadError: "",

  setCurrentStep: (nextStep) => set({ currentStep: nextStep }),
  setArtworkId: (id) => set({ artworkId: id }),
  setPreviewImage: (nextPreviewImage) =>
    set({ previewImage: nextPreviewImage }),
  setArtworkFiles: (nextArtworkFiles) =>
    set({ artworkFiles: nextArtworkFiles }),
  setImageDimensions: (width, height) =>
    set({ imageWidth: width, imageHeight: height }),
  setFormData: (nextFormData) =>
    set((state) => ({ formData: { ...state.formData, ...nextFormData } })),
  cleanFormData: () => set({ formData: {} }),
  setLicensePolicy: (nextPolicy) =>
    set((state) => ({
      formData: { ...state.formData, licensePolicy: nextPolicy },
    })),
  setUploadError: (message) => set({ uploadError: message }),

  addTag: (name) =>
    set((state) => {
      const normalized = name.trim().replace(/^#/, "");
      if (!normalized) {
        return state;
      }

      return { tags: [...new Set([...state.tags, normalized])] };
    }),
  deleteTag: (name) =>
    set((state) => ({ tags: state.tags.filter((tag) => tag !== name) })),
  cleanTags: () => set({ tags: [] }),

  cleanData: () =>
    set({
      currentStep: "FORM_IMAGE",
      artworkId: "",
      previewImage: "",
      artworkFiles: [],
      imageWidth: 1000,
      imageHeight: 1000,
      formData: {},
      tags: [],
      uploadError: "",
    }),
}));

"use client";

import { create } from "zustand";

export type ArtworkLicensePolicy =
  | "exclusive"
  | "commercial"
  | "commercial-no-ai"
  | "personal"
  | "portfolio"
  | "open";

export type ArtworkVisibility = "public" | "private";

export type CreateArtworkStep =
  | "FORM_IMAGE"
  | "FORM_MAIN"
  | "FORM_LICENSE"
  | "FORM_TAG"
  | "UPLOAD"
  | "UPLOAD_LOADING"
  | "UPLOAD_SUCCESS"
  | "UPLOAD_FAIL";

export interface ArtworkFormData {
  title?: string;
  description?: string;
  artistName?: string;
  collectionId?: string;
  price?: number;
  category?: string;
  visibility?: ArtworkVisibility;
  allowOffers?: boolean;
  licensePolicy?: ArtworkLicensePolicy;
}

export interface CreatedArtwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  tags: string[];
  licensePolicy: ArtworkLicensePolicy;
  createdAt: string;
}

type CreateArtworkState = {
  currentStep: CreateArtworkStep;
  artworkId: string;
  previewImage: string;
  artworkFiles: File[];
  formData: ArtworkFormData;
  tags: string[];
  createdWorks: CreatedArtwork[];
  setCurrentStep: (nextStep: CreateArtworkStep) => void;
  setArtworkId: (id: string) => void;
  setPreviewImage: (nextPreviewImage: string) => void;
  setArtworkFiles: (nextArtworkFiles: File[]) => void;
  setFormData: (nextFormData: ArtworkFormData) => void;
  cleanFormData: () => void;
  setPrice: (nextPrice: number) => void;
  setLicensePolicy: (nextPolicy: ArtworkLicensePolicy) => void;
  addTag: (name: string) => void;
  deleteTag: (name: string) => void;
  cleanTags: () => void;
  createArtwork: () => CreatedArtwork;
  cleanData: () => void;
};

export const useCreateArtworkStore = create<CreateArtworkState>((set, get) => ({
  currentStep: "FORM_IMAGE",
  artworkId: "",
  previewImage: "",
  artworkFiles: [],
  formData: {},
  tags: [],
  createdWorks: [],

  setCurrentStep: (nextStep) => set({ currentStep: nextStep }),
  setArtworkId: (id) => set({ artworkId: id }),
  setPreviewImage: (nextPreviewImage) =>
    set({ previewImage: nextPreviewImage }),
  setArtworkFiles: (nextArtworkFiles) =>
    set({ artworkFiles: nextArtworkFiles }),
  setFormData: (nextFormData) =>
    set((state) => ({ formData: { ...state.formData, ...nextFormData } })),
  cleanFormData: () => set({ formData: {} }),
  setPrice: (nextPrice) =>
    set((state) => ({ formData: { ...state.formData, price: nextPrice } })),
  setLicensePolicy: (nextPolicy) =>
    set((state) => ({
      formData: { ...state.formData, licensePolicy: nextPolicy },
    })),

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

  createArtwork: () => {
    const { formData, previewImage, tags } = get();
    const createdArtwork: CreatedArtwork = {
      id: `artwork-${Date.now()}`,
      title: formData.title || "Untitled Artwork",
      artist: formData.artistName || "Archive Artist",
      image: previewImage,
      price: Number(formData.price || 0),
      tags,
      licensePolicy: formData.licensePolicy || "personal",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      artworkId: createdArtwork.id,
      createdWorks: [createdArtwork, ...state.createdWorks],
    }));

    return createdArtwork;
  },

  cleanData: () =>
    set({
      currentStep: "FORM_IMAGE",
      artworkId: "",
      previewImage: "",
      artworkFiles: [],
      formData: {},
      tags: [],
    }),
}));

"use client";

import { create } from "zustand";
import {
  licensePolicyToUsageRights,
  resolveListingStatus,
  type ArtworkLicensePolicy,
} from "./artworkCreateUtils";
import { marketplaceUsers } from "./demoUsers";
import type {
  ListingStatus,
  UsageRight,
  WorkOwnershipStatus,
} from "./marketplaceTypes";

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
  askingPrice?: number;
  allowOffers?: boolean;
  licensePolicy?: ArtworkLicensePolicy;
}

/** marketplace_demo_works row와 동일한 구조 */
export interface CreatedWork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  creatorId: string;
  ownerId: string;
  ownershipStatus: WorkOwnershipStatus;
  listingStatus: ListingStatus;
  askingPrice: number | null;
  lastSalePrice: number | null;
  offerCount: number;
  tags: string[];
  usageRights: UsageRight[];
  createdAt: string;
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
  createdWorks: CreatedWork[];
  setCurrentStep: (nextStep: CreateArtworkStep) => void;
  setArtworkId: (id: string) => void;
  setPreviewImage: (nextPreviewImage: string) => void;
  setArtworkFiles: (nextArtworkFiles: File[]) => void;
  setImageDimensions: (width: number, height: number) => void;
  setFormData: (nextFormData: ArtworkFormData) => void;
  cleanFormData: () => void;
  setLicensePolicy: (nextPolicy: ArtworkLicensePolicy) => void;
  addTag: (name: string) => void;
  deleteTag: (name: string) => void;
  cleanTags: () => void;
  createArtwork: () => CreatedWork;
  cleanData: () => void;
};

export const useCreateArtworkStore = create<CreateArtworkState>((set, get) => ({
  currentStep: "FORM_IMAGE",
  artworkId: "",
  previewImage: "",
  artworkFiles: [],
  imageWidth: 1000,
  imageHeight: 1000,
  formData: {},
  tags: [],
  createdWorks: [],

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
    const { formData, previewImage, tags, imageWidth, imageHeight } = get();
    const askingPrice =
      formData.askingPrice && formData.askingPrice > 0
        ? formData.askingPrice
        : null;
    const allowOffers = formData.allowOffers ?? true;
    const licensePolicy = formData.licensePolicy || "personal";
    const creatorId = marketplaceUsers.guest.id;

    const createdWork: CreatedWork = {
      id: `work-${Date.now()}`,
      title: formData.title || "Untitled Artwork",
      description: formData.description || "",
      imageUrl: previewImage,
      width: imageWidth,
      height: imageHeight,
      creatorId,
      ownerId: creatorId,
      ownershipStatus: "OWNED_BY_CREATOR",
      listingStatus: resolveListingStatus(askingPrice, allowOffers),
      askingPrice,
      lastSalePrice: null,
      offerCount: 0,
      tags,
      usageRights: licensePolicyToUsageRights(licensePolicy),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      artworkId: createdWork.id,
      createdWorks: [createdWork, ...state.createdWorks],
    }));

    return createdWork;
  },

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
    }),
}));

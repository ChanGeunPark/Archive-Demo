import type { ArtworkFormData } from "./createArtworkStore";
import {
  licensePolicyToUsageRights,
  type ArtworkLicensePolicy,
} from "./artworkCreateUtils";
import type { UsageRight } from "./marketplaceTypes";

export type UploadMarketplaceArtworkImageResult = {
  id: string;
  url: string;
};

export type CreateWorkMutationVariables = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  width?: number;
  height?: number;
  tags?: string[];
  creatorId: string;
  ownerId?: string;
  askingPrice?: number | null;
  allowOffers?: boolean;
  usageRights?: UsageRight[];
  imageId?: string;
};

async function readError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };

  return data.error || data.message || fallback;
}

export async function uploadMarketplaceArtworkImage(input: {
  file: File;
  workId?: string;
}): Promise<UploadMarketplaceArtworkImageResult> {
  const body = new FormData();
  body.append("file", input.file, input.file.name);

  if (input.workId) {
    body.append("workId", input.workId);
  }

  const response = await fetch("/api/marketplace/works/upload", {
    method: "POST",
    body,
  });

  const data = (await response.json().catch(() => ({}))) as {
    id?: string;
    url?: string;
    error?: string;
  };

  if (!response.ok || !data.id || !data.url) {
    throw new Error(
      await readError(response, "작품 이미지 업로드에 실패했습니다."),
    );
  }

  return {
    id: data.id,
    url: data.url,
  };
}

export async function uploadMarketplaceAvatarImage(input: {
  file: File;
  userId: string;
}): Promise<UploadMarketplaceArtworkImageResult> {
  const body = new FormData();
  body.append("file", input.file, input.file.name);
  body.append("userId", input.userId);

  const response = await fetch("/api/marketplace/users/avatar/upload", {
    method: "POST",
    body,
  });

  const data = (await response.json().catch(() => ({}))) as {
    id?: string;
    url?: string;
    error?: string;
  };

  if (!response.ok || !data.id || !data.url) {
    throw new Error(
      await readError(response, "프로필 이미지 업로드에 실패했습니다."),
    );
  }

  return {
    id: data.id,
    url: data.url,
  };
}

export function buildCreateWorkVariables(input: {
  id: string;
  formData: ArtworkFormData;
  tags: string[];
  imageWidth: number;
  imageHeight: number;
  imageUrl: string;
  creatorId?: string;
  imageId?: string;
}): CreateWorkMutationVariables {
  const askingPrice =
    input.formData.askingPrice && input.formData.askingPrice > 0
      ? input.formData.askingPrice
      : null;
  const licensePolicy: ArtworkLicensePolicy =
    input.formData.licensePolicy || "personal";
  const creatorId = input.formData.artistId?.trim() || input.creatorId;
  if (!creatorId) {
    throw new Error("creatorId is required.");
  }

  return {
    id: input.id,
    title: input.formData.title || "Untitled Artwork",
    description: input.formData.description || "",
    imageUrl: input.imageUrl,
    width: input.imageWidth,
    height: input.imageHeight,
    tags: input.tags,
    creatorId,
    ownerId: creatorId,
    askingPrice,
    allowOffers: input.formData.allowOffers ?? true,
    usageRights: licensePolicyToUsageRights(licensePolicy),
    imageId: input.imageId,
  };
}

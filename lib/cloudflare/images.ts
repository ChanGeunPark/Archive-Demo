type CloudflareImageResult = {
  id: string;
  variants?: string[];
  filename?: string;
};

type CloudflareImageResponse = {
  success: boolean;
  errors?: { message?: string }[];
  result?: CloudflareImageResult;
};

export async function uploadImageToCloudflare(input: {
  file: File;
  id?: string;
  metadata?: Record<string, string>;
}) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

  if (!accountId || !token) {
    throw new Error("Missing Cloudflare Images environment variables.");
  }

  if (input.file.size > 10 * 1024 * 1024) {
    throw new Error("Cloudflare Images upload limit is 10MB.");
  }

  const formData = new FormData();
  formData.append("file", input.file, input.file.name);
  formData.append("requireSignedURLs", "false");

  if (input.id) {
    formData.append("id", input.id);
  }

  if (input.metadata) {
    formData.append("metadata", JSON.stringify(input.metadata));
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const data = (await response.json()) as CloudflareImageResponse;

  if (!response.ok || !data.success || !data.result) {
    const message = data.errors?.map((error) => error.message).filter(Boolean).join(", ");
    throw new Error(message || "Failed to upload image to Cloudflare Images.");
  }

  return {
    id: data.result.id,
    url: data.result.variants?.[0] ?? null,
    variants: data.result.variants ?? [],
  };
}

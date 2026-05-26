import { deleteImageFromCloudflare } from "@/lib/cloudflare/images";

export async function DELETE(request: Request) {
  const { imageId } = (await request.json()) as { imageId?: string };

  if (!imageId) {
    return Response.json({ error: "imageId is required." }, { status: 400 });
  }

  try {
    await deleteImageFromCloudflare(imageId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete image.";

    return Response.json({ error: message }, { status: 502 });
  }

  return Response.json({ imageId }, { status: 200 });
}

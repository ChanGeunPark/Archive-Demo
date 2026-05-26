import { uploadImageToCloudflare } from "@/lib/cloudflare/images";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const workId = String(formData.get("workId") ?? "").trim();

  if (!(file instanceof File)) {
    return Response.json({ error: "file is required." }, { status: 400 });
  }

  try {
    const upload = await uploadImageToCloudflare({
      file,
      id: workId ? `marketplace-demo/${workId}/cover` : undefined,
      metadata: {
        demo: "marketplace",
        kind: "artwork",
        ...(workId ? { workId } : {}),
      },
    });

    if (!upload.url) {
      return Response.json(
        { error: "Cloudflare upload succeeded but no public URL was returned." },
        { status: 500 },
      );
    }

    return Response.json(
      {
        id: upload.id,
        url: upload.url,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image.",
      },
      { status: 500 },
    );
  }
}

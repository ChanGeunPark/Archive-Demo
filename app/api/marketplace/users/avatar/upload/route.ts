import { uploadImageToCloudflare } from "@/lib/cloudflare/images";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const userId = String(formData.get("userId") ?? "").trim();

  if (!(file instanceof File)) {
    return Response.json({ error: "file is required." }, { status: 400 });
  }

  if (!userId) {
    return Response.json({ error: "userId is required." }, { status: 400 });
  }

  try {
    const upload = await uploadImageToCloudflare({
      file,
      id: `marketplace-demo/users/${userId}/avatar`,
      metadata: {
        demo: "marketplace",
        kind: "avatar",
        userId,
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
          error instanceof Error ? error.message : "Failed to upload avatar.",
      },
      { status: 500 },
    );
  }
}

import type { MetadataRoute } from "next";
import { marketplaceSitemapPaths } from "@/lib/image-marketplace-flow/routes";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  "/",
  "/demos/character-chat-replay",
  "/demos/character-chat-replay/create",
  "/demos/character-chat-replay/technical-notes",
  ...marketplaceSitemapPaths,
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}

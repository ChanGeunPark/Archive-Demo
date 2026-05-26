import type { Metadata } from "next";
import ArtworkCreateClient from "./_components/ArtworkCreateClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "작품 등록",
  description:
    "CHIZU 이미지 마켓플레이스 데모에서 작품 이미지, 라이선스, 태그를 등록하는 플로우를 확인할 수 있습니다.",
  path: "/demos/image-marketplace-flow/create/artwork",
});

export default function CreateArtworkPage() {
  return <ArtworkCreateClient />;
}

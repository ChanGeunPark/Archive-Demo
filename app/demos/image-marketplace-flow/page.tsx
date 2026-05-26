import type { Metadata } from "next";
import DiscoverMain from "./_components/DiscoverMain";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "CHIZU Image Marketplace Demo",
  description:
    "Discover 탐색, 작품 상세, 구매·제안·등록 플로우를 Supabase Realtime과 GraphQL refetch로 재현한 CHIZU 마켓플레이스 데모입니다.",
  path: "/demos/image-marketplace-flow",
  keywords: [
    "이미지 마켓플레이스",
    "Supabase Realtime",
    "GraphQL",
    "CHIZU",
    "Masonry grid",
  ],
});

export default function ImageMarketplaceFlowDemo() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <DiscoverMain />
    </main>
  );
}

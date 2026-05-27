import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkMain from "../../_components/WorkMain";
import { getCachedWorkById } from "@/lib/image-marketplace-flow/repository/cachedWorks";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";
import { buildPageMetadata } from "@/lib/seo";

type WorkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { id } = await params;
  const work = await getCachedWorkById(id);

  if (!work) {
    return buildPageMetadata({
      title: "작품을 찾을 수 없음",
      description: "요청하신 작품이 존재하지 않습니다.",
      path: marketplaceRoutes.work(id),
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: work.title,
    description: `${work.owner.name}(@${work.owner.handle})의 작품 · CHIZU 마켓플레이스 데모`,
    path: marketplaceRoutes.work(id),
    openGraph: {
      images: [
        {
          url: work.imageUrl,
          alt: work.title,
        },
      ],
    },
  });
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params;
  const work = await getCachedWorkById(id);

  if (!work) {
    notFound();
  }

  return <WorkMain id={id} initialWork={work} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkMain from "../../_components/WorkMain";
import { getWorkById } from "@/lib/image-marketplace-flow/repository";
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
  const work = await getWorkById(id);

  if (!work) {
    return buildPageMetadata({
      title: "작품을 찾을 수 없음",
      description: "요청하신 작품이 존재하지 않습니다.",
      path: `/demos/image-marketplace-flow/work/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: work.title,
    description: `${work.owner.name}(@${work.owner.handle})의 작품 · CHIZU 마켓플레이스 데모`,
    path: `/demos/image-marketplace-flow/work/${id}`,
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

  // GraphQL `work(id)` resolver와 동일한 서버 데이터 소스
  const work = await getWorkById(id);
  if (!work) {
    notFound();
  }

  return <WorkMain id={id} />;
}

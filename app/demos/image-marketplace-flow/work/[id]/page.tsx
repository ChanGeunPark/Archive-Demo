import { notFound } from "next/navigation";
import WorkMain from "../../_components/WorkMain";
import { getWorkById } from "@/lib/image-marketplace-flow/repository";

type WorkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params;

  // GraphQL `work(id)` resolver와 동일한 서버 데이터 소스
  const work = await getWorkById(id);
  if (!work) {
    notFound();
  }

  return <WorkMain id={id} />;
}

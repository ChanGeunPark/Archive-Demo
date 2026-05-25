import { notFound } from "next/navigation";

import { works } from "../../_components/chizuData";
import WorkMain from "../../_components/WorkMain";

type WorkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { id } = await params;
  const work = works.find((item) => item.id === id);

  return {
    title: work ? `${work.title} | CHIZU` : "Work | CHIZU",
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params;
  const work = works.find((item) => item.id === id);

  if (!work) {
    notFound();
  }

  return <WorkMain work={work} />;
}

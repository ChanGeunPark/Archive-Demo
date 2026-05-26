import { notFound } from "next/navigation";

import { works } from "../../_components/chizuData";
import WorkMain from "../../_components/WorkMain";
import { getWorkById } from "@/lib/image-marketplace-flow/repository";
import { mapWorkToWorkItem } from "@/lib/image-marketplace-flow/workMappers";

type WorkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

async function resolveWorkItem(id: string) {
  const staticWork = works.find((item) => item.id === id);
  if (staticWork) {
    return staticWork;
  }

  const work = await getWorkById(id);
  if (!work) {
    return null;
  }

  return mapWorkToWorkItem(work);
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { id } = await params;
  const work = await resolveWorkItem(id);

  return {
    title: work ? `${work.title} | CHIZU` : "Work | CHIZU",
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params;
  const work = await resolveWorkItem(id);

  if (!work) {
    notFound();
  }

  return <WorkMain work={work} />;
}

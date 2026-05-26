import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkGrid from "../../_components/discover/WorkGrid";
import { marketplaceUsers } from "@/lib/image-marketplace-flow/demoUsers";
import { listWorks } from "@/lib/image-marketplace-flow/repository";
import type { Work } from "@/lib/image-marketplace-flow/marketplaceTypes";
import type { WorksQueryWork } from "@/lib/image-marketplace-flow/graphql/types";

type UserProfilePageProps = {
  params: Promise<{ handle: string }>;
};

function toWorksQueryWork(work: Work): WorksQueryWork {
  return {
    id: work.id,
    title: work.title,
    imageUrl: work.imageUrl,
    width: work.width,
    height: work.height,
    askingPrice: work.askingPrice,
    listingStatus: work.listingStatus,
    owner: {
      id: work.owner.id,
      name: work.owner.name,
      handle: work.owner.handle,
      avatar: work.owner.avatar,
    },
  };
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { handle } = await params;
  const normalizedHandle = handle.trim().toLowerCase();
  const works = (await listWorks()).edges.map((edge) => edge.node);
  const userWorks = works.filter(
    (work) =>
      work.owner.handle.toLowerCase() === normalizedHandle ||
      work.creator.handle.toLowerCase() === normalizedHandle,
  );

  const user =
    Object.values(marketplaceUsers).find(
      (candidate) => candidate.handle.toLowerCase() === normalizedHandle,
    ) ??
    userWorks.find(
      (work) => work.owner.handle.toLowerCase() === normalizedHandle,
    )?.owner ??
    userWorks.find(
      (work) => work.creator.handle.toLowerCase() === normalizedHandle,
    )?.creator;

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F4F5F6] px-4 py-8 text-[#17191C] lg:px-6 lg:py-12">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/demos/image-marketplace-flow"
          className="text-sm font-semibold text-[#3F444B] transition hover:text-[#17191C]"
        >
          Discover로 돌아가기
        </Link>

        <section className="mt-6 rounded-[1.25rem] border border-[#ECEEF0] bg-white p-6 shadow-[0_18px_50px_rgba(23,25,28,0.08)] lg:p-8">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatar}
              alt={`${user.name} profile`}
              width={72}
              height={72}
              className="rounded-full w-16 h-16 object-cover"
            />
            <div>
              <h1 className="text-2xl font-black">{user.name}</h1>
              <p className="mt-1 text-sm font-semibold text-[#777D84]">
                @{user.handle}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black">작품</h2>
          <div className="mt-5">
            <WorkGrid works={userWorks.map(toWorksQueryWork)} />
          </div>
        </section>
      </div>
    </main>
  );
}

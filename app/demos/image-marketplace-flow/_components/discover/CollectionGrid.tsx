import Image from "next/image";
import { collections } from "./discoverData";

export default function CollectionGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {collections.map((collection) => (
        <article
          key={collection.name}
          className="overflow-hidden rounded-lg border border-[#E6E1D8] bg-white"
        >
          <div className="relative aspect-[4/3] bg-[#EDEEEF]">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="font-black">{collection.name}</h2>
            <p className="mt-1 text-sm text-[#777D84]">{collection.owner}</p>
            <p className="mt-3 text-sm font-bold">{collection.works} works</p>
          </div>
        </article>
      ))}
    </div>
  );
}

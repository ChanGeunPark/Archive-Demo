import Image from "next/image";
import { artists } from "./discoverData";

export default function ArtistGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {artists.map((artist) => (
        <article
          key={artist.handle}
          className="rounded-lg border border-[#E6E1D8] bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <Image
              src={artist.avatar}
              alt={artist.name}
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <h2 className="font-black">{artist.name}</h2>
              <p className="text-sm text-[#777D84]">{artist.handle}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {artist.works.map((work) => (
              <div
                key={work}
                className="relative aspect-square overflow-hidden rounded-md bg-[#EDEEEF]"
              >
                <Image
                  src={work}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 14vw, 40vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

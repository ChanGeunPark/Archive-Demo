import { tagGroups } from "./discoverData";

export default function TagGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {tagGroups.map((tag) => (
        <button
          key={tag.name}
          type="button"
          className="rounded-lg border border-[#E6E1D8] bg-white p-4 text-left transition hover:border-[#17191C]"
        >
          <p className="font-black">#{tag.name}</p>
          <p className="mt-2 text-sm text-[#777D84]">{tag.count} works</p>
        </button>
      ))}
    </div>
  );
}

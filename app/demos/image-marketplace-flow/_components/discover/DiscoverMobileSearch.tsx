type DiscoverMobileSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function DiscoverMobileSearch({
  query,
  onQueryChange,
}: DiscoverMobileSearchProps) {
  return (
    <div className="mb-4 flex h-11 items-center rounded-md border border-[#D8DBDE] bg-white px-3 md:hidden">
      <span className="mr-2 text-[#777D84]">⌕</span>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search"
        className="h-full w-full bg-transparent text-sm outline-none"
      />
    </div>
  );
}

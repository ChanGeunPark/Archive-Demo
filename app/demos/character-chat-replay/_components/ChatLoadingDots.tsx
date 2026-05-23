export function ChatLoadingDots() {
  return (
    <div className="py-2">
      <div className="ml-10 inline-flex rounded-lg rounded-tl-none bg-white px-4 py-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#60656C]" />
        <span className="mx-1 h-2 w-2 animate-pulse rounded-full bg-[#AEB2B8]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#D8DBDE]" />
      </div>
    </div>
  );
}

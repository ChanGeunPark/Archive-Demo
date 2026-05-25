import { cls } from "@/lib/client/utils";
import { DISCOVER_TABS } from "./discoverData";
import type { DiscoverTab } from "./discoverTypes";

function DiscoverNavMenu({
  active,
  id,
  title,
  onClick,
}: {
  active: boolean;
  id: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={cls(
        "relative flex h-full cursor-pointer items-center justify-center break-keep px-3 text-center text-[13px] font-semibold whitespace-nowrap transition-all hover:text-gray-700",
        active ? "text-gray-700" : "text-gray-300 hover:text-gray-500",
      )}
    >
      {active && (
        <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-[#F3CC00]" />
      )}
      {title}
    </button>
  );
}

function FilterIcon({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9.5 16a.68.68 0 0 1-.5-.146.68.68 0 0 1-.146-.5v-4.729L4.104 4.812a.49.49 0 0 1-.052-.531A.47.47 0 0 1 4.5 4h11a.47.47 0 0 1 .448.281.49.49 0 0 1-.052.531L11 10.771V15.5a.68.68 0 0 1-.146.354.68.68 0 0 1-.354.146h-1ZM10 9.625 13.375 5.5H6.604L10 9.625Z"
        fill={active ? "#F3CC00" : "#6B7280"}
      />
    </svg>
  );
}

type DiscoverTabNavProps = {
  activeTab: DiscoverTab;
  onTabChange: (tab: DiscoverTab) => void;
  buyNowOnly: boolean;
  onBuyNowOnlyChange: (value: boolean) => void;
};

export default function DiscoverTabNav({
  activeTab,
  onTabChange,
  buyNowOnly,
  onBuyNowOnlyChange,
}: DiscoverTabNavProps) {
  return (
    <section className="mx-auto mb-5 w-full">
      <nav className="flex w-full justify-between">
        <div className="flex w-full flex-col content-center items-start justify-between xl:flex-row">
          <section className="flex w-full items-center justify-between border-b border-zinc-100">
            <nav className="flex h-10 w-full items-center overflow-hidden overflow-x-auto">
              {DISCOVER_TABS.map((tab) => (
                <div
                  key={tab.id}
                  className="relative flex h-full items-center justify-center text-center"
                >
                  <DiscoverNavMenu
                    id={tab.id}
                    title={tab.label}
                    active={activeTab === tab.id}
                    onClick={() => onTabChange(tab.id)}
                  />
                </div>
              ))}
            </nav>

            {activeTab === "work" ? (
              <button
                type="button"
                onClick={() => onBuyNowOnlyChange(!buyNowOnly)}
                className={cls(
                  "flex h-8 w-fit max-w-[150px] shrink-0 items-center justify-center gap-1 rounded-md border px-4 text-[13px] font-semibold transition-all max-lg:w-[30px] max-lg:p-0",
                  buyNowOnly
                    ? "border-[#F3CC00]"
                    : "border-[#D5DBE4] hover:border-gray-700",
                )}
              >
                <FilterIcon active={buyNowOnly} className="shrink-0" />
                <span
                  className={cls(
                    "shrink-0 whitespace-nowrap max-lg:hidden",
                    buyNowOnly ? "text-[#F3CC00]" : "text-gray-500",
                  )}
                >
                  Filter
                </span>
              </button>
            ) : null}
          </section>
        </div>
      </nav>
    </section>
  );
}

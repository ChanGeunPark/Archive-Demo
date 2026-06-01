import type { OrderedMasonryBreakpoint } from "../layout/OrderedMasonry.type";

export const WORK_GRID_BREAKPOINT_COLS: OrderedMasonryBreakpoint = {
  default: 5,
  1536: 4,
  1280: 3,
  1024: 2,
  640: 1,
};

export function getWorkGridColumnCount(
  breakpoints: OrderedMasonryBreakpoint = WORK_GRID_BREAKPOINT_COLS,
  windowWidth: number = typeof window !== "undefined"
    ? window.innerWidth
    : Number.POSITIVE_INFINITY,
) {
  const INFINITY = Number.POSITIVE_INFINITY;
  let matchedBreakpoint = INFINITY;
  let columns = breakpoints.default;

  for (const breakpoint in breakpoints) {
    if (breakpoint === "default") continue;

    const optBreakpoint = parseInt(breakpoint, 10);
    const isCurrentBreakpoint =
      optBreakpoint > 0 && windowWidth <= optBreakpoint;

    if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
      matchedBreakpoint = optBreakpoint;
      columns = breakpoints[breakpoint];
    }
  }

  return Math.max(1, columns);
}

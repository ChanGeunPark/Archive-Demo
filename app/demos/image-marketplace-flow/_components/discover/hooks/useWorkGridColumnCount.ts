"use client";

import { useLayoutEffect, useState } from "react";
import { getWorkGridColumnCount } from "../workGridBreakpoints";

/**
 * Returns column count after measuring viewport (null until first layout).
 * Avoids flashing WORK_GRID_BREAKPOINT_COLS.default (5) before resize logic runs.
 */
export function useWorkGridColumnCount() {
  const [columnCount, setColumnCount] = useState<number | null>(null);

  useLayoutEffect(() => {
    const update = () => setColumnCount(getWorkGridColumnCount());

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columnCount;
}

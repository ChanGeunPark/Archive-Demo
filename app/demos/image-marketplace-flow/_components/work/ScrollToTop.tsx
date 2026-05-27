"use client";

import { useLayoutEffect } from "react";

export default function ScrollToTop({ dep }: { dep?: string }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [dep]);

  return null;
}

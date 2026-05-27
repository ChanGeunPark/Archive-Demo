"use client";

import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const previous = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
      paddingRight: style.paddingRight,
    };

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";

    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      style.overflow = previous.overflow;
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

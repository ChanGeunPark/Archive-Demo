"use client";

import { useEffect, useRef, useState } from "react";

type ScrollPositionProps = {
  onScroll?: (scrollPosition: number) => void;
  onScrollDown?: () => void;
  onTargetElementEnter?: () => void;
  targetElementId?: string;
};

const SCROLL_DOWN_THRESHOLD = 8;
const THROTTLE_MS = 200;

export default function ScrollPosition({
  onScroll,
  onScrollDown,
  onTargetElementEnter,
  targetElementId,
}: ScrollPositionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const oldScrollPositionRef = useRef(0);
  const isInsideTargetRef = useRef(false);
  const callbacksRef = useRef({
    onScroll,
    onScrollDown,
    onTargetElementEnter,
  });

  useEffect(() => {
    callbacksRef.current = {
      onScroll,
      onScrollDown,
      onTargetElementEnter,
    };
  }, [onScroll, onScrollDown, onTargetElementEnter]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastRunAt = 0;

    const handleScroll = () => {
      const now = Date.now();
      const elapsed = now - lastRunAt;

      if (elapsed < THROTTLE_MS) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, THROTTLE_MS - elapsed);
        return;
      }

      lastRunAt = now;

      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const targetElement = targetElementId
        ? document.getElementById(targetElementId)
        : null;

      if (targetElement) {
        const targetTop = targetElement.offsetTop;
        const targetHeight = targetElement.offsetHeight;
        const isInsideTarget =
          currentScrollPosition + windowHeight >= targetTop &&
          currentScrollPosition <= targetTop + targetHeight;

        if (isInsideTarget && !isInsideTargetRef.current) {
          isInsideTargetRef.current = true;
          callbacksRef.current.onTargetElementEnter?.();
        } else if (!isInsideTarget && isInsideTargetRef.current) {
          isInsideTargetRef.current = false;
        }
      }

      callbacksRef.current.onScroll?.(currentScrollPosition);
      setScrollPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [targetElementId]);

  useEffect(() => {
    const oldScrollPosition = oldScrollPositionRef.current;

    if (oldScrollPosition < scrollPosition - SCROLL_DOWN_THRESHOLD) {
      callbacksRef.current.onScrollDown?.();
    }

    oldScrollPositionRef.current = scrollPosition;
  }, [scrollPosition]);

  return null;
}

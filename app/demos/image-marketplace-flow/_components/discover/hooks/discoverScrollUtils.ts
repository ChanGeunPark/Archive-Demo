import { MARKETPLACE_BASE_PATH } from "@/lib/image-marketplace-flow/routes";

export const DISCOVER_SCROLL_KEY = "discover-scroll";
export const DISCOVER_SCROLL_SAVE_DEBOUNCE_MS = 150;
export const DISCOVER_SCROLL_RESTORE_MAX_FRAMES = 30;
export const DISCOVER_SENTINEL_ROOT_MARGIN = "200px";

export function isDiscoverPath(pathname: string) {
  return (
    pathname === MARKETPLACE_BASE_PATH ||
    pathname === `${MARKETPLACE_BASE_PATH}/`
  );
}

export function getMaxScrollY() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
}

export function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

import { createDemoUserFromId } from "./demoUsers";
export const MARKETPLACE_LOGIN_STORAGE_KEY = "marketplace-demo-user-id";

export function normalizeMarketplaceUserId(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 80);
}

export function readStoredMarketplaceUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(MARKETPLACE_LOGIN_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  const normalized = normalizeMarketplaceUserId(stored);
  return normalized || null;
}

export function writeStoredMarketplaceUserId(id: string) {
  localStorage.setItem(MARKETPLACE_LOGIN_STORAGE_KEY, id);
}

export function clearStoredMarketplaceUserId() {
  localStorage.removeItem(MARKETPLACE_LOGIN_STORAGE_KEY);
}

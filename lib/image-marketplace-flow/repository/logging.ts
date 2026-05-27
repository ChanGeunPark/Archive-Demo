/** Supabase 오류 로그 */
export function logSupabaseFallback(scope: string, error: unknown) {
  const details =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);

  console.warn(
    `[marketplace-demo] ${scope}. Falling back to local demo data.`,
    details,
  );
}

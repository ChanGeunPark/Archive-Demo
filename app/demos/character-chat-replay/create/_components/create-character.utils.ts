export function normalizeCreatorId(inputCreatorId: string) {
  return inputCreatorId.trim().replace(/\s+/g, "-").slice(0, 80);
}

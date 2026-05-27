export const MARKETPLACE_BASE_PATH = "/demos/image-marketplace-flow";

export const marketplaceRoutes = {
  discover: MARKETPLACE_BASE_PATH,
  technicalNotes: `${MARKETPLACE_BASE_PATH}/technical-notes`,
  createArtwork: `${MARKETPLACE_BASE_PATH}/create/artwork`,
  work: (id: string) => `${MARKETPLACE_BASE_PATH}/work/${id}`,
  user: (handle: string) => `${MARKETPLACE_BASE_PATH}/user/${handle}`,
  userProfile: (handle: string) => `/@${handle}`,
} as const;

export const marketplaceSitemapPaths = [
  marketplaceRoutes.discover,
  marketplaceRoutes.createArtwork,
  marketplaceRoutes.technicalNotes,
] as const;

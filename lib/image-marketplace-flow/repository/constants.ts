export const DEFAULT_AVATAR =
  "/images/marketplace/profile/profile_default_180x180_00.jpg";

export const WORK_BASE_SELECT = `
  *,
  creator:marketplace_demo_users!creator_id(*),
  owner:marketplace_demo_users!owner_id(*)
`;

export const WORK_DETAIL_SELECT = `
  ${WORK_BASE_SELECT},
  marketplace_demo_offers(
    *,
    bidder:marketplace_demo_users!bidder_id(*)
  )
`;

export const RANDOM_WORKS_POOL_SIZE = 80;

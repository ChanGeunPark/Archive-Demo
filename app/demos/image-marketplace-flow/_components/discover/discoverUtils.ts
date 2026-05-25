const AUCTION_DURATION_MS = 12 * 60 * 60 * 1000;

export function getAuctionEndTime() {
  return new Date(Date.now() + AUCTION_DURATION_MS).toISOString();
}

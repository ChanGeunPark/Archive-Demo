export const DEMO_AUCTION_END_TIME = "2026-12-31T15:00:00.000Z";

export function formatEth(price: number) {
  return `${(price / 1_000_000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} ETH`;
}

export function creatorHandle(artist: string) {
  return artist.toLowerCase().replaceAll(" ", "");
}

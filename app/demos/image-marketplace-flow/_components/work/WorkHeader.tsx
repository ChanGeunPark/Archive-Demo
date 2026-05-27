import MarketplaceLogin from "../auth/MarketplaceLogin";
import MarketplaceHeaderShell from "../layout/MarketplaceHeaderShell";
import { marketplaceRoutes } from "@/lib/image-marketplace-flow/routes";

export default function WorkHeader() {
  return (
    <MarketplaceHeaderShell
      backHref={marketplaceRoutes.discover}
      backLabel="Discover"
      trailing={<MarketplaceLogin />}
    />
  );
}

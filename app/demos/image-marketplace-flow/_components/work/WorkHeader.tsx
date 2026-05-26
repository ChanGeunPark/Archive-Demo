import MarketplaceLogin from "../auth/MarketplaceLogin";
import MarketplaceHeaderShell from "../layout/MarketplaceHeaderShell";

export default function WorkHeader() {
  return (
    <MarketplaceHeaderShell
      backHref="/demos/image-marketplace-flow"
      backLabel="Discover"
      trailing={<MarketplaceLogin />}
    />
  );
}

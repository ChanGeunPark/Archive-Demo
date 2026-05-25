"use client";

import { ApolloProvider as ApolloProviderClient } from "@apollo/client/react";
import { marketplaceClient } from "@/lib/image-marketplace-flow/apolloClient";

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProviderClient client={marketplaceClient}>{children}</ApolloProviderClient>;
}
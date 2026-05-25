import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
export const marketplaceClient = new ApolloClient({
  link: new HttpLink({ uri: "/api/marketplace/graphql" }),
  cache: new InMemoryCache(),
});

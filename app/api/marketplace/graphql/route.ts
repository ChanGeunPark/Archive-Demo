import { createSchema, createYoga } from "graphql-yoga";

import { resolvers } from "@/lib/image-marketplace-flow/graphql/resolvers";
import { typeDefs } from "@/lib/image-marketplace-flow/graphql/typeDefs";

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/marketplace/graphql",
  fetchAPI: { Response },
});

export { yoga as GET, yoga as POST };

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const marketplaceClient = new ApolloClient({
  link: new HttpLink({ uri: "/api/marketplace/graphql" }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // works(first, after, query, buyNowOnly, minPrice, maxPrice) cursor 페이지네이션 캐시 정책
          works: {
            keyArgs: ["query", "buyNowOnly", "minPrice", "maxPrice"],
            merge(existing, incoming, { args }) {
              if (!args?.after) {
                return incoming;
              }

              // fetchMore 직후 등 기존 캐시가 없으면 incoming만 저장
              if (!existing) {
                return incoming;
              }

              // fetchMore(after 있음) → edges를 이어붙여 무한 스크롤 목록 유지
              return {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
});

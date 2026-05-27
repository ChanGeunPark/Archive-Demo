import type { ApolloClient } from "@apollo/client";

import type { Work } from "../marketplaceTypes";
import { WORK_DETAIL_QUERY } from "./operations";

export function seedWorkDetailCache(
  client: ApolloClient,
  work: Work,
): void {
  client.writeQuery({
    query: WORK_DETAIL_QUERY,
    variables: { id: work.id },
    data: { work },
  });
}

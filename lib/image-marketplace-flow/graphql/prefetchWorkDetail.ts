import { marketplaceClient } from "../apolloClient";
import { WORK_DETAIL_QUERY } from "./operations";

const prefetchedWorkIds = new Set<string>();

export function prefetchWorkDetail(workId: string): void {
  if (!workId || prefetchedWorkIds.has(workId)) {
    return;
  }

  prefetchedWorkIds.add(workId);

  void marketplaceClient
    .query({
      query: WORK_DETAIL_QUERY,
      variables: { id: workId },
      fetchPolicy: "cache-first",
    })
    .catch(() => {
      prefetchedWorkIds.delete(workId);
    });
}

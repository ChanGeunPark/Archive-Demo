import { WORK_DETAIL_QUERY } from "./operations";

export function workDetailRefetchQuery(workId: string) {
  return {
    query: WORK_DETAIL_QUERY,
    variables: { id: workId },
  } as const;
}

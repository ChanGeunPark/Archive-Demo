import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/router";
import { DELETE_WORK_MUTATION, WORKS_QUERY } from "./operations";
import type { DeleteWorkMutationResponse, WorksQueryResponse } from "./types";

export function useDeleteWork() {
  const router = useRouter();
  const [mutate, state] = useMutation<DeleteWorkMutationResponse>(
    DELETE_WORK_MUTATION,
    {
      update: (cache, _result, { variables }) => {
        const deletedId = variables?.id;
        if (!deletedId) {
          return;
        }

        const existing = cache.readQuery<WorksQueryResponse>({
          query: WORKS_QUERY,
        });
        if (!existing?.works) {
          return;
        }

        cache.writeQuery({
          query: WORKS_QUERY,
          data: {
            works: existing.works.filter((work) => work.id !== deletedId),
          },
        });
      },
    },
  );

  const deleteWork = async (id: string) => {
    await mutate({
      variables: { id },
      onCompleted: () => {
        router.push("/demos/image-marketplace-flow");
      },
    });
  };

  return { deleteWork, ...state };
}

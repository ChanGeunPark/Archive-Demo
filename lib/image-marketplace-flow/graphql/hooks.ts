import { useMutation } from "@apollo/client/react";
import { useWorkDetailStore } from "../workDetailStore";
import {
  ACCEPT_OFFER_MUTATION,
  BUY_WORK_MUTATION,
  CREATE_OFFER_MUTATION,
  DELETE_WORK_MUTATION,
  WORKS_QUERY,
} from "./operations";
import type {
  AcceptOfferMutationResponse,
  BuyWorkMutationResponse,
  CreateOfferMutationResponse,
  DeleteWorkMutationResponse,
  WorksQueryResponse,
} from "./types";

type DeleteWorkVariables = { id: string };
type BuyWorkVariables = { workId: string; price: number; buyerId: string };
type CreateOfferVariables = {
  workId: string;
  amount: number;
  bidderId: string;
};
type AcceptOfferVariables = {
  workId: string;
  offerId: string;
  ownerId: string;
};

type MutationOptions = {
  onCompleted?: () => void;
  onError?: (error: Error) => void;
};

function requestWorkRefresh(workId: string) {
  useWorkDetailStore.getState().requestRefresh(workId);
}

export function useDeleteWork(options?: MutationOptions) {
  const [mutate, state] = useMutation<
    DeleteWorkMutationResponse,
    DeleteWorkVariables
  >(DELETE_WORK_MUTATION, {
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
  });

  const deleteWork = async (id: string) => {
    await mutate({
      variables: { id },
      onCompleted: options?.onCompleted,
      onError: options?.onError,
    });
  };

  return { deleteWork, ...state };
}

export function useBuyWork(options?: MutationOptions) {
  const [mutate, state] = useMutation<
    BuyWorkMutationResponse,
    BuyWorkVariables
  >(BUY_WORK_MUTATION);

  const buyWork = async (variables: BuyWorkVariables) => {
    await mutate({
      variables,
      onCompleted: () => {
        requestWorkRefresh(variables.workId);
        options?.onCompleted?.();
      },
      onError: options?.onError,
    });
  };

  return { buyWork, ...state };
}

export function useCreateOffer(options?: MutationOptions) {
  const [mutate, state] = useMutation<
    CreateOfferMutationResponse,
    CreateOfferVariables
  >(CREATE_OFFER_MUTATION);

  const createOffer = async (variables: CreateOfferVariables) => {
    await mutate({
      variables,
      onCompleted: () => {
        requestWorkRefresh(variables.workId);
        options?.onCompleted?.();
      },
      onError: options?.onError,
    });
  };

  return { createOffer, ...state };
}

export function useAcceptOffer(options?: MutationOptions) {
  const [mutate, state] = useMutation<
    AcceptOfferMutationResponse,
    AcceptOfferVariables
  >(ACCEPT_OFFER_MUTATION);

  const acceptOffer = async (variables: AcceptOfferVariables) => {
    await mutate({
      variables,
      onCompleted: () => {
        requestWorkRefresh(variables.workId);
        options?.onCompleted?.();
      },
      onError: options?.onError,
    });
  };

  return { acceptOffer, ...state };
}

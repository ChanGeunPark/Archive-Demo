import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { useMarketplaceStore } from "../marketplaceStore";
import { workDetailRefetchQuery } from "./cacheUtils";
import {
  ACCEPT_OFFER_MUTATION,
  BUY_WORK_MUTATION,
  CREATE_OFFER_MUTATION,
  DELETE_WORK_MUTATION,
  UPDATE_ASKING_PRICE_MUTATION,
  UPDATE_USER_AVATAR_MUTATION,
  USER_QUERY,
  DEFAULT_WORKS_QUERY_VARIABLES,
  WORKS_QUERY,
} from "./operations";
import type {
  AcceptOfferMutationResponse,
  BuyWorkMutationResponse,
  CreateOfferMutationResponse,
  DeleteWorkMutationResponse,
  UpdateAskingPriceMutationResponse,
  UpdateUserAvatarMutationResponse,
  UserQueryResponse,
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

      cache.updateQuery<WorksQueryResponse>(
        {
          query: WORKS_QUERY,
          variables: DEFAULT_WORKS_QUERY_VARIABLES,
        },
        (existing) => {
          if (!existing?.works.edges) {
            return existing;
          }

          return {
            works: {
              ...existing.works,
              edges: existing.works.edges.filter(
                (edge) => edge.node.id !== deletedId,
              ),
              totalCount:
                existing.works.totalCount != null
                  ? existing.works.totalCount - 1
                  : null,
            },
          };
        },
      );

      cache.evict({
        id: cache.identify({ __typename: "Work", id: deletedId }),
      });
      cache.gc();
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
      refetchQueries: [workDetailRefetchQuery(variables.workId)],
      onCompleted: options?.onCompleted,
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
      refetchQueries: [workDetailRefetchQuery(variables.workId)],
      onCompleted: options?.onCompleted,
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
      refetchQueries: [workDetailRefetchQuery(variables.workId)],
      onCompleted: options?.onCompleted,
      onError: options?.onError,
    });
  };

  return { acceptOffer, ...state };
}

export function useSyncMarketplaceUser() {
  const currentUser = useMarketplaceStore((state) => state.currentUser);
  const setCurrentUser = useMarketplaceStore((state) => state.setCurrentUser);

  const { data } = useQuery<UserQueryResponse, { id: string }>(USER_QUERY, {
    variables: { id: currentUser?.id ?? "" },
    skip: !currentUser?.id,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.user) {
      setCurrentUser(data.user);
    }
  }, [data?.user, setCurrentUser]);
}

type UpdateUserAvatarVariables = { userId: string; avatarUrl: string };

export function useUpdateUserAvatar(options?: MutationOptions) {
  const setCurrentUser = useMarketplaceStore((state) => state.setCurrentUser);
  const [mutate, state] = useMutation<
    UpdateUserAvatarMutationResponse,
    UpdateUserAvatarVariables
  >(UPDATE_USER_AVATAR_MUTATION);

  const updateUserAvatar = async (variables: UpdateUserAvatarVariables) => {
    await mutate({
      variables,
      refetchQueries: [
        { query: WORKS_QUERY, variables: DEFAULT_WORKS_QUERY_VARIABLES },
      ],
      onCompleted: (data) => {
        setCurrentUser(data.updateUserAvatar);
        options?.onCompleted?.();
      },
      onError: options?.onError,
    });
  };

  return { updateUserAvatar, ...state };
}

type UpdateAskingPriceVariables = {
  workId: string;
  ownerId: string;
  askingPrice: number;
};

export function useUpdateAskingPrice(options?: MutationOptions) {
  const [mutate, state] = useMutation<
    UpdateAskingPriceMutationResponse,
    UpdateAskingPriceVariables
  >(UPDATE_ASKING_PRICE_MUTATION);

  const updateAskingPrice = async (variables: UpdateAskingPriceVariables) => {
    await mutate({
      variables,
      refetchQueries: [
        { query: WORKS_QUERY, variables: DEFAULT_WORKS_QUERY_VARIABLES },
        workDetailRefetchQuery(variables.workId),
      ],
      onCompleted: options?.onCompleted,
      onError: options?.onError,
    });
  };

  return { updateAskingPrice, ...state };
}

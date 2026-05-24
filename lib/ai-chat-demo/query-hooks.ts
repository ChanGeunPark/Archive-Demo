"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDemoCharacter,
  createDemoChatRoom,
  deleteDemoCharacter,
  deleteDemoChatRoom,
  fetchDemoCharacters,
  fetchDemoChatHistory,
  requestPreviewChat,
  requestStreamingChat,
} from "@/lib/ai-chat-demo/api-client";
import { aiChatDemoKeys } from "@/lib/ai-chat-demo/query-keys";
import type { DemoPublicCharacter } from "@/lib/ai-chat-demo/types";
import type {
  CreateDemoCharacterInput,
  CreateDemoCharacterResult,
  CreateDemoChatRoomInput,
  CreateDemoChatRoomResult,
  DeleteDemoCharacterInput,
  DeleteDemoCharacterResult,
  DeleteDemoChatRoomResult,
  FetchDemoCharactersResult,
  FetchDemoChatHistoryResult,
  PreviewChatInput,
  PreviewChatResult,
  StreamingChatInput,
  StreamingChatResult,
} from "@/lib/ai-chat-demo/api-client";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

// 캐릭터 목록 조회
export function useDemoCharactersQuery(
  initialData?: FetchDemoCharactersResult,
): UseQueryResult<FetchDemoCharactersResult, Error> {
  return useQuery({
    queryKey: aiChatDemoKeys.characters(),
    queryFn: fetchDemoCharacters,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
}

// 채팅방 메시지 조회
export function useDemoChatHistoryQuery(
  roomId: string,
  initialData?: FetchDemoChatHistoryResult,
): UseQueryResult<FetchDemoChatHistoryResult, Error> {
  return useQuery({
    queryKey: aiChatDemoKeys.history(roomId),
    queryFn: () => fetchDemoChatHistory(roomId),
    enabled: Boolean(roomId),
    placeholderData: initialData,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

// 캐릭터 생성
export function useCreateDemoCharacterMutation(): UseMutationResult<
  CreateDemoCharacterResult,
  Error,
  CreateDemoCharacterInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDemoCharacter,
    onSuccess: (data) => {
      queryClient.setQueryData<DemoPublicCharacter>(
        aiChatDemoKeys.character(data.character.id),
        data.character,
      );
      if (data.roomId) {
        queryClient.setQueryData<FetchDemoChatHistoryResult>(
          aiChatDemoKeys.history(data.roomId),
          [],
        );
      }
      queryClient.invalidateQueries({ queryKey: aiChatDemoKeys.characters() });
    },
  });
}

// 채팅방 생성
export function useCreateDemoChatRoomMutation(): UseMutationResult<
  CreateDemoChatRoomResult,
  Error,
  CreateDemoChatRoomInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDemoChatRoom,
    onSuccess: (data) => {
      const { roomId, characterId } = data;
      queryClient.setQueryData<FetchDemoChatHistoryResult>(
        aiChatDemoKeys.history(roomId),
        [],
      );
      queryClient.setQueryData<FetchDemoCharactersResult>(
        aiChatDemoKeys.characters(),
        (old: DemoPublicCharacter[] | undefined) =>
          old?.map((character) =>
            character.id === characterId
              ? {
                  ...character,
                  totalChatCount: (character.totalChatCount ?? 0) + 1,
                }
              : character,
          ) ?? old,
      );
    },
  });
}

// 캐릭터 삭제
export function useDeleteDemoCharacterMutation(): UseMutationResult<
  DeleteDemoCharacterResult,
  Error,
  DeleteDemoCharacterInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDemoCharacter,
    onSuccess: (characterId) => {
      queryClient.removeQueries({
        queryKey: aiChatDemoKeys.character(characterId),
      });
      queryClient.invalidateQueries({ queryKey: aiChatDemoKeys.characters() });
    },
  });
}

// 채팅방 삭제
export function useDeleteDemoChatRoomMutation(): UseMutationResult<
  DeleteDemoChatRoomResult,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDemoChatRoom,
    onSuccess: (roomId) => {
      queryClient.removeQueries({ queryKey: aiChatDemoKeys.history(roomId) });
    },
  });
}

export function usePreviewChatMutation(): UseMutationResult<
  PreviewChatResult,
  Error,
  PreviewChatInput
> {
  return useMutation({
    mutationFn: requestPreviewChat,
  });
}

export function useStreamingChatMutation(): UseMutationResult<
  StreamingChatResult,
  Error,
  StreamingChatInput
> {
  return useMutation({
    mutationFn: requestStreamingChat,
  });
}

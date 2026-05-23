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
import type {
  DemoChatMessage,
  DemoPublicCharacter,
} from "@/lib/ai-chat-demo/types";

// 캐릭터 목록 조회
export function useDemoCharactersQuery(initialData?: DemoPublicCharacter[]) {
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
  initialData?: DemoChatMessage[],
) {
  return useQuery({
    queryKey: aiChatDemoKeys.history(roomId),
    queryFn: () => fetchDemoChatHistory(roomId),
    enabled: Boolean(roomId),
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
}

// 캐릭터 생성
export function useCreateDemoCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDemoCharacter,
    onSuccess: (data) => {
      queryClient.setQueryData(
        aiChatDemoKeys.character(data.character.id),
        data.character,
      );
      if (data.roomId) {
        queryClient.setQueryData(aiChatDemoKeys.history(data.roomId), []);
      }
      queryClient.invalidateQueries({ queryKey: aiChatDemoKeys.characters() });
    },
  });
}

// 채팅방 생성
export function useCreateDemoChatRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDemoChatRoom,
    onSuccess: (data: { roomId: string; characterId: string }) => {
      const { roomId, characterId } = data;
      queryClient.setQueryData(aiChatDemoKeys.history(roomId), []);
      queryClient.setQueryData(
        aiChatDemoKeys.characters(),
        (old: DemoPublicCharacter[]) =>
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
export function useDeleteDemoCharacterMutation() {
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
export function useDeleteDemoChatRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDemoChatRoom,
    onSuccess: (roomId) => {
      queryClient.removeQueries({ queryKey: aiChatDemoKeys.history(roomId) });
    },
  });
}

export function usePreviewChatMutation() {
  return useMutation({
    mutationFn: requestPreviewChat,
  });
}

export function useStreamingChatMutation() {
  return useMutation({
    mutationFn: requestStreamingChat,
  });
}

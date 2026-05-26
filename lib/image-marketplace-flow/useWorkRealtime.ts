"use client";

import { useEffect, useRef } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase/browser";

type UseWorkRealtimeOptions = {
  workId: string | undefined;
  onWorkChange: () => void;
  onWorkDeleted?: () => void;
};

/**
 * DB 변경(postgres_changes)을 트리거로만 사용하고, 화면 갱신은 onWorkChange(보통 GraphQL refetch)에 맡깁니다.
 */
export function useWorkRealtime({
  workId,
  onWorkChange,
  onWorkDeleted,
}: UseWorkRealtimeOptions) {
  const onWorkChangeRef = useRef(onWorkChange);
  const onWorkDeletedRef = useRef(onWorkDeleted);

  useEffect(() => {
    onWorkChangeRef.current = onWorkChange;
  }, [onWorkChange]);

  useEffect(() => {
    onWorkDeletedRef.current = onWorkDeleted;
  }, [onWorkDeleted]);

  useEffect(() => {
    if (!workId || !hasSupabaseBrowserEnv()) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`work:${workId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "marketplace_demo_works",
          filter: `id=eq.${workId}`,
        },
        () => {
          onWorkChangeRef.current();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "marketplace_demo_works",
          filter: `id=eq.${workId}`,
        },
        () => {
          if (onWorkDeletedRef.current) {
            onWorkDeletedRef.current();
            return;
          }
          onWorkChangeRef.current();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [workId]);
}

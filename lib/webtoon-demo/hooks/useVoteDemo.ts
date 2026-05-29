"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAKE_PER_TICKET,
  DEFAULT_USER_CAKE,
  MAX_VOTE_COUNT,
  getVoteCandidates,
} from "../voteMockData";
import type { UserVote, VoteCandidate, VoteSessionInfo } from "../types";

type StoredVoteState = {
  userVote?: UserVote;
  remainingVoteCount: number;
  userCakeCount: number;
  voteSums: Record<string, number>;
};

const STORAGE_PREFIX = "webtoon-demo-vote:";

function readState(episodeId: string): StoredVoteState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${episodeId}`);
    return raw ? (JSON.parse(raw) as StoredVoteState) : null;
  } catch {
    return null;
  }
}

function writeState(episodeId: string, state: StoredVoteState) {
  localStorage.setItem(`${STORAGE_PREFIX}${episodeId}`, JSON.stringify(state));
}

function createInitialState(episodeId: string): StoredVoteState {
  const candidates = getVoteCandidates(episodeId);
  const voteSums = Object.fromEntries(
    candidates.map((candidate) => [candidate.id, candidate.voteSum]),
  );
  return {
    remainingVoteCount: MAX_VOTE_COUNT,
    userCakeCount: DEFAULT_USER_CAKE,
    voteSums,
  };
}

export function useVoteDemo(episodeId: string, seriesCakePrice = 3) {
  const [state, setState] = useState<StoredVoteState>(() => createInitialState(episodeId));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readState(episodeId);
    setState(stored ?? createInitialState(episodeId));
    setHydrated(true);
  }, [episodeId]);

  const voteCandidates = useMemo((): VoteCandidate[] => {
    const base = getVoteCandidates(episodeId);
    return base.map((candidate) => ({
      ...candidate,
      voteSum: state.voteSums[candidate.id] ?? candidate.voteSum,
    }));
  }, [episodeId, state.voteSums]);

  const sessionInfo: VoteSessionInfo = useMemo(
    () => ({
      remainingVoteCount: state.remainingVoteCount,
      userCakeCount: state.userCakeCount,
      seriesCakePrice,
    }),
    [seriesCakePrice, state.remainingVoteCount, state.userCakeCount],
  );

  const submitVote = useCallback(
    async (voteId: string, ticketCount: number) => {
      const cost = CAKE_PER_TICKET * ticketCount;
      if (state.userCakeCount < cost) {
        throw new Error("NOT_ENOUGH_CAKE");
      }
      if (ticketCount > state.remainingVoteCount) {
        throw new Error("NOT_ENOUGH_TICKETS");
      }

      const candidate = voteCandidates.find((item) => item.id === voteId);
      if (!candidate) throw new Error("INVALID_VOTE");

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextState: StoredVoteState = {
        userVote: {
          voteId,
          selectionNumber: candidate.selectionNumber,
        },
        remainingVoteCount: state.remainingVoteCount - ticketCount,
        userCakeCount: state.userCakeCount - cost,
        voteSums: {
          ...state.voteSums,
          [voteId]: (state.voteSums[voteId] ?? candidate.voteSum) + ticketCount,
        },
      };

      setState(nextState);
      writeState(episodeId, nextState);
      return nextState;
    },
    [episodeId, state, voteCandidates],
  );

  return {
    hydrated,
    voteCandidates,
    userVote: state.userVote,
    sessionInfo,
    isVoted: Boolean(state.userVote),
    submitVote,
  };
}

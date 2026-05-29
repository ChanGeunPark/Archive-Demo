"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { EpisodeDetail } from "@/lib/webtoon-demo/types";
import EpisodeAuthorComment from "./EpisodeAuthorComment";
import EpisodeBottomBar from "./EpisodeBottomBar";
import EpisodeHeader from "./EpisodeHeader";
import ScrollPosition from "./ScrollPosition";
import VoteResultWinnerBox from "./VoteResultWinnerBox";
import VotingParents from "../vote/VotingParents";

type EpisodeDetailClientProps = {
  seoId: string;
  episodeData: EpisodeDetail;
};

export default function EpisodeDetailClient({
  seoId,
  episodeData,
}: EpisodeDetailClientProps) {
  const [opened, setOpened] = useState(true);
  const [scrollTargetTrigger, setScrollTargetTrigger] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLDivElement>(null);

  const isVoteOver =
    episodeData.voteExpireAt != null &&
    new Date(episodeData.voteExpireAt) < new Date();

  useEffect(() => {
    const handleContextMenu = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleContextMenu);
    };
  }, []);

  const contentImages = episodeData.contentImages ?? [];

  return (
    <>
      <ScrollPosition
        onScroll={(scroll) => {
          if (scroll === 0) setOpened(true);
        }}
        onScrollDown={() => {
          if (!scrollTargetTrigger && opened) setOpened(false);
        }}
        onTargetElementEnter={() => {
          setScrollTargetTrigger(true);
          setOpened(true);
        }}
        targetElementId="webtoon_end"
      />

      <EpisodeHeader
        opened={opened}
        episodeData={episodeData}
        startRef={startRef}
        finishRef={finishRef}
      />

      <div className="w-full bg-white lg:pt-[64px]" ref={startRef}>
        <button
          type="button"
          className="h-full w-full bg-white"
          onClick={() => {
            setScrollTargetTrigger(false);
            setOpened(!opened);
          }}
        >
          <div className="relative mx-auto min-h-screen max-w-[620px] transition-all duration-300">
            {contentImages.map((url, index) => (
              <Image
                alt={`webtoon page ${index + 1}`}
                key={`webtoon_${index}`}
                width={620}
                height={1000}
                className="pointer-events-none object-cover"
                quality={90}
                src={url}
              />
            ))}
          </div>
        </button>

        <div id="webtoon_end" />

        <div className="mx-auto flex max-w-[620px] flex-col items-center">
          {!isVoteOver && episodeData.episodeType === "SELECTABLE" ? (
            <VotingParents seoId={seoId} episode={episodeData} />
          ) : null}

          {isVoteOver ? <VoteResultWinnerBox episodeData={episodeData} /> : null}
        </div>
      </div>

      <div className="bg-gray-25 pb-[80px]">
        <EpisodeAuthorComment episode={episodeData} finishRef={finishRef} />
      </div>

      <EpisodeBottomBar
        seoId={seoId}
        episodeData={episodeData}
        opened={opened}
        isVoteOver={isVoteOver}
      />
    </>
  );
}

"use client";

import Image from "next/image";
import { cls } from "@/lib/client/utils";

type InfiniteLikeAnimationProps = {
  className?: string;
  style?: React.CSSProperties;
};

export default function InfiniteLikeAnimation({
  className,
  style,
}: InfiniteLikeAnimationProps) {
  const characters = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11];

  return (
    <div className={cls("h-[50px] w-[50px]", className)} style={style}>
      <figure className="relative h-full w-full">
        {characters.map((item, index) => (
          <Image
            key={item}
            alt="character"
            width={20}
            height={20}
            src={`/images/character/like_character${item}.png`}
            className="animate-like pointer-events-none absolute left-0 top-0 h-[20px] w-[20px] opacity-0"
            style={{
              animationDelay: `${(index % 4) * 0.7}s`,
              animationDuration: `${2 + (index % 3)}s`,
              left: `${(index * 7) % 30}px`,
            }}
          />
        ))}
      </figure>
    </div>
  );
}

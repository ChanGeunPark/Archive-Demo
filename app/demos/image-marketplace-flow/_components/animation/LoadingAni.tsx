"use client";

import dynamic from "next/dynamic";
import loading from "../static/loading.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export interface LoadingAniProps {
  loop?: boolean;
  className?: string;
}

function LoadingAni({ className, loop = false }: LoadingAniProps) {
  return (
    <Lottie
      animationData={loading}
      loop={loop}
      className={`${className} pointer-events-none`}
    />
  );
}

export default LoadingAni;

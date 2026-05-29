import { useEffect, useState } from "react";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

export default function useCounterUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrame = Math.round(duration / frameRate);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    let currentNumber = 0;
    const counter = setInterval(() => {
      const progress = easeOutExpo(++currentNumber / totalFrame);
      setCount(Math.floor(end * progress));

      if (progress === 1 || currentNumber === totalFrame) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, frameRate, totalFrame]);

  return count;
}

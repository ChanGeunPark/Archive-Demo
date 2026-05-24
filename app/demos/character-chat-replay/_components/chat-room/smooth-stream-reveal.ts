type SmoothStreamRevealOptions = {
  onUpdate: (displayedText: string) => void;
  /** 작은 토큰(GPT)은 즉시 반영, 이보다 큰 delta는 부드럽게 따라감 */
  instantTokenThreshold?: number;
  minCharsPerFrame?: number;
  maxCharsPerFrame?: number;
};

export type SmoothStreamReveal = {
  pushTarget: (text: string) => void;
  flush: () => Promise<void>;
  snapToTarget: () => void;
  stop: () => void;
};

export function createSmoothStreamReveal(
  options: SmoothStreamRevealOptions,
): SmoothStreamReveal {
  const instantThreshold = options.instantTokenThreshold ?? 8;
  const minCharsPerFrame = options.minCharsPerFrame ?? 1;
  const maxCharsPerFrame = options.maxCharsPerFrame ?? 5;

  let targetText = "";
  let displayedText = "";
  let rafId: number | null = null;
  let flushPromise: Promise<void> | null = null;
  let resolveFlush: (() => void) | null = null;

  function finishFlushIfNeeded() {
    if (displayedText.length >= targetText.length && resolveFlush) {
      resolveFlush();
      resolveFlush = null;
      flushPromise = null;
    }
  }

  function tick() {
    if (displayedText.length >= targetText.length) {
      rafId = null;
      finishFlushIfNeeded();
      return;
    }

    const backlog = targetText.length - displayedText.length;
    const charsPerFrame = Math.min(
      maxCharsPerFrame,
      Math.max(minCharsPerFrame, Math.ceil(backlog / 15)),
    );

    displayedText = targetText.slice(
      0,
      displayedText.length + charsPerFrame,
    );
    options.onUpdate(displayedText);

    rafId = requestAnimationFrame(tick);
  }

  function ensureRunning() {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  return {
    pushTarget(text: string) {
      const delta = text.length - targetText.length;
      targetText = text;

      if (
        delta > 0 &&
        delta <= instantThreshold &&
        displayedText.length >= targetText.length - delta
      ) {
        displayedText = targetText;
        options.onUpdate(displayedText);
        finishFlushIfNeeded();
        return;
      }

      ensureRunning();
    },

    flush() {
      if (displayedText.length >= targetText.length) {
        return Promise.resolve();
      }

      if (!flushPromise) {
        flushPromise = new Promise<void>((resolve) => {
          resolveFlush = resolve;
          ensureRunning();
        });
      }

      return flushPromise;
    },

    snapToTarget() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      displayedText = targetText;
      options.onUpdate(displayedText);
      finishFlushIfNeeded();
    },

    stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (resolveFlush) {
        resolveFlush();
        resolveFlush = null;
        flushPromise = null;
      }
    },
  };
}

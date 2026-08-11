"use client";

import { useEffect, useState } from "react";

function getPseudoProgress(elapsedMs: number) {
  if (elapsedMs <= 60000) {
    return 2 + (elapsedMs / 60000) * 90;
  }

  return Math.min(94, 92 + (1 - Math.exp(-(elapsedMs - 60000) / 22000)) * 2);
}

export function ResultLoadingCard() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const elapsedMs = Date.now() - startedAt;
      setProgress(getPseudoProgress(elapsedMs));
    }, 120);

    setProgress(1);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const displayProgress = Math.round(progress);

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] shadow-[0_22px_54px_rgba(17,24,39,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_50%)]" />
        <div
          className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(226,232,240,0.12)_0%,rgba(203,213,225,0.45)_100%)] transition-[height] duration-300 ease-out"
          style={{ height: `${progress}%` }}
        />
        <div
          className="absolute inset-x-0 h-px bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.95)] transition-[bottom] duration-300 ease-out"
          style={{ bottom: `calc(${progress}% - 1px)` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.62)_50%,transparent_70%)] [animation:loading-sheen_3.6s_ease-in-out_infinite]" />

        <div className="relative flex h-full items-center justify-center">
          <div className="rounded-full border border-white/80 bg-white/72 px-7 py-4 shadow-[0_20px_40px_rgba(255,255,255,0.5)] backdrop-blur-md">
            <span className="text-[40px] font-extralight tracking-[-0.06em] text-slate-600 sm:text-[48px]">
              {displayProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
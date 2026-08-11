"use client";

import Image from "next/image";
import type { WigOption } from "@/lib/wigs";
import { ResultLoadingCard } from "@/components/result-loading-card";

type ResultPanelProps = {
  isLoading: boolean;
  resultImageUrl: string | null;
  selectedWig: WigOption | null;
  statusText: string;
  errorText: string | null;
  isActionDisabled: boolean;
  onGenerate: () => void;
};

export function ResultPanel({
  isLoading,
  resultImageUrl,
  selectedWig,
  statusText,
  errorText,
  isActionDisabled,
  onGenerate
}: ResultPanelProps) {
  return (
    <section className="rounded-[34px] border border-white/75 bg-white/82 p-5 shadow-[0_22px_60px_rgba(17,24,39,0.08)] backdrop-blur-xl transition-all duration-300 sm:p-6 lg:p-7">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-[22px] font-light tracking-[-0.04em] text-ink sm:text-[26px]">
            Результат
          </h2>
          {!isLoading && statusText ? (
            <p className="max-w-[34rem] text-sm font-light leading-7 text-slate-500 animate-fade-in-up">
              {statusText}
            </p>
          ) : null}
        </div>
        {selectedWig ? (
          <span className="rounded-full border border-slate-200 bg-white/90 px-3.5 py-1 text-xs font-medium tracking-[0.02em] text-slate-600 shadow-sm backdrop-blur transition-all duration-200">
            {selectedWig.name}
          </span>
        ) : null}
      </div>

      {errorText ? (
        <div className="mb-4 rounded-[22px] border border-red-200/90 bg-red-50/90 px-4.5 py-3.5 text-sm font-light text-red-700 shadow-sm animate-fade-in-up">
          {errorText}
        </div>
      ) : null}

      {isLoading ? (
        <ResultLoadingCard />
      ) : resultImageUrl ? (
        <div className="space-y-4 animate-result-reveal">
          <div className="mx-auto w-full max-w-[460px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] border border-line bg-mist shadow-[0_22px_54px_rgba(17,24,39,0.12)]">
              <Image
                src={resultImageUrl}
                alt="Результат примерки"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 88vw, 460px"
                unoptimized
              />
              <div className="absolute top-4 left-4 rounded-full border border-white/80 bg-white/85 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md">
                ✨ Примерка готова
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[460px]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] border border-dashed border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,244,248,0.84))] shadow-[0_22px_54px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-slate-400/60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),transparent_56%)]" />
            <div className="relative flex h-full items-center justify-center px-6 text-center">
              <button
                type="button"
                onClick={onGenerate}
                disabled={isActionDisabled}
                className={[
                  "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-light tracking-[0.01em] transition-all duration-300 active:scale-[0.98] sm:min-h-[54px] sm:px-8 sm:text-[15px]",
                  isActionDisabled
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "shimmer-button-effect bg-ink text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_20px_42px_rgba(17,24,39,0.24)]"
                ].join(" ")}
              >
                Примерить парик
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
"use client";

import Image from "next/image";
import type { WigOption } from "@/lib/wigs";
import { ResultLoadingCard } from "@/components/result-loading-card";

type ResultPanelProps = {
  isLoading: boolean;
  resultImageUrl: string | null;
  selectedWig: WigOption | null;
  activeResultWig?: WigOption | null;
  statusText: string;
  errorText: string | null;
  isActionDisabled: boolean;
  onGenerate: () => void;
  onTryAnotherWig?: () => void;
};

export function ResultPanel({
  isLoading,
  resultImageUrl,
  selectedWig,
  activeResultWig,
  statusText,
  errorText,
  isActionDisabled,
  onGenerate,
  onTryAnotherWig
}: ResultPanelProps) {
  const currentWig = activeResultWig || selectedWig;
  const isDifferentWigSelected = Boolean(
    resultImageUrl && selectedWig && activeResultWig && selectedWig.id !== activeResultWig.id
  );

  const handleDownload = () => {
    if (!resultImageUrl) return;
    const a = document.createElement("a");
    a.href = resultImageUrl;
    a.download = `dom-volos-try-on-${currentWig?.id ?? "result"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="lg:sticky lg:top-24 h-fit rounded-[34px] border border-white/75 bg-white/85 p-5 shadow-[0_22px_60px_rgba(17,24,39,0.08)] backdrop-blur-xl transition-all duration-300 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-[20px] font-light tracking-[-0.03em] text-ink sm:text-[22px]">
            Зеркало примерки
          </h2>
          <p className="text-xs font-light text-slate-500">
            {resultImageUrl ? "Ваша фото-примерка готова!" : selectedWig ? "Парик выбран — нажмите примерить" : "Выберите парик слева"}
          </p>
        </div>

        {selectedWig ? (
          <div className="flex flex-col items-end">
            <span className="rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-medium text-slate-700 shadow-xs">
              {selectedWig.name}
            </span>
            <span className="mt-1 text-xs font-semibold text-emerald-700">
              {selectedWig.price}
            </span>
          </div>
        ) : null}
      </div>

      {statusText && !isLoading ? (
        <div className="mb-3.5 rounded-2xl bg-slate-50 px-3.5 py-2 text-xs font-light text-slate-600 border border-slate-100 animate-fade-in-up">
          {statusText}
        </div>
      ) : null}

      {errorText ? (
        <div className="mb-3.5 rounded-2xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-xs font-light text-red-700 shadow-xs animate-fade-in-up">
          {errorText}
        </div>
      ) : null}

      <div className="relative">
        {isLoading ? (
          <ResultLoadingCard />
        ) : resultImageUrl ? (
          <div className="space-y-4 animate-result-reveal">
            {/* Quick action bar when user selected another wig from catalog */}
            {isDifferentWigSelected && selectedWig ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-center shadow-xs animate-fade-in-up">
                <p className="text-xs text-emerald-950">
                  Вы выбрали новый парик: <strong className="font-semibold">«{selectedWig.name}»</strong>
                </p>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="mt-2.5 w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-xs sm:text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-slate-800 active:scale-98 cursor-pointer"
                >
                  <span>Примерить «{selectedWig.name}» ✨</span>
                </button>
              </div>
            ) : null}

            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border border-line bg-mist shadow-[0_20px_48px_rgba(17,24,39,0.12)]">
              <Image
                src={resultImageUrl}
                alt="Результат примерки"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 420px"
                unoptimized
              />
              <div className="absolute top-3.5 left-3.5 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 shadow-xs backdrop-blur-md">
                ✨ Примерка готова
              </div>
            </div>

            <div className="space-y-2.5">
              {/* ACCENTUATED & ENLARGED 1-CLICK BUY BUTTON */}
              {currentWig?.href ? (
                <a
                  href={currentWig.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 text-sm sm:text-base font-semibold text-white shadow-[0_12px_28px_rgba(16,185,129,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,185,129,0.42)] active:scale-[0.98] select-none cursor-pointer"
                >
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Купить в 1 клик</span>
                  {currentWig.price ? (
                    <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-bold text-white tracking-wide">
                      {currentWig.price}
                    </span>
                  ) : null}
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ) : null}

              {/* SECONDARY ROW: Download & Try Another Wig */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-ink active:scale-95 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Скачать фото
                </button>

                {onTryAnotherWig ? (
                  <button
                    type="button"
                    onClick={onTryAnotherWig}
                    className="flex-1 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-ink active:scale-95 cursor-pointer"
                  >
                    <span>Выбрать другой парик 💇‍♀️</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border border-dashed border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,244,248,0.85))] shadow-[0_18px_44px_rgba(17,24,39,0.04)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),transparent_56%)]" />
            
            {selectedWig?.imageSrc ? (
              <div className="absolute inset-0 opacity-15 filter blur-xs">
                <Image
                  src={selectedWig.imageSrc}
                  alt={selectedWig.name}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              </div>
            ) : null}

            <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xs text-xl">
                💇‍♀️
              </div>

              <h3 className="mb-1 text-base font-medium text-ink">
                {selectedWig ? selectedWig.name : "Выберите парик для примерки"}
              </h3>
              
              <p className="mb-6 max-w-[220px] text-xs font-light text-slate-500">
                {selectedWig
                  ? "Нажмите кнопку ниже, чтобы примерить этот парик на ваше фото"
                  : "Выберите парик из каталога слева и загрузите ваше фото"}
              </p>

              <button
                type="button"
                onClick={onGenerate}
                disabled={isActionDisabled}
                className={[
                  "w-full inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-light tracking-[0.01em] transition-all duration-300 active:scale-[0.98]",
                  isActionDisabled
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "shimmer-button-effect bg-ink text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_20px_42px_rgba(17,24,39,0.24)]"
                ].join(" ")}
              >
                Примерить парик ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
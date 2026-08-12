"use client";

import Image from "next/image";
import { useId } from "react";

type SelfieHeaderSectionProps = {
  fileName: string | null;
  hasFile: boolean;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
};

export function SelfieHeaderSection({
  fileName,
  hasFile,
  disabled = false,
  onFileChange
}: SelfieHeaderSectionProps) {
  const baseId = useId();
  const uploadId = `${baseId}-upload`;
  const cameraId = `${baseId}-camera`;

  const baseButtonClass = [
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-xs sm:text-sm font-light tracking-[0.01em] transition-all duration-200 cursor-pointer select-none active:scale-[0.98]",
    disabled
      ? "cursor-not-allowed border-line bg-slate-100 text-slate-400"
      : "border-slate-200/90 bg-white text-ink hover:-translate-y-0.5 hover:border-ink/25 hover:bg-white hover:shadow-[0_8px_20px_rgba(17,24,39,0.06)]"
  ].join(" ");

  return (
    <section className="rounded-[32px] border border-white/75 bg-white/82 p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)] backdrop-blur-xl sm:p-6 transition-all duration-300 hover:shadow-[0_22px_56px_rgba(17,24,39,0.08)]">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Guide & Sample Photo */}
        <div className="lg:col-span-7 flex items-center gap-4 border-b border-slate-100 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs sm:h-24 sm:w-24">
            <Image
              src="/guide/selfie-guide.png"
              alt="Подсказка для селфи"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-[18px] font-light tracking-[-0.03em] text-ink sm:text-[20px]">
              Как сделать фото
            </h2>
            <p className="text-xs font-light leading-relaxed text-slate-500 sm:text-sm">
              Сделайте фото анфас при хорошем освещении, держите голову ровно и не закрывайте лицо волосами.
            </p>
          </div>
        </div>

        {/* Right Side: Upload Controls */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[18px] font-light tracking-[-0.03em] text-ink sm:text-[20px]">
              Ваше фото
            </h2>

            {hasFile ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 animate-fade-in-up">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                  ✓
                </span>
                Загружено
              </span>
            ) : null}
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <label htmlFor={uploadId} className={baseButtonClass}>
              <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Загрузить фото
            </label>

            <label htmlFor={cameraId} className={baseButtonClass}>
              <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Сделать селфи
            </label>
          </div>
        </div>
      </div>

      <input
        id={uploadId}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
      <input
        id={cameraId}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
    </section>
  );
}

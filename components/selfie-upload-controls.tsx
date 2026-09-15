"use client";

import { useId } from "react";

type SelfieUploadControlsProps = {
  fileName: string | null;
  hasFile: boolean;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
};

export function SelfieUploadControls({
  fileName,
  hasFile,
  disabled = false,
  onFileChange
}: SelfieUploadControlsProps) {
  const baseId = useId();
  const uploadId = `${baseId}-upload`;
  const cameraId = `${baseId}-camera`;

  const baseButtonClass = [
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-base font-light tracking-[0.01em] transition-all duration-200 cursor-pointer select-none active:scale-[0.98] sm:min-h-[54px] sm:px-6",
    disabled
      ? "cursor-not-allowed border-line bg-slate-100 text-slate-400"
      : "border-slate-200/90 bg-white text-ink hover:-translate-y-0.5 hover:border-ink/25 hover:bg-white hover:shadow-[0_8px_20px_rgba(17,24,39,0.06)]"
  ].join(" ");

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)] backdrop-blur sm:p-6 transition-all duration-300 hover:shadow-[0_22px_56px_rgba(17,24,39,0.08)]">
      <div className="space-y-4">
        <div className="space-y-2.5">
          <h2 className="text-[21px] font-light tracking-[-0.03em] text-ink sm:text-[24px]">
            Ваше фото
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {hasFile ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1.5 text-base font-light text-emerald-700 animate-fade-in-up">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-sm text-white shadow-sm">
                  <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
                </span>
                Фото загружено
              </span>
            ) : null}
            {fileName ? (
              <span className="line-clamp-1 max-w-[200px] text-base font-light text-slate-500">
                {fileName}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label htmlFor={uploadId} className={baseButtonClass}>
            <svg
              className="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Загрузить фото
          </label>
          <label htmlFor={cameraId} className={baseButtonClass}>
            <svg
              className="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Сделать селфи
          </label>
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
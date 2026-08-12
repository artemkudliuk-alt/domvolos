"use client";

type StepProgressHeaderProps = {
  hasSelfie: boolean;
  hasWig: boolean;
  hasResult: boolean;
};

export function StepProgressHeader({
  hasSelfie,
  hasWig,
  hasResult
}: StepProgressHeaderProps) {
  // Determine step states: 'completed' | 'active' | 'upcoming'
  const step1State = hasSelfie ? "completed" : "active";
  const step2State = hasWig ? "completed" : hasSelfie ? "active" : "upcoming";
  const step3State = hasResult ? "completed" : hasSelfie && hasWig ? "active" : "upcoming";

  return (
    <div className="sticky top-3 z-30 mx-auto mb-2 flex max-w-fit items-center justify-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-2 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur-md transition-all duration-300 sm:gap-2.5 sm:px-4 sm:py-2.5">
      {/* Step 1: Selfie */}
      <div
        className={[
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 sm:text-sm",
          step1State === "completed"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
            : step1State === "active"
            ? "bg-ink text-white shadow-sm ring-2 ring-ink/10"
            : "text-slate-400"
        ].join(" ")}
      >
        {step1State === "completed" ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
            ✓
          </span>
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-[10px] font-semibold">
            1
          </span>
        )}
        <span>Фото</span>
      </div>

      <span className="text-slate-300 text-xs sm:text-sm">→</span>

      {/* Step 2: Wig Selection */}
      <div
        className={[
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 sm:text-sm",
          step2State === "completed"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
            : step2State === "active"
            ? "bg-ink text-white shadow-sm ring-2 ring-ink/10"
            : "text-slate-400"
        ].join(" ")}
      >
        {step2State === "completed" ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
            ✓
          </span>
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            2
          </span>
        )}
        <span>Парик</span>
      </div>

      <span className="text-slate-300 text-xs sm:text-sm">→</span>

      {/* Step 3: Try-On Result */}
      <div
        className={[
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 sm:text-sm",
          step3State === "completed"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
            : step3State === "active"
            ? "bg-ink text-white shadow-sm ring-2 ring-ink/10 animate-pulse"
            : "text-slate-400"
        ].join(" ")}
      >
        {step3State === "completed" ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
            ✓
          </span>
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            3
          </span>
        )}
        <span>Примерка</span>
      </div>
    </div>
  );
}

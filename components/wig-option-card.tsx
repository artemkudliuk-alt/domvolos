"use client";

import Image from "next/image";
import type { WigOption } from "@/lib/wigs";

type WigOptionCardProps = {
  wig: WigOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function WigOptionCard({
  wig,
  isSelected,
  onSelect
}: WigOptionCardProps) {
  return (
    <div
      onClick={() => onSelect(wig.id)}
      className={[
        "group relative flex flex-col justify-between overflow-hidden rounded-[24px] border bg-white/92 text-left transition-all duration-300 cursor-pointer select-none active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15",
        isSelected
          ? "border-ink shadow-[0_18px_40px_rgba(17,24,39,0.14)] ring-2 ring-ink/10 bg-white"
          : "border-slate-200/80 hover:-translate-y-1 hover:border-slate-400/40 hover:bg-white hover:shadow-[0_16px_36px_rgba(17,24,39,0.08)]"
      ].join(" ")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(wig.id);
        }
      }}
      aria-pressed={isSelected}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-accentSoft">
        <Image
          src={wig.imageSrc}
          alt={wig.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 42vw, (max-width: 1280px) 28vw, 220px"
        />

        {wig.price && (
          <div className="absolute top-2.5 right-2.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur shadow-sm transition-transform duration-200 group-hover:scale-105">
            {wig.special ? (
              <span>
                <span className="line-through opacity-70 mr-1.5">{wig.price}</span>
                <span className="text-emerald-300 font-semibold">{wig.special}</span>
              </span>
            ) : (
              <span>{wig.price}</span>
            )}
          </div>
        )}

        {wig.href && (
          <a
            href={wig.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Открыть на сайте магазина"
            className="absolute bottom-2.5 right-2.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white hover:text-ink"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <div className="flex items-center justify-between gap-2.5 px-3.5 py-3">
        <span className="line-clamp-2 text-xs font-medium tracking-[0.01em] text-slate-800 leading-tight">
          {wig.name}
        </span>
        <span
          className={[
            "h-2.5 w-2.5 shrink-0 rounded-full border border-white shadow-[0_0_0_5px_rgba(255,255,255,0.6)] transition-all duration-300",
            isSelected ? "bg-ink scale-110" : "bg-slate-200"
          ].join(" ")}
        />
      </div>
    </div>
  );
}
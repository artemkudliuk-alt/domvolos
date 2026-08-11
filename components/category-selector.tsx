"use client";

import type { WigCategory } from "@/lib/wigs";

type CategorySelectorProps = {
  categories: WigCategory[];
  selectedCategory: WigCategory["id"];
  onSelect: (category: WigCategory["id"]) => void;
};

function splitIntoThreeRows<T>(items: T[]): T[][] {
  if (!items.length) return [];
  const perRow = Math.ceil(items.length / 3);
  const rows: T[][] = [];
  for (let i = 0; i < 3; i++) {
    const chunk = items.slice(i * perRow, (i + 1) * perRow);
    if (chunk.length) rows.push(chunk);
  }
  return rows;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect
}: CategorySelectorProps) {
  const rows = splitIntoThreeRows(categories);

  return (
    <div className="space-y-3 py-1">
      {/* Mobile Select Dropdown (visible on small screens for quick selection) */}
      <div className="sm:hidden w-full">
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 pr-10 text-sm font-light text-slate-700 shadow-sm transition-all focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || (c as any).label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Multi-Row Pills */}
      <div className="hidden sm:block space-y-3">
        {rows.map((rowItems, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {rowItems.map((category) => {
              const isActive = category.id === selectedCategory;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className={[
                    "whitespace-nowrap rounded-full border px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-light tracking-[0.01em] transition-all duration-300 active:scale-[0.96]",
                    isActive
                      ? "border-ink bg-ink text-white shadow-[0_8px_22px_rgba(17,24,39,0.16)]"
                      : "border-slate-200 bg-white/90 text-slate-600 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-white hover:text-ink hover:shadow-[0_4px_16px_rgba(17,24,39,0.04)]"
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {category.name || (category as any).label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import type { WigCategory } from "@/lib/wigs";

type CategorySelectorProps = {
  categories: WigCategory[];
  selectedCategory: WigCategory["id"];
  onSelect: (category: WigCategory["id"]) => void;
};

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect
}: CategorySelectorProps) {
  const currentCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];
  const currentName = currentCategoryObj?.name || (currentCategoryObj as any)?.label || "Категория";

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between py-1 border-b border-slate-100 pb-3.5">
      {/* Sleek Compact Custom Dropdown */}
      <div className="relative w-full sm:w-72">
        <select
          value={selectedCategory}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-xs transition-all hover:border-ink/30 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || (c as any).label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
          <svg className="h-4 w-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Horizontal Scroll Quick-Filter Chips (Single Row) */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1">
        {categories.slice(0, 5).map((category) => {
          const isActive = category.id === selectedCategory;
          const name = category.name || (category as any).label;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-light tracking-[0.01em] transition-all duration-200 active:scale-95",
                isActive
                  ? "border-ink bg-ink text-white shadow-xs"
                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-ink"
              ].join(" ")}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
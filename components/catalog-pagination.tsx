"use client";

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function CatalogPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row border-t border-slate-100">
      <div className="text-xs font-light text-slate-500">
        Показано <span className="font-medium text-slate-700">{startItem}–{endItem}</span> из{" "}
        <span className="font-medium text-slate-700">{totalItems}</span> товаров
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={[
            "inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-light tracking-wide transition-all duration-200 active:scale-95",
            currentPage === 1
              ? "cursor-not-allowed text-slate-300"
              : "text-slate-600 hover:bg-slate-100 hover:text-ink"
          ].join(" ")}
          aria-label="Предыдущая страница"
        >
          ← Назад
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400 select-none">
                  ...
                </span>
              );
            }

            const isActive = p === currentPage;

            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-200 active:scale-95",
                  isActive
                    ? "bg-ink text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={[
            "inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-light tracking-wide transition-all duration-200 active:scale-95",
            currentPage === totalPages
              ? "cursor-not-allowed text-slate-300"
              : "text-slate-600 hover:bg-slate-100 hover:text-ink"
          ].join(" ")}
          aria-label="Следующая страница"
        >
          Далее →
        </button>
      </div>
    </div>
  );
}

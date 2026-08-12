"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CategorySelector } from "@/components/category-selector";
import { StepProgressHeader } from "@/components/step-progress-header";
import { CatalogPagination } from "@/components/catalog-pagination";
import { ResultPanel } from "@/components/result-panel";
import { SelfieGuideCard } from "@/components/selfie-guide-card";
import { SelfieUploadControls } from "@/components/selfie-upload-controls";
import { WigOptionCard } from "@/components/wig-option-card";
import { CATALOG_API_ROUTE, GENERATE_API_ROUTE } from "@/lib/app-config";
import {
  fallbackCategories,
  fallbackWigOptions,
  type WigCategory,
  type WigOption
} from "@/lib/wigs";

type GenerateResponse = {
  success: boolean;
  mode: "mock" | "live";
  message: string;
  generatedImageUrl: string | null;
};

const PRODUCTS_PER_PAGE = 12;

function toRussianErrorMessage(message: string) {
  if (message.includes("Не выбран парик")) {
    return "Выберите парик.";
  }

  if (message.includes("Не загружено фото")) {
    return "Загрузите фото.";
  }

  if (message.includes("Выбранный парик не найден")) {
    return "Выбранный парик не найден.";
  }

  if (message.includes("GEMINI_API_KEY") || message.includes("OPENAI_API_KEY")) {
    return "Не найден API ключ в переменных окружения.";
  }

  if (message.includes("Quota exceeded") || message.includes("429")) {
    return "Превышена лимит-квота API (ошибка 429).";
  }

  if (message.includes("Не удалось получить ответ")) {
    return "Не удалось получить ответ от ИИ сервиса.";
  }

  if (message.includes("Не удалось выполнить примерку")) {
    return "Не удалось выполнить примерку.";
  }

  return message || "Произошла ошибка во время обработки.";
}

export function WigTryOnWidget() {
  const [categories, setCategories] = useState<WigCategory[]>(fallbackCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("156");
  const [products, setProducts] = useState<WigOption[]>(fallbackWigOptions);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedWigId, setSelectedWigId] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Fetch OpenCart categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);
        const res = await fetch(CATALOG_API_ROUTE);
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
          const hasWigs = json.data.some((c: WigCategory) => c.id === "156");
          setSelectedCategory(hasWigs ? "156" : json.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load OpenCart categories:", err);
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  // Fetch OpenCart products when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    async function loadProducts() {
      try {
        setIsProductsLoading(true);
        setCurrentPage(1);
        const res = await fetch(`${CATALOG_API_ROUTE}?categoryId=${selectedCategory}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load products for category:", selectedCategory, err);
      } finally {
        setIsProductsLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  const selectedWig = useMemo(
    () => (selectedWigId ? products.find((p) => p.id === selectedWigId) ?? null : null),
    [selectedWigId, products]
  );

  useEffect(() => {
    return () => {
      if (selfiePreviewUrl) {
        URL.revokeObjectURL(selfiePreviewUrl);
      }
    };
  }, [selfiePreviewUrl]);

  const handleSelectCategory = (categoryId: string) => {
    if (selectedCategory !== categoryId) {
      setSelectedWigId(null);
      setResultImageUrl(null);
      setStatusText("");
      setErrorText(null);
    }
    setSelectedCategory(categoryId);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectWig = (wigId: string) => {
    setSelectedWigId(wigId);
    setErrorText(null);
    setStatusText("");
  };

  const handleFileChange = (file: File | null) => {
    if (selfiePreviewUrl) {
      URL.revokeObjectURL(selfiePreviewUrl);
    }

    setSelfieFile(file);
    setErrorText(null);
    setResultImageUrl(null);

    if (!file) {
      setSelfiePreviewUrl(null);
      setStatusText("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelfiePreviewUrl(previewUrl);
    setStatusText("");
  };

  const isSubmitDisabled = !selectedWig || !selfieFile || isLoading;

  const handleGenerate = async () => {
    if (!selectedWig || !selfieFile || !selfiePreviewUrl) {
      return;
    }

    setIsLoading(true);
    setErrorText(null);
    setResultImageUrl(null);
    setStatusText("Генерируем примерку...");

    try {
      const formData = new FormData();
      formData.append("wigId", selectedWig.id);
      formData.append("wigName", selectedWig.name);
      formData.append("wigImageSrc", selectedWig.imageSrc);
      formData.append("selfie", selfieFile);

      const response = await fetch(GENERATE_API_ROUTE, {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as GenerateResponse & {
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Не удалось выполнить примерку.");
      }

      setResultImageUrl(payload.generatedImageUrl);
      setStatusText(`Примерка готова для варианта «${selectedWig.name}».`);
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? toRussianErrorMessage(error.message)
          : "Произошла ошибка во время обработки."
      );
      setStatusText("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full">
      {/* 100% Fixed Viewport Progress Header */}
      <StepProgressHeader
        hasSelfie={Boolean(selfieFile)}
        hasWig={Boolean(selectedWig)}
        hasResult={Boolean(resultImageUrl)}
      />

      {/* Background Ambient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.97),transparent_58%),radial-gradient(circle_at_top_right,rgba(221,232,243,0.5),transparent_34%)]" />
        <div className="absolute left-[-140px] top-[16%] h-[320px] w-[320px] rounded-full bg-white/55 blur-3xl animate-float-ambient" />
        <div className="absolute right-[-150px] top-[8%] h-[340px] w-[340px] rounded-full bg-slate-200/35 blur-3xl animate-float-ambient-reverse" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col gap-6 px-4 py-8 sm:gap-7 sm:px-6 sm:py-10 lg:gap-8 lg:px-8 lg:py-12 xl:px-10">
        <header className="space-y-3 pt-12 sm:pt-14 text-center animate-fade-in-up">
          <h1 className="text-[38px] font-extralight tracking-[-0.055em] text-ink sm:text-[48px] lg:text-[54px]">
            Примерка парика
          </h1>
          <p className="text-sm font-light text-slate-500 sm:text-[15px]">
            Загрузите селфи и выберите парик из каталога для примерки с ИИ
          </p>
        </header>

        {/* Step 1: Selfie Upload Section */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:gap-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <SelfieGuideCard />
          <SelfieUploadControls
            fileName={selfieFile?.name ?? null}
            hasFile={Boolean(selfieFile)}
            disabled={isLoading}
            onFileChange={handleFileChange}
          />
        </div>

        {/* UNIFIED STUDIO WORKSPACE: Left = Wig Catalog, Right = Interactive Result Studio */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {/* Left Column: Wig Catalog (7 Cols) */}
          <section
            ref={catalogSectionRef}
            className="lg:col-span-7 flex flex-col justify-between rounded-[34px] border border-white/75 bg-white/80 p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)] backdrop-blur-xl sm:p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-light tracking-[-0.03em] text-ink sm:text-[24px]">
                  Каталог париков ({products.length})
                </h2>
                {isProductsLoading && (
                  <span className="text-xs text-slate-400 animate-pulse">
                    Загрузка каталога...
                  </span>
                )}
              </div>

              {isCategoriesLoading ? (
                <div className="flex gap-2">
                  <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
                </div>
              ) : (
                <CategorySelector
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={handleSelectCategory}
                />
              )}

              {isProductsLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-[240px] rounded-[24px] bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  В этой категории пока нет доступных товаров.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {paginatedProducts.map((wig) => (
                    <WigOptionCard
                      key={wig.id}
                      wig={wig}
                      isSelected={selectedWig?.id === wig.id}
                      onSelect={handleSelectWig}
                    />
                  ))}
                </div>
              )}
            </div>

            {products.length > 0 && !isProductsLoading && (
              <div className="mt-4 pt-2">
                <CatalogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={products.length}
                  pageSize={PRODUCTS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </section>

          {/* Right Column: Studio Result Mirror (5 Cols) */}
          <div className="lg:col-span-5">
            <ResultPanel
              isLoading={isLoading}
              resultImageUrl={resultImageUrl}
              selectedWig={selectedWig}
              statusText={statusText}
              errorText={errorText}
              isActionDisabled={isSubmitDisabled}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      </div>

      {/* Floating Logo Watermark */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-10 opacity-60 mix-blend-multiply sm:bottom-6 sm:left-6">
        <Image
          src="/logo/dom-volos.png"
          alt="DOM VOLOS"
          width={164}
          height={42}
          className="h-auto w-[110px] sm:w-[148px]"
        />
      </div>
    </section>
  );
}
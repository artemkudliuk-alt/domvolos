import { NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENCART_API_BASE_URL =
  process.env.OPENCART_API_BASE_URL || "https://odomvolos.devpro.agency/index.php";
const OPENCART_API_KEY =
  process.env.OPENCART_API_KEY || "a0gNm42gAbMXfLMpFNZynOot1Dv9YhpmfxYXRPZtjKPGARPo";

const FALLBACK_IMAGES = [
  "/wigs/rusye/rusye-1.png",
  "/wigs/rusye/rusye-2.png",
  "/wigs/rusye/rusye-3.png",
  "/wigs/blond/blond-1.png",
  "/wigs/blond/blond-2.png",
  "/wigs/blond/blond-3.png",
  "/wigs/blond/blond-4.png",
  "/wigs/brunet/brunet-1.png",
  "/wigs/brunet/brunet-2.png",
  "/wigs/ruzhie/ruzhie-1.png"
];

// Simple in-memory cache to make catalog load INSTANT (5 min TTL)
let categoriesCache: { data: any[]; timestamp: number } | null = null;
const productCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getFallbackImage(productId: number | string): string {
  const idNum = typeof productId === "number" ? productId : parseInt(productId, 10) || 0;
  const index = Math.abs(idNum) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}

async function getCategoryProductCount(categoryId: string | number): Promise<number> {
  try {
    const url = `${OPENCART_API_BASE_URL}?route=api/tryon/products&category_id=${categoryId}&page=1&limit=1`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${OPENCART_API_KEY}`,
        "Content-Type": "application/json"
      },
      next: { revalidate: 300 }
    });
    if (!response.ok) return 0;
    const json = await response.json();
    return json.success && typeof json.total === "number" ? json.total : 0;
  } catch {
    return 0;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  try {
    if (categoryId) {
      const now = Date.now();
      const cached = productCache.get(categoryId);
      if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        return NextResponse.json({
          success: true,
          total: cached.data.length,
          data: cached.data
        });
      }

      const url = `${OPENCART_API_BASE_URL}?route=api/tryon/products&category_id=${categoryId}&page=1&limit=100`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${OPENCART_API_KEY}`,
          "Content-Type": "application/json"
        },
        next: { revalidate: 300 }
      });

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: `OpenCart API status ${response.status}` },
          { status: response.status }
        );
      }

      const json = await response.json();

      if (!json.success || !Array.isArray(json.data)) {
        return NextResponse.json(
          { success: false, error: "Invalid product data from OpenCart API" },
          { status: 502 }
        );
      }

      const products = json.data.map((p: any) => {
        const hasRealImage = Boolean(p.image && p.image.trim() !== "");
        return {
          id: String(p.product_id),
          name: p.name,
          price: p.price ? `${parseFloat(p.price).toFixed(2)} $` : null,
          special: p.special ? `${parseFloat(p.special).toFixed(2)} $` : null,
          imageSrc: hasRealImage ? p.image : getFallbackImage(p.product_id),
          isFallbackImage: !hasRealImage,
          categoryIds: p.category_ids || [],
          href: p.href || null
        };
      });

      productCache.set(categoryId, { data: products, timestamp: Date.now() });

      return NextResponse.json({
        success: true,
        total: json.total || products.length,
        page: json.page || 1,
        pages: json.pages || 1,
        data: products
      });
    } else {
      const now = Date.now();
      if (categoriesCache && now - categoriesCache.timestamp < CACHE_TTL_MS) {
        return NextResponse.json({
          success: true,
          total: categoriesCache.data.length,
          data: categoriesCache.data
        });
      }

      const url = `${OPENCART_API_BASE_URL}?route=api/tryon/categories`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${OPENCART_API_KEY}`,
          "Content-Type": "application/json"
        },
        next: { revalidate: 300 }
      });

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: `OpenCart API status ${response.status}` },
          { status: response.status }
        );
      }

      const json = await response.json();

      if (!json.success || !Array.isArray(json.data)) {
        return NextResponse.json(
          { success: false, error: "Invalid category data from OpenCart API" },
          { status: 502 }
        );
      }

      // Filter out empty categories
      const categoryCounts = await Promise.all(
        json.data.map(async (c: any) => {
          const count = await getCategoryProductCount(c.category_id);
          return { category: c, count };
        })
      );

      const nonEmptyCategories = categoryCounts
        .filter(({ count }) => count > 0)
        .map(({ category: c }) => ({
          id: String(c.category_id),
          parentId: c.parent_id ? String(c.parent_id) : "0",
          name: c.name,
          sortOrder: c.sort_order || 0,
          image: c.image || null,
          href: c.href || null
        }));

      categoriesCache = { data: nonEmptyCategories, timestamp: Date.now() };

      return NextResponse.json({
        success: true,
        total: nonEmptyCategories.length,
        data: nonEmptyCategories
      });
    }
  } catch (error) {
    console.error("Error in catalog API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error"
      },
      { status: 500 }
    );
  }
}

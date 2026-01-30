import { Suspense } from "react";
import { StoreFilters } from "@/components/store-filters";
import { ProductGrid } from "@/components/store/product-grid";
import { getStoreStats } from "@/lib/store/queries";
import { StoreProductGridSkeleton } from "@/components/loading-skeleton";

export default async function StorePage({
  searchParams,
}: {
  // Type Definition
  searchParams: Promise<{
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string;
  }>;
}) {
  // Fetch Cached Stats
  const { priceRange, counts } = await getStoreStats();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <div className="relative z-10">
        {/* HERO HEADER */}
        <section className="pt-32 pb-12 px-6 lg:px-8 border-b border-border bg-background/50 backdrop-blur-sm"></section>

        {/* MAIN CONTENT */}
        <section className="py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="h-20 bg-muted animate-pulse rounded-xl mb-8" />
              }
            >
              <StoreFilters priceRange={priceRange} counts={counts} />
            </Suspense>

            <div className="mt-8">
              <Suspense fallback={<StoreProductGridSkeleton />}>
                <ProductGrid searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

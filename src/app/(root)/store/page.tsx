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
        <section className="pt-32 pb-12 px-6 lg:px-8 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Digital Marketplace
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground mb-3">
              Premium Digital Assets
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of high-quality digital products.
            </p>
          </div>
        </section>

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

import { ProductCard } from "@/components/product-card";
import { Hero } from "@/components/hero";
import { FeaturesSection } from "@/components/feature";
import { Suspense } from "react";
import {
  HeroSkeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
} from "@/components/loading-skeleton";
import { getTopSellingProducts } from "@/lib/data/topSellingProducts";

// Skeleton
function TopSellingProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="aspect-video bg-secondary/50 animate-pulse" />

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="h-6 w-3/4 bg-secondary/50 rounded animate-pulse" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-secondary/30 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-secondary/30 rounded animate-pulse" />
            </div>

            {/* Price and button */}
            <div className="flex items-center justify-between pt-4">
              <div className="h-8 w-24 bg-secondary/50 rounded animate-pulse" />
              <div className="h-10 w-28 bg-secondary/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Top Selling Products Function
async function TopSellingProducts() {
  const topSellingProducts = await getTopSellingProducts();
  return (
    <>
      {topSellingProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border bg-card/50">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-card rounded-full border border-border">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Inventory Empty
          </h3>
          <p className="text-muted-foreground">
            The vault is currently being restocked. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<ProductGridSkeleton />}>
            {topSellingProducts.map((product) => (
              <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
                <ProductCard product={product} />
              </Suspense>
            ))}
          </Suspense>
        </div>
      )}
    </>
  );
}

// Root Page
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-200 w-200 rounded-full bg-purple-900/20 blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] h-200 w-200 rounded-full bg-indigo-900/20 blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] invert-0" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <div className="relative border-b border-border bg-background/50 backdrop-blur-sm">
          <Suspense fallback={<HeroSkeleton />}>
            <Hero />
          </Suspense>
        </div>

        {/* PRODUCTS SECTION */}
        <section id="browse" className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center mb-16 animate-in fade-in duration-700">
              <span className="mb-4 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Most Popular
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-foreground via-muted-foreground to-muted mb-6">
                Top Selling Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                Our best-performing digital assets loved by creators worldwide.
              </p>
            </div>

            {/* Products Grid */}
            <Suspense fallback={<TopSellingProductsSkeleton />}>
              <TopSellingProducts />
            </Suspense>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <FeaturesSection />
      </div>
    </div>
  );
}

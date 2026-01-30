import { getFilteredProducts } from "@/lib/store/queries";
import { ProductCard } from "@/components/product-card";
import { Suspense } from "react";
import { ProductCardSkeleton } from "../loading-skeleton";

export async function ProductGrid({ searchParams }: { searchParams: any }) {
  const params = await searchParams;

  const allProducts = await getFilteredProducts(params);
  const search = params?.search;

  // Results Info
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {allProducts.length}
          </span>{" "}
          {allProducts.length === 1 ? "asset" : "assets"}
          {search && (
            <>
              {" "}
              for{" "}
              <span className="font-medium text-foreground">
                &quot;{search}&quot;
              </span>
            </>
          )}
        </p>
      </div>

      {allProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border bg-card/50">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            No Assets Found
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Suspense fallback={<ProductCardSkeleton />}>
                <ProductCard product={product} />
              </Suspense>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

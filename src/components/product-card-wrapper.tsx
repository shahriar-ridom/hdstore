"use client";

import { useState, lazy, Suspense } from "react";
import type { Product } from "./product-card";

// Lazy load the dialog - it's only needed when user clicks
const ProductDetailDialog = lazy(() =>
  import("./product-detail-dialog").then((mod) => ({
    default: mod.ProductDetailDialog,
  })),
);

interface ProductCardWrapperProps {
  product: Product;
  children: React.ReactNode;
}

export function ProductCardWrapper({
  product,
  children,
}: ProductCardWrapperProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:border-ring/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
        onClick={() => setShowDialog(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowDialog(true);
          }
        }}
      >
        {children}
      </div>

      {showDialog && (
        <Suspense fallback={null}>
          <ProductDetailDialog
            product={product}
            open={showDialog}
            onClose={() => setShowDialog(false)}
          />
        </Suspense>
      )}
    </>
  );
}

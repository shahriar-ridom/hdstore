export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Title */}
          <div className="h-7 w-3/4 rounded-lg bg-secondary/50 mb-3" />

          {/* Description Lines */}
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full rounded-md bg-secondary/30" />
            <div className="h-4 w-5/6 rounded-md bg-secondary/30" />
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="space-y-2">
            {/* Price Label */}
            <div className="h-3 w-16 rounded bg-secondary/30" />
            {/* Price Value */}
            <div className="h-6 w-20 rounded-md bg-secondary/50" />
          </div>
          {/* Action Button */}
          <div className="h-10 w-28 rounded-full bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

export function StoreProductGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 rounded bg-muted animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505] pt-20">
      {/* Background Placeholder */}
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center animate-pulse">
          {/* System Badge Skeleton */}
          <div className="mb-8 h-8 w-48 rounded-full bg-white/5 border border-white/5" />

          {/* Headline Skeleton */}
          <div className="mb-4 h-14 md:h-20 w-3/4 rounded-3xl bg-white/10" />
          <div className="mb-8 h-14 md:h-20 w-1/2 rounded-3xl bg-white/10" />

          {/* Subtext Skeleton */}
          <div className="mb-3 h-5 w-2/3 rounded-lg bg-white/5" />
          <div className="mb-12 h-5 w-1/2 rounded-lg bg-white/5" />

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            {/* Primary Pill Button */}
            <div className="h-14 w-44 rounded-full bg-white/20" />
            {/* Secondary Pill Button */}
            <div className="h-14 w-44 rounded-full bg-white/5 border border-white/5" />
          </div>

          {/* HUD Stats Grid Skeleton */}
          <div className="w-full max-w-4xl opacity-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-6 bg-[#050505]"
                >
                  <div className="mb-2 h-3 w-16 rounded bg-white/10" />
                  <div className="h-8 w-16 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OrderHeaderSkeleton() {
  return (
    <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 w-48 bg-secondary/50 rounded" />
        <div className="h-10 w-64 bg-secondary/50 rounded" />
        <div className="h-6 w-80 bg-secondary/50 rounded" />
      </div>
      <div className="h-16 w-64 bg-secondary/50 rounded-full" />
    </div>
  );
}

export function OrdersGridSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-3xl border border-border bg-card p-4 animate-pulse"
        >
          <div className="aspect-video w-full bg-secondary/50 rounded-2xl mb-5" />
          <div className="space-y-3 px-2">
            <div className="h-6 w-3/4 bg-secondary/50 rounded" />
            <div className="h-4 w-1/2 bg-secondary/50 rounded" />
          </div>
          <div className="mt-6 border-t border-border pt-4 px-2">
            <div className="flex justify-between items-center">
              <div className="h-4 w-16 bg-secondary/50 rounded" />
              <div className="h-9 w-24 bg-secondary/50 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CustomerTableSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/50 animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-secondary/50 rounded animate-pulse mb-1" />
            <div className="h-4 w-32 bg-secondary/30 rounded animate-pulse mb-1" />
            <div className="h-3 w-28 bg-secondary/20 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserDataSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6">
          {/* Customer Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-12 w-12 rounded-full bg-secondary/50 animate-pulse shrink-0" />
              <div className="space-y-2">
                {/* Name */}
                <div className="h-5 w-32 bg-secondary/50 rounded animate-pulse" />
                {/* Email */}
                <div className="h-4 w-48 bg-secondary/30 rounded animate-pulse" />
                {/* Joined date */}
                <div className="h-3 w-28 bg-secondary/20 rounded animate-pulse" />
              </div>
            </div>

            {/* Customer Stats Skeleton */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="h-8 w-12 bg-secondary/50 rounded animate-pulse mb-1 mx-auto" />
                <div className="h-3 w-16 bg-secondary/30 rounded animate-pulse" />
              </div>
              <div className="text-center">
                <div className="h-8 w-20 bg-secondary/50 rounded animate-pulse mb-1 mx-auto" />
                <div className="h-3 w-20 bg-secondary/30 rounded animate-pulse" />
              </div>
              <div className="text-center hidden sm:block">
                <div className="h-5 w-24 bg-secondary/50 rounded animate-pulse mb-1 mx-auto" />
                <div className="h-3 w-20 bg-secondary/30 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Purchases List Skeleton */}
          <div className="mt-4 pl-16">
            <div className="h-3 w-32 bg-secondary/30 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              {[...Array(2)].map((_, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary/50 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-secondary/50 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-secondary/30 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-secondary/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

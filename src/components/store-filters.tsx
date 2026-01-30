"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/debouncer";

interface StoreFiltersProps {
  priceRange: {
    min: number;
    max: number;
  };
  counts: {
    total: number;
    available: number;
    unavailable: number;
  };
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
];

export function StoreFilters({ priceRange, counts }: StoreFiltersProps) {
  const [isPending, startTransition] = useTransition();

  // URL STATE MANAGERS
  const [searchParam, setSearchParam] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  });

  const [sortParam, setSortParam] = useQueryState("sort", {
    defaultValue: "newest",
    shallow: false,
  });

  const [minPriceParam, setMinPriceParam] = useQueryState(
    "minPrice",
    parseAsInteger.withOptions({ shallow: false }),
  );

  const [maxPriceParam, setMaxPriceParam] = useQueryState(
    "maxPrice",
    parseAsInteger.withOptions({ shallow: false }),
  );

  const [availabilityParam, setAvailabilityParam] = useQueryState(
    "availability",
    { defaultValue: "all", shallow: false },
  );

  // LOCAL UI STATE
  const [localSearch, setLocalSearch] = useState(searchParam);
  const [localMinPrice, setLocalMinPrice] = useState(
    minPriceParam?.toString() || "",
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    maxPriceParam?.toString() || "",
  );
  const [showFilters, setShowFilters] = useState(false);

  // DEBOUNCERS
  const debouncedSearch = useDebounce(localSearch, 300);
  const debouncedMinPrice = useDebounce(localMinPrice, 400);
  const debouncedMaxPrice = useDebounce(localMaxPrice, 400);

  // Sync Search
  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      startTransition(() => {
        setSearchParam(debouncedSearch || null);
      });
    }
  }, [debouncedSearch, searchParam, setSearchParam]);

  // Sync Min Price
  useEffect(() => {
    const val = debouncedMinPrice ? parseInt(debouncedMinPrice) : null;
    if (val !== minPriceParam) {
      startTransition(async () => {
        await setMinPriceParam(val);
      });
    }
  }, [debouncedMinPrice, minPriceParam, setMinPriceParam]);

  // Sync Max Price
  useEffect(() => {
    const val = debouncedMaxPrice ? parseInt(debouncedMaxPrice) : null;
    if (val !== maxPriceParam) {
      startTransition(async () => {
        await setMaxPriceParam(val);
      });
    }
  }, [debouncedMaxPrice, maxPriceParam, setMaxPriceParam]);

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParam(localSearch || null);
  };

  const clearFilters = () => {
    setLocalSearch("");
    setLocalMinPrice("");
    setLocalMaxPrice("");

    // Batch updates to URL
    startTransition(async () => {
      await setSearchParam(null);
      await setMinPriceParam(null);
      await setMaxPriceParam(null);
      await setAvailabilityParam(null);
      await setSortParam(null);
    });
  };

  // Derived state for UI
  const hasActiveFilters =
    searchParam ||
    minPriceParam ||
    maxPriceParam ||
    availabilityParam !== "all" ||
    sortParam !== "newest";

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search assets..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary"
            />
          </div>
          <Button
            type="submit"
            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground! hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Search"
            )}
          </Button>
        </form>

        <div className="flex gap-2">
          <select
            value={sortParam || "newest"}
            onChange={(e) => setSortParam(e.target.value)}
            className="h-11 px-4 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-card"
              >
                {option.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 rounded-xl border-border ${
              showFilters ? "bg-secondary" : ""
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                Price Range
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder={priceRange.min.toString()}
                    min={0}
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="pl-7 h-10 rounded-lg bg-secondary/30"
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder={priceRange.max.toString()}
                    min={0}
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="pl-7 h-10 rounded-lg bg-secondary/30"
                  />
                </div>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                Availability
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All", count: counts.total },
                  {
                    value: "available",
                    label: "Available",
                    count: counts.available,
                  },
                  {
                    value: "unavailable",
                    label: "Unavailable",
                    count: counts.unavailable,
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAvailabilityParam(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      (availabilityParam || "all") === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {option.label}
                    <span className="ml-1.5 opacity-70">({option.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Actions */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Actions
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full h-10 rounded-lg border-border hover:bg-secondary disabled:opacity-50"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchParam && (
            <FilterTag
              label={`Search: "${searchParam}"`}
              onRemove={() => {
                setLocalSearch("");
                setSearchParam(null);
              }}
            />
          )}
          {minPriceParam !== null && (
            <FilterTag
              label={`Min: $${minPriceParam}`}
              onRemove={() => {
                setLocalMinPrice("");
                setMinPriceParam(null);
              }}
            />
          )}
          {maxPriceParam !== null && (
            <FilterTag
              label={`Max: $${maxPriceParam}`}
              onRemove={() => {
                setLocalMaxPrice("");
                setMaxPriceParam(null);
              }}
            />
          )}
          {availabilityParam && availabilityParam !== "all" && (
            <FilterTag
              label={`Status: ${availabilityParam}`}
              onRemove={() => setAvailabilityParam(null)}
            />
          )}
          {sortParam && sortParam !== "newest" && (
            <FilterTag
              label={`Sort: ${sortOptions.find((o) => o.value === sortParam)?.label}`}
              onRemove={() => setSortParam(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm text-foreground">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:text-destructive transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}

import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, asc, eq, ilike, and, gte, lte, sql } from "drizzle-orm";
import { cacheLife } from 'next/cache';

// CACHED STATS
export async function getStoreStats() {
  'use cache'
  cacheLife('hours')

  console.log("Fetching store stats (Cached)...");

  // Get price range
  const priceStats = await db
    .select({
      minPrice: sql<number>`MIN(${products.priceInCents})`,
      maxPrice: sql<number>`MAX(${products.priceInCents})`,
    })
    .from(products);

  const priceRange = {
    min: Math.floor((priceStats[0]?.minPrice || 0) / 100),
    max: Math.ceil((priceStats[0]?.maxPrice || 10000) / 100),
  };

  // Get counts
  const [totalCount, availableCount, unavailableCount] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(products),
    db.select({ count: sql<number>`COUNT(*)` }).from(products).where(eq(products.isAvailable, true)),
    db.select({ count: sql<number>`COUNT(*)` }).from(products).where(eq(products.isAvailable, false)),
  ]);

  const counts = {
    total: Number(totalCount[0]?.count || 0),
    available: Number(availableCount[0]?.count || 0),
    unavailable: Number(unavailableCount[0]?.count || 0),
  };

  return { priceRange, counts };
}

// DYNAMIC PRODUCTS
export async function getFilteredProducts(params: {
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
}) {
  const search = params.search || "";
  const sort = params.sort || "newest";
  const minPrice = params.minPrice ? parseInt(params.minPrice) * 100 : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) * 100 : undefined;
  const availability = params.availability || "all";

  const conditions = [];

  if (search) conditions.push(ilike(products.name, `%${search}%`));
  if (minPrice !== undefined) conditions.push(gte(products.priceInCents, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(products.priceInCents, maxPrice));
  if (availability === "available") {
    conditions.push(eq(products.isAvailable, true));
  } else if (availability === "unavailable") {
    conditions.push(eq(products.isAvailable, false));
  }

  let orderBy;
  switch (sort) {
    case "oldest": orderBy = asc(products.createdAt); break;
    case "price-low": orderBy = asc(products.priceInCents); break;
    case "price-high": orderBy = desc(products.priceInCents); break;
    case "name-az": orderBy = asc(products.name); break;
    case "name-za": orderBy = desc(products.name); break;
    case "newest": default: orderBy = desc(products.createdAt);
  }

  return await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy);
}

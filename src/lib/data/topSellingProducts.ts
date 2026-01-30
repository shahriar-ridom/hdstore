import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getTopSellingProducts() {
  "use cache";
  cacheTag("top-selling-products");
  cacheLife("hours");

  const topSellingProducts = await db
    .select({
      id: products.id,
      name: products.name,
      priceInCents: products.priceInCents,
      description: products.description,
      filePath: products.filePath,
      imagePath: products.imagePath,
      isAvailable: products.isAvailable,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      salesCount: count(orders.id),
    })
    .from(products)
    .leftJoin(orders, eq(products.id, orders.productId))
    .where(eq(products.isAvailable, true))
    .groupBy(products.id)
    .orderBy(desc(count(orders.id)))
    .limit(3);
  return topSellingProducts;
}

import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";

export async function getUserOrders(userId: string) {
  "use cache";

  cacheTag(`user-orders-${userId}`);
  cacheLife("hours");

  return await db
    .select({
      orderId: orders.id,
      pricePaid: orders.pricePaidInCents,
      createdAt: orders.createdAt,
      productName: products.name,
      productDesc: products.description,
      imagePath: products.imagePath,
      productId: products.id,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

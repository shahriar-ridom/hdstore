"use server";

import { db } from "@/db";
import { downloadVerifications, orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createDownloadLink(orderId: string) {
  // Auth Check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(and(
      eq(orders.id, orderId),
      eq(orders.userId, session.user.id)
    ))
    .limit(1);

  if (!order) {
    return { error: "Order not found or access denied" };
  }

  const [verification] = await db
    .insert(downloadVerifications)
    .values({
      productId: order.productId,
    })
    .returning({ id: downloadVerifications.id });

  redirect(`/api/download/${verification.id}`);
}

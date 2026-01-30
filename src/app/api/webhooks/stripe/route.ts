import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return new NextResponse("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: unknown) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // Handle fulfillment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const productIdRaw = session.metadata?.productId;
    const paymentIntentId = session.payment_intent as string;
    const totalAmount = session.amount_total;

    // Better Validation
    if (!userId || !productIdRaw || !totalAmount || !paymentIntentId) {
      return new NextResponse("Missing Metadata", { status: 400 });
    }

    const productId = parseInt(productIdRaw);
    if (isNaN(productId)) {
      return new NextResponse("Invalid Product ID", { status: 400 });
    }

    try {
      // Idempotency Check using Drizzle query API
      const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.stripePaymentIntentId, paymentIntentId),
      });

      if (existingOrder) {
        return new NextResponse("Order already processed", { status: 200 });
      }

      // Database Transaction
      await db.insert(orders).values({
        userId,
        productId,
        pricePaidInCents: totalAmount,
        stripePaymentIntentId: paymentIntentId,
      });

      // Only revalidate if we actually updated the database
      revalidatePath("/orders");
      revalidateTag("admin-dashboard", "max");
      revalidateTag("admin-orders", "max");

      console.log(`✅ Order ${paymentIntentId} fulfilled.`);
    } catch (error) {
      console.error("DB Error:", error);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse("Success", { status: 200 });
}

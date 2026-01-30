"use cache";
import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { count, sum, desc, eq, sql } from "drizzle-orm";
import { cacheTag, cacheLife } from "next/cache";

export async function getAdminOrdersData() {
  cacheTag("admin-orders");
  cacheLife("minutes");

  const [
    totalRevenueResult,
    totalOrdersResult,
    avgOrderValueResult,
    allOrdersList,
    revenueByProductList,
    dailySalesData,
  ] = await Promise.all([
    // Total Revenue
    db.select({ total: sum(orders.pricePaidInCents) }).from(orders),
    // Total Orders
    db.select({ count: count() }).from(orders),
    // Average Order Value
    db
      .select({
        avg: sql<number>`ROUND(AVG(${orders.pricePaidInCents}))`,
      })
      .from(orders),
    // All Orders
    db
      .select({
        orderId: orders.id,
        pricePaid: orders.pricePaidInCents,
        createdAt: orders.createdAt,
        stripePaymentIntentId: orders.stripePaymentIntentId,
        productId: products.id,
        productName: products.name,
        userId: users.id,
        userEmail: users.email,
        userName: users.name,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt)),
    // Revenue by Product
    db
      .select({
        productId: products.id,
        productName: products.name,
        salesCount: count(orders.id),
        totalRevenue: sum(orders.pricePaidInCents),
      })
      .from(products)
      .innerJoin(orders, eq(products.id, orders.productId))
      .groupBy(products.id)
      .orderBy(desc(sum(orders.pricePaidInCents))),
    // Daily Sales
    db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        count: count(),
        revenue: sum(orders.pricePaidInCents),
      })
      .from(orders)
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(desc(sql`DATE(${orders.createdAt})`))
      .limit(7),
  ]);

  return {
    totalRevenue: Number(totalRevenueResult[0]?.total ?? 0),
    totalOrders: totalOrdersResult[0]?.count ?? 0,
    avgOrderValue: Number(avgOrderValueResult[0]?.avg ?? 0),
    allOrdersList,
    revenueByProductList,
    dailySalesData,
  };
}

export async function getAdminProductsData() {
  cacheTag("admin-products");
  cacheLife("minutes");

  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      priceInCents: products.priceInCents,
      isAvailable: products.isAvailable,
      ordersCount: count(orders.id),
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(orders, eq(products.id, orders.productId))
    .groupBy(products.id)
    .orderBy(desc(products.createdAt));

  return productList;
}

export async function getAdminUsersData() {
  cacheTag("admin-users");
  cacheLife("minutes");

  const [totalCustomersResult, totalUsersResult, customerList] =
    await Promise.all([
      db
        .selectDistinct({ userId: orders.userId })
        .from(orders)
        .then((res) => res.length),
      db.select({ count: count() }).from(users),
      db
        .select({
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          userImage: users.image,
          userRole: users.role,
          userCreatedAt: users.createdAt,
          totalOrders: count(orders.id),
          totalSpent: sum(orders.pricePaidInCents),
          lastOrderDate: sql<Date>`MAX(${orders.createdAt})`,
        })
        .from(users)
        .leftJoin(orders, eq(users.id, orders.userId))
        .groupBy(users.id)
        .orderBy(desc(sum(orders.pricePaidInCents))),
    ]);

  const totalCustomers = totalCustomersResult;
  const totalUsers = totalUsersResult[0]?.count ?? 0;

  const customerPurchases = await Promise.all(
    customerList.map(async (customer) => {
      const purchases = await db
        .select({
          orderId: orders.id,
          productName: products.name,
          pricePaid: orders.pricePaidInCents,
          purchaseDate: orders.createdAt,
        })
        .from(orders)
        .innerJoin(products, eq(orders.productId, products.id))
        .where(eq(orders.userId, customer.userId))
        .orderBy(desc(orders.createdAt));
      return { ...customer, purchases };
    }),
  );
  return {
    totalCustomers,
    totalUsers,
    customerPurchases,
    customerList,
  };
}

export async function getAdminDashboardData() {
  cacheTag("admin-dashboard");
  cacheLife("minutes");

  const [
    totalRevenueResult,
    totalOrdersResult,
    totalProductsResult,
    totalCustomersResult,
    recentOrdersList,
    topProductsList,
  ] = await Promise.all([
    // Total Revenue
    db.select({ total: sum(orders.pricePaidInCents) }).from(orders),
    // Total Orders
    db.select({ count: count() }).from(orders),
    // Total Products
    db.select({ count: count() }).from(products),
    // Total Customers
    db
      .selectDistinct({ userId: orders.userId })
      .from(orders)
      .then((res) => res.length),
    // Recent Orders (last 5)
    db
      .select({
        orderId: orders.id,
        pricePaid: orders.pricePaidInCents,
        createdAt: orders.createdAt,
        productName: products.name,
        userEmail: users.email,
        userName: users.name,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5),
    // Top Products by sales
    db
      .select({
        productId: products.id,
        productName: products.name,
        salesCount: count(orders.id),
        totalRevenue: sum(orders.pricePaidInCents),
      })
      .from(products)
      .leftJoin(orders, eq(products.id, orders.productId))
      .groupBy(products.id)
      .orderBy(desc(count(orders.id)))
      .limit(5),
  ]);
  return {
    totalRevenueResult,
    totalOrdersResult,
    totalProductsResult,
    totalCustomersResult,
    recentOrdersList,
    topProductsList,
  };
}

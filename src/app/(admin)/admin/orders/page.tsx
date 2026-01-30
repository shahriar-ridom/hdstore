import { Suspense } from "react";
import { getAdminOrdersData } from "@/lib/data/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Utility Functions
function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

// ASYNC COMPONENT
async function DashboardContent() {
  const data = await getAdminOrdersData();
  const maxDailyRevenue = Math.max(
    ...data.dailySalesData.map((d) => Number(d.revenue ?? 0)),
    1,
  );

  const stats = [
    {
      name: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      description: "All-time earnings",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "from-emerald-500 to-green-600",
      bgGlow: "bg-emerald-500/20",
    },
    {
      name: "Total Orders",
      value: data.totalOrders.toString(),
      description: "Completed transactions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
    },
    {
      name: "Avg Order Value",
      value: formatCurrency(data.avgOrderValue),
      description: "Per transaction",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/20",
    },
    {
      name: "Products Sold",
      value: data.revenueByProductList.length.toString(),
      description: "Unique items",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      color: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/20",
    },
  ];

  return (
    <>
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative group rounded-2xl border border-border bg-card p-6 overflow-hidden transition-all hover:border-border/80 hover:shadow-xl animate-in zoom-in-95 duration-500"
          >
            <div
              className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${stat.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${stat.color} text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-heading font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground">{stat.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DAILY SALES CHART */}
        <div className="rounded-2xl border border-border bg-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h2 className="text-lg font-heading font-bold text-foreground mb-2">
            Recent Activity
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Last 7 days of sales
          </p>

          {data.dailySalesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...data.dailySalesData].reverse().map((day) => {
                const revenue = Number(day.revenue ?? 0);
                const percentage = (revenue / maxDailyRevenue) * 100;
                return (
                  <div key={day.date} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-mono">
                        {formatShortDate(day.date)}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-green-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REVENUE BY PRODUCT */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-heading font-bold text-foreground">
              Revenue by Product
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Performance breakdown by asset
            </p>
          </div>
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Product</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.revenueByProductList.map((product) => {
                const revenue = Number(product.totalRevenue ?? 0);
                const share =
                  data.totalRevenue > 0
                    ? ((revenue / data.totalRevenue) * 100).toFixed(1)
                    : "0";
                return (
                  <TableRow
                    key={product.productId}
                    className="border-border hover:bg-secondary/20"
                  >
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell>{product.salesCount}</TableCell>
                    <TableCell className="text-emerald-400">
                      {formatCurrency(revenue)}
                    </TableCell>
                    <TableCell>{share}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            All Transactions
          </h2>
        </div>
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.allOrdersList.map((order) => (
              <TableRow
                key={order.orderId}
                className="border-border hover:bg-secondary/20"
              >
                <TableCell className="font-mono text-xs">
                  {order.orderId.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {order.userName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.userEmail}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-emerald-400 font-semibold">
                  {formatCurrency(order.pricePaid)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

// LOADING STATE
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-card border border-border/50"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-64 rounded-2xl bg-card border border-border/50" />
        <div className="lg:col-span-2 h-64 rounded-2xl bg-card border border-border/50" />
      </div>
      <div className="h-96 rounded-2xl bg-card border border-border/50" />
    </div>
  );
}

// MAIN PAGE (Static Shell)
export default function AdminOrdersPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Revenue Stream Active
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Sales & Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive transaction analytics and order management.
          </p>
        </div>
      </div>

      {/* Dynamic Content Streams In */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

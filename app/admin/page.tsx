import { db } from "@/db";
import { products, orders, notifications } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import SeedButton from "@/components/SeedButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productStats, orderStats, recentOrders, recentNotifications, allProducts] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int`, inStock: sql<number>`count(*) filter (where in_stock)::int` }).from(products),
    db.select({ count: sql<number>`count(*)::int`, revenue: sql<number>`coalesce(sum(total),0)::int`, pending: sql<number>`count(*) filter (where status='pending')::int` }).from(orders),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
    db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(8),
    db.select().from(products),
  ]);

  const lowStock = allProducts.filter(p => (p.stock || 0) < 15);
  const p = productStats[0];
  const o = orderStats[0];

  const statusPill: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-violet-100 text-violet-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#E2452B]">Owner Control Center</div>
          <h1 className="font-display text-4xl mt-2">Namaste, Malik 🙏</h1>
          <p className="text-[#6E6A60] mt-1">Everything in your store, at a glance.</p>
        </div>
        <div className="flex gap-3">
          <SeedButton />
          <Link href="/admin/products" className="inline-flex items-center rounded-full bg-[#0B3B2C] px-6 py-3 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition">+ Add Product</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-[#E7E4DA]">
          <div className="text-xs uppercase tracking-widest text-[#6E6A60] font-bold">Products Live</div>
          <div className="font-display text-4xl mt-2">{p?.count ?? 0}</div>
          <div className="text-xs mt-2 text-[#0B3B2C] font-bold">{p?.inStock ?? 0} in stock</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#E7E4DA]">
          <div className="text-xs uppercase tracking-widest text-[#6E6A60] font-bold">Total Orders</div>
          <div className="font-display text-4xl mt-2">{o?.count ?? 0}</div>
          <div className="text-xs mt-2 text-amber-700 font-bold">{o?.pending ?? 0} pending action</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#E7E4DA]">
          <div className="text-xs uppercase tracking-widest text-[#6E6A60] font-bold">Revenue</div>
          <div className="font-display text-4xl mt-2">₹{o?.revenue ?? 0}</div>
          <div className="text-xs mt-2 text-[#0B3B2C] font-bold">All time</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-[#E7E4DA]">
          <div className="text-xs uppercase tracking-widest text-[#6E6A60] font-bold">Low Stock</div>
          <div className={`font-display text-4xl mt-2 ${lowStock.length > 0 ? "text-[#E2452B]" : ""}`}>{lowStock.length}</div>
          <Link href="/admin/products" className="text-xs mt-2 inline-block text-[#E2452B] font-bold">Restock →</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E7E4DA] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-[#0B3B2C] hover:underline">Manage all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#6E6A60] py-8 text-center">No orders yet — share your store link and orders will land here (with email + WhatsApp alerts).</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between gap-3 text-sm border-b border-dashed border-[#E7E4DA] last:border-0 pb-3 last:pb-0">
                  <div className="min-w-0">
                    <div className="font-bold truncate">{order.fullName} <span className="font-mono font-normal text-[11px] text-[#6E6A60]">{order.orderNo}</span></div>
                    <div className="text-xs text-[#6E6A60] truncate">{order.phone || order.email} • {order.items.length} item(s) • {order.paymentMethod?.toUpperCase()}</div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusPill[order.status || "pending"]}`}>{order.status}</span>
                    <span className="font-display text-lg">₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#E7E4DA] p-6">
          <h2 className="font-display text-xl mb-4">Notification Log</h2>
          <p className="text-[11px] text-[#6E6A60] mb-4 -mt-2">Email &amp; WhatsApp alerts sent to you for each order.</p>
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-[#6E6A60]">No notifications yet. Add SMTP / WhatsApp keys in .env to get alerted on new orders.</p>
          ) : (
            <div className="space-y-2.5">
              {recentNotifications.map(n => (
                <div key={n.id} className="flex items-start gap-2.5 text-xs rounded-xl bg-[#FBFAF6] border border-[#E7E4DA] px-3 py-2.5">
                  <span className="text-base leading-none">{n.channel === "whatsapp" ? "💬" : "📧"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold truncate">{n.subject}</div>
                    <div className="text-[#6E6A60]">{new Date(n.createdAt!).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${n.status === "sent" ? "bg-emerald-100 text-emerald-700" : n.status === "failed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{n.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

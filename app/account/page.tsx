import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-violet-100 text-violet-800 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const { tab } = await searchParams;
  const myOrders = await db
    .select()
    .from(orders)
    .where(or(eq(orders.userId, user.id), eq(orders.email, user.email)))
    .orderBy(desc(orders.createdAt));

  const activeTab = tab === "orders" ? "orders" : "profile";

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#F2A93B] font-bold">My Account</div>
          <h1 className="font-display text-4xl mt-2">Hi, {user.name.split(" ")[0]} 👋</h1>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-full border-2 border-[#E7E4DA] px-5 py-2 text-xs uppercase tracking-[0.2em] font-bold hover:border-red-300 hover:text-red-600 transition">Logout</button>
        </form>
      </div>

      <div className="flex gap-2 mb-8">
        <Link href="/account" className={`rounded-full px-5 py-2 text-sm font-bold ${activeTab === "profile" ? "bg-[#0B3B2C] text-white" : "bg-white border border-[#E7E4DA]"}`}>Profile</Link>
        <Link href="/account?tab=orders" className={`rounded-full px-5 py-2 text-sm font-bold ${activeTab === "orders" ? "bg-[#0B3B2C] text-white" : "bg-white border border-[#E7E4DA]"}`}>My Orders ({myOrders.length})</Link>
      </div>

      {activeTab === "profile" ? (
        <ProfileForm user={user} />
      ) : (
        <div className="space-y-5">
          {myOrders.length === 0 ? (
            <div className="bg-white border border-[#E7E4DA] rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="font-display text-xl">No orders yet</p>
              <p className="text-sm text-[#6E6A60] mt-1 mb-5">Your bags, gifts and trolleys will show up here.</p>
              <Link href="/shop" className="inline-flex rounded-full bg-[#F2A93B] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-bold text-black">Start Shopping</Link>
            </div>
          ) : (
            myOrders.map(o => {
              const stepIdx = STATUS_STEPS.indexOf((o.status as typeof STATUS_STEPS[number]) ?? "pending");
              const cancelled = o.status === "cancelled";
              return (
                <div key={o.id} className="bg-white border border-[#E7E4DA] rounded-3xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#E7E4DA] pb-4">
                    <div>
                      <div className="font-mono text-xs text-[#6E6A60]">{o.orderNo}</div>
                      <div className="font-bold">{new Date(o.createdAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${STATUS_COLOR[o.status || "pending"]}`}>{o.status}</span>
                      <span className="rounded-full bg-[#FBFAF6] border border-[#E7E4DA] px-3 py-1 text-[11px] uppercase tracking-widest">{o.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}</span>
                      <span className="font-display text-lg">₹{o.total}</span>
                    </div>
                  </div>

                  {!cancelled && (
                    <div className="mt-5 flex items-center gap-0">
                      {STATUS_STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`h-3.5 w-3.5 rounded-full border-2 ${i <= stepIdx ? "bg-[#0B3B2C] border-[#0B3B2C]" : "bg-white border-[#D8D4C8]"}`} />
                            <div className={`mt-1 text-[10px] uppercase tracking-widest ${i <= stepIdx ? "text-[#0B3B2C] font-bold" : "text-[#B5B1A5]"}`}>{s}</div>
                          </div>
                          {i < STATUS_STEPS.length - 1 && <div className={`h-[2px] flex-1 mx-1 mb-4 ${i < stepIdx ? "bg-[#0B3B2C]" : "bg-[#E7E4DA]"}`} />}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 space-y-2">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.image} alt="" className="h-12 w-10 rounded-lg object-cover bg-[#F1EEE6]" />
                        <div className="flex-1">
                          <div className="font-medium leading-tight">{it.name}</div>
                          <div className="text-[11px] text-[#6E6A60]">{it.color ? `${it.color} • ` : ""}Qty {it.quantity}{it.sku ? ` • ${it.sku}` : ""}</div>
                        </div>
                        <div className="font-bold">₹{it.price * it.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-[12px] text-[#6E6A60]">
                    Delivering to: {o.shippingAddress?.line1}, {o.shippingAddress?.city} {o.shippingAddress?.pincode} • Shipping ₹{o.shippingFee === 0 ? "Free" : o.shippingFee}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

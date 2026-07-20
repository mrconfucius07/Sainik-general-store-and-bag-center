"use client";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  orderNo: string;
  fullName: string;
  email: string;
  phone: string | null;
  items: { name: string; price: number; quantity: number; color?: string; image: string; sku?: string }[];
  total: number;
  subtotal: number;
  shippingFee: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress?: { line1: string; city: string; state: string; pincode: string } | null;
  giftNote?: string | null;
  createdAt: string;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const PILL: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-violet-100 text-violet-800 border-violet-300",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    await load();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  const filtered = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="text-[#6E6A60] text-sm">Track every order from pending to delivered.</p>
        </div>
        <button onClick={load} className="rounded-full border-2 border-[#E7E4DA] px-5 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition">↻ Refresh</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setStatusFilter("all")} className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition ${statusFilter === "all" ? "bg-black text-white" : "bg-white border border-[#E7E4DA]"}`}>All ({orders.length})</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition ${statusFilter === s ? "bg-black text-white" : "bg-white border border-[#E7E4DA]"}`}>
            {s} ({orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E7E4DA] rounded-3xl p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <div className="font-display text-xl">No orders here</div>
          <p className="text-[#6E6A60] mt-1 text-sm">New orders appear instantly — you also get email + WhatsApp alerts.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E7E4DA] overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-[#FBFAF6] text-left text-[11px] uppercase tracking-widest">
              <tr>
                <th className="p-4 font-bold">Order</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Payment</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right pr-5">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-[#F1EEE6] hover:bg-[#FBFAF6] transition">
                  <td className="p-4">
                    <div className="font-mono text-xs font-bold">{o.orderNo}</div>
                    <div className="text-[11px] text-[#6E6A60]">{new Date(o.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{o.fullName}</div>
                    <div className="text-[11px] text-[#6E6A60]">{o.phone || o.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold uppercase">{o.paymentMethod === "cod" ? "💵 COD" : "✅ Paid Online"}</div>
                    <div className="text-[11px] text-[#6E6A60]">{o.paymentStatus}</div>
                  </td>
                  <td className="p-4 font-display text-lg">₹{o.total}</td>
                  <td className="p-4">
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className={`rounded-full border-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-white cursor-pointer ${PILL[o.status]}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 pr-5 text-right">
                    <button onClick={() => setSelected(o)} className="text-xs font-bold px-4 py-1.5 rounded-full border border-[#E7E4DA] hover:bg-black hover:text-white transition">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-xs text-[#6E6A60]">{selected.orderNo}</div>
                <h2 className="font-display text-2xl">{selected.fullName}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="h-9 w-9 rounded-full border border-[#E7E4DA] grid place-items-center hover:bg-black hover:text-white">✕</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
              <div className="bg-[#FBFAF6] rounded-2xl p-4 border border-[#E7E4DA]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#6E6A60] mb-1">Contact</div>
                <div className="font-medium">{selected.email}</div>
                <div>{selected.phone || "—"}</div>
              </div>
              <div className="bg-[#FBFAF6] rounded-2xl p-4 border border-[#E7E4DA]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#6E6A60] mb-1">Ship To</div>
                <div>{selected.shippingAddress?.line1}</div>
                <div>{selected.shippingAddress?.city}, {selected.shippingAddress?.state} — {selected.shippingAddress?.pincode}</div>
              </div>
            </div>

            {selected.giftNote && (
              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm">🎁 <b>Gift note:</b> {selected.giftNote}</div>
            )}

            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[#6E6A60] mb-3">Items</div>
              {selected.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 py-3 border-b border-dashed border-[#E7E4DA] text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={it.image} alt="" className="h-12 w-10 rounded-lg object-cover bg-[#F1EEE6]" />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{it.name}</div>
                      <div className="text-[11px] text-[#6E6A60]">{it.color ? `${it.color} • ` : ""}Qty {it.quantity}{it.sku ? ` • ${it.sku}` : ""}</div>
                    </div>
                  </div>
                  <div className="font-bold shrink-0">₹{it.price * it.quantity}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[#6E6A60]">Subtotal</span><span>₹{selected.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-[#6E6A60]">Shipping</span><span>{selected.shippingFee === 0 ? "Free" : `₹${selected.shippingFee}`}</span></div>
              <div className="flex justify-between font-display text-lg border-t border-[#E7E4DA] pt-2"><span>Total</span><span>₹{selected.total}</span></div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} className={`rounded-full py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition ${selected.status === s ? "bg-black text-white border-black" : "border-[#E7E4DA] hover:border-black"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

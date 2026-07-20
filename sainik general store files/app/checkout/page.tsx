"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatINR, shippingFeeFor } from "@/lib/utils";
import Link from "next/link";

declare global {
  interface Window { Razorpay?: any }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", line1: "", city: "", state: "", pincode: "", giftNote: "" });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ orderNo: string; total: number; status: string } | null>(null);

  const shipping = shippingFeeFor(subtotal, shippingMethod);
  const total = subtotal + shipping;

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) setForm(f => ({ ...f, name: f.name || d.user.name, email: f.email || d.user.email, phone: f.phone || (d.user.phone || "") }));
    }).catch(() => {});
  }, []);

  const cartPayload = () => items.map(it => ({ productId: Number(it.product.id), quantity: it.quantity, color: it.color }));

  async function placeOrder(razorpay?: { orderId: string; paymentId: string; signature: string }) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartPayload(),
        email: form.email,
        fullName: form.name,
        phone: form.phone,
        shippingAddress: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode },
        shippingMethod,
        paymentMethod: razorpay ? "prepaid" : "cod",
        giftNote: form.giftNote || undefined,
        razorpay,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order failed");
    return data.order;
  }

  async function handlePay() {
    setError("");
    setLoading(true);
    try {
      if (paymentMethod === "cod") {
        const order = await placeOrder();
        setPlaced({ orderNo: order.orderNo, total: order.total, status: order.status });
        clear();
        setStep(3);
        window.scrollTo(0, 0);
        return;
      }

      // ---- Razorpay flow ----
      const rzpRes = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartPayload(), shippingMethod }),
      });
      const rzp = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzp.error || "Payment init failed");

      if (rzp.testMode) {
        // Demo mode (Razorpay keys not configured) — simulate a successful payment
        const order = await placeOrder({ orderId: rzp.id, paymentId: "pay_test_demo", signature: "test_signature" });
        setPlaced({ orderNo: order.orderNo, total: order.total, status: order.status });
        clear();
        setStep(3);
        window.scrollTo(0, 0);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Could not load Razorpay. Please try COD.");

      const rzpInstance = new window.Razorpay({
        key: rzp.keyId,
        order_id: rzp.id,
        amount: rzp.amount,
        currency: rzp.currency,
        name: "Sainik General Store & Bag Center",
        description: "Order payment",
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#0B3B2C" },
        modal: { ondismiss: () => { setLoading(false); } },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const vRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const v = await vRes.json();
            if (!v.valid) throw new Error("Payment verification failed");
            const order = await placeOrder({ orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature });
            setPlaced({ orderNo: order.orderNo, total: order.total, status: order.status });
            clear();
            setStep(3);
            window.scrollTo(0, 0);
          } catch (e: any) {
            setError(e.message);
          } finally {
            setLoading(false);
          }
        },
      });
      rzpInstance.open();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mx-auto max-w-md rounded-[32px] border-2 border-[#E7E4DA] bg-white p-10">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="font-display text-3xl">Your bag is empty</h2>
          <p className="text-sm text-[#6E6A60] mt-2 mb-6">Fill it with bags, trolleys &amp; gifts first.</p>
          <Link href="/shop" className="inline-flex h-12 items-center rounded-full bg-[#0B3B2C] px-7 text-xs font-black uppercase tracking-[0.2em] text-white">Start Shopping</Link>
        </div>
      </div>
    );
  }

  if (step === 3 && placed) {
    return (
      <div className="mx-auto max-w-[760px] px-4 sm:px-6 py-14">
        <div className="rounded-[32px] sm:rounded-[36px] bg-[#0B3B2C] text-white dots-dark p-8 sm:p-12 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-[#F2A93B] text-black grid place-items-center text-4xl shadow-[4px_4px_0_rgba(0,0,0,0.4)]">✓</div>
          <h1 className="font-display text-4xl sm:text-5xl mt-7">Order placed!</h1>
          <p className="mt-4 text-white/75 max-w-[46ch] mx-auto">
            Order <span className="font-mono font-bold text-[#F2A93B]">{placed.orderNo}</span> for <b>₹{placed.total}</b> is confirmed and will be packed with care. The owner has been notified on email &amp; WhatsApp. 🎉
          </p>
          <div className="mt-8 rounded-2xl bg-white/5 border border-white/15 p-5 text-left text-sm space-y-2 max-w-[420px] mx-auto">
            <div>📦 Free gift wrapping included</div>
            <div>🚚 {placed.status === "confirmed" ? "Dispatch within 24 hours (city)" : "We’ll call you to confirm your COD order"}</div>
            <div>🧵 Name-slip stitching free — mention at pickup</div>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/account?tab=orders" className="inline-flex h-12 items-center rounded-full bg-[#F2A93B] px-7 text-xs font-black uppercase tracking-[0.2em] text-black">Track in My Account</Link>
            <Link href="/shop" className="inline-flex h-12 items-center rounded-full border-2 border-white/30 px-7 text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition">Keep Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = "mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]";

  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[1.05fr_0.85fr] gap-8">
        <div>
          <div className="flex items-center gap-2 mb-7 text-[11px] font-black uppercase tracking-[0.2em]">
            <span className={`h-8 w-8 rounded-full grid place-items-center ${step >= 1 ? "bg-[#0B3B2C] text-white" : "bg-[#E7E4DA]"}`}>1</span>
            <span className="hidden sm:inline">Delivery</span>
            <span className="h-[3px] w-8 bg-[#E7E4DA] rounded-full" />
            <span className={`h-8 w-8 rounded-full grid place-items-center ${step >= 2 ? "bg-[#0B3B2C] text-white" : "bg-[#E7E4DA]"}`}>2</span>
            <span className="hidden sm:inline">Payment</span>
            <span className="h-[3px] w-8 bg-[#E7E4DA] rounded-full" />
            <span className="h-8 w-8 rounded-full grid place-items-center bg-[#E7E4DA]">3</span>
            <span className="hidden sm:inline">Done</span>
            <span className="ml-auto text-[#6E6A60] normal-case tracking-normal font-bold">🔒 100% secure checkout</span>
          </div>

          {step === 1 && (
            <div className="rounded-[28px] border-2 border-[#E7E4DA] bg-white p-6 sm:p-8 animate-fade">
              <h2 className="font-display text-2xl sm:text-3xl">Delivery details</h2>
              <p className="text-sm text-[#6E6A60] mt-1 mb-6">Same-day delivery in city · store pickup ready in 2 hours.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="text-[11px] font-extrabold uppercase tracking-widest">Full name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Aditi Sharma" /></div>
                <div><label className="text-[11px] font-extrabold uppercase tracking-widest">Phone *</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+91 98765 43210" /></div>
                <div><label className="text-[11px] font-extrabold uppercase tracking-widest">Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="for invoice & updates" /></div>
                <div className="sm:col-span-2"><label className="text-[11px] font-extrabold uppercase tracking-widest">Address *</label><input value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} className={inputCls} placeholder="House / shop, street, landmark" /></div>
                <div><label className="text-[11px] font-extrabold uppercase tracking-widest">City *</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                <div><label className="text-[11px] font-extrabold uppercase tracking-widest">State *</label><input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className={inputCls} /></div>
                <div><label className="text-[11px] font-extrabold uppercase tracking-widest">Pincode *</label><input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className={inputCls} /></div>
                <div><label className="text-[11px] font-extrabold uppercase tracking-widest">Gift note (free wrapping 🎁)</label><input value={form.giftNote} onChange={e => setForm({ ...form, giftNote: e.target.value })} className={inputCls} placeholder="Happy Birthday, Aarav!" /></div>
              </div>

              <div className="mt-6">
                <div className="text-[11px] font-extrabold uppercase tracking-widest mb-3">Delivery speed</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={() => setShippingMethod("standard")} className={`rounded-2xl border-2 p-4 text-left transition ${shippingMethod === "standard" ? "border-[#0B3B2C] bg-[#0B3B2C] text-white" : "border-[#E7E4DA] bg-white"}`}>
                    <div className="font-extrabold text-sm">🚚 Standard · 1–3 days</div>
                    <div className={`text-xs mt-1 ${shippingMethod === "standard" ? "text-white/70" : "text-[#6E6A60]"}`}>{subtotal >= 999 ? "FREE above ₹999" : "₹79"} </div>
                  </button>
                  <button onClick={() => setShippingMethod("express")} className={`rounded-2xl border-2 p-4 text-left transition ${shippingMethod === "express" ? "border-[#0B3B2C] bg-[#0B3B2C] text-white" : "border-[#E7E4DA] bg-white"}`}>
                    <div className="font-extrabold text-sm">⚡ Express · same day (city)</div>
                    <div className={`text-xs mt-1 ${shippingMethod === "express" ? "text-white/70" : "text-[#6E6A60]"}`}>₹149 flat</div>
                  </button>
                </div>
              </div>

              <button
                disabled={!form.name || !form.phone || !form.email || !form.line1 || !form.city || !form.state || !form.pincode}
                onClick={() => setStep(2)}
                className="mt-7 w-full h-13 min-h-12 rounded-full bg-[#0B3B2C] text-white text-xs font-black uppercase tracking-[0.22em] hover:bg-black transition active:scale-[0.99] disabled:opacity-40"
              >
                Continue to Payment →
              </button>
              <p className="mt-3 text-center text-xs text-[#6E6A60]">Have an account? <Link href="/login?next=/checkout" className="font-bold underline decoration-[#F2A93B] decoration-2">Login</Link> to autofill &amp; track orders.</p>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-[28px] border-2 border-[#E7E4DA] bg-white p-6 sm:p-8 animate-fade">
              <h2 className="font-display text-2xl sm:text-3xl">Payment</h2>
              <p className="text-sm text-[#6E6A60] mt-1 mb-6">Powered by Razorpay — your card/UPI details never touch our servers.</p>

              <div className="space-y-3">
                <button onClick={() => setPaymentMethod("prepaid")} className={`w-full text-left rounded-2xl border-2 p-5 transition ${paymentMethod === "prepaid" ? "border-[#0B3B2C] bg-[#FBFAF6]" : "border-[#E7E4DA]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">💳 Pay Online — UPI, Cards, Netbanking</div>
                    <span className={`h-5 w-5 rounded-full border-2 grid place-items-center text-[10px] ${paymentMethod === "prepaid" ? "bg-[#0B3B2C] border-[#0B3B2C] text-white" : "border-[#D8D4C8]"}`}>{paymentMethod === "prepaid" && "✓"}</span>
                  </div>
                  <div className="mt-2 text-xs text-[#6E6A60]">Google Pay · PhonePe · Paytm · Credit/Debit Cards · Netbanking · Wallets</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["UPI", "GPay", "PhonePe", "Paytm", "VISA", "Mastercard", "RuPay", "Netbanking"].map(m => (
                      <span key={m} className="rounded-md bg-white border border-[#E7E4DA] px-2 py-1 text-[10px] font-black uppercase tracking-wider">{m}</span>
                    ))}
                  </div>
                </button>

                <button onClick={() => setPaymentMethod("cod")} className={`w-full text-left rounded-2xl border-2 p-5 transition ${paymentMethod === "cod" ? "border-[#0B3B2C] bg-[#FBFAF6]" : "border-[#E7E4DA]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">💵 Cash on Delivery / Pay at Store</div>
                    <span className={`h-5 w-5 rounded-full border-2 grid place-items-center text-[10px] ${paymentMethod === "cod" ? "bg-[#0B3B2C] border-[#0B3B2C] text-white" : "border-[#D8D4C8]"}`}>{paymentMethod === "cod" && "✓"}</span>
                  </div>
                  <div className="mt-2 text-xs text-[#6E6A60]">Pay the delivery partner or at the counter. We’ll call to confirm.</div>
                </button>
              </div>

              {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

              <div className="mt-7 flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 min-h-12 rounded-full border-2 border-[#E7E4DA] text-xs font-black uppercase tracking-[0.2em] hover:border-black transition">← Back</button>
                <button onClick={handlePay} disabled={loading} className="flex-[2] min-h-12 rounded-full bg-[#E2452B] text-white text-xs font-black uppercase tracking-[0.22em] hover:bg-[#c73620] transition active:scale-[0.99] disabled:opacity-60 shadow-[4px_4px_0_rgba(11,59,44,0.9)]">
                  {loading ? "Processing..." : paymentMethod === "prepaid" ? `Pay ${formatINR(total)} securely` : `Place COD order · ${formatINR(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="rounded-[28px] border-2 border-[#E7E4DA] bg-white p-6">
            <h3 className="font-display text-xl">Order summary</h3>
            <div className="mt-5 space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {items.map(it => (
                <div key={`${it.product.id}-${it.color}`} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 rounded-xl overflow-hidden bg-[#F1EEE6] border border-[#E7E4DA]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -top-0 -right-0 bg-[#0B3B2C] text-white text-[10px] font-black h-5 w-5 grid place-items-center rounded-bl-lg">{it.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-extrabold leading-tight line-clamp-2">{it.product.name}</div>
                    <div className="text-[11px] text-[#6E6A60] mt-0.5">{it.color ? `${it.color} · ` : ""}{it.product.brand}</div>
                  </div>
                  <div className="text-sm font-black shrink-0">{formatINR(it.product.price * it.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t-2 border-dashed border-[#E7E4DA] pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#6E6A60] font-bold">Subtotal</span><span className="font-bold">{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[#6E6A60] font-bold">Shipping ({shippingMethod})</span><span className={`font-bold ${shipping === 0 ? "text-emerald-700" : ""}`}>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E7E4DA]"><span className="font-extrabold uppercase text-xs tracking-widest">Total</span><span className="font-display text-2xl">{formatINR(total)}</span></div>
            </div>
          </div>
          <div className="rounded-[24px] bg-[#F2A93B] p-5 text-sm font-bold text-black/80">
            🎁 Free gift wrapping on this order — add a gift note in step 1 and we’ll handwrite it.
          </div>
        </div>
      </div>
    </div>
  );
}

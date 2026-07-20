"use client";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isOpen, close, subtotal, updateQty, removeItem } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  return (
    <>
      <div className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={close} />
      <aside className={`fixed right-0 top-0 z-[70] h-[100dvh] w-full max-w-[440px] bg-[#FFFCF6] shadow-[-16px_0_60px_rgba(0,0,0,0.15)] transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#E8E0D5] px-6 py-5">
            <div>
              <h2 className="font-display text-2xl">Your Bag</h2>
              <p className="text-[12px] text-[#6B6660] tracking-wide uppercase mt-1">{items.length} {items.length === 1 ? "item" : "items"} • Free gift wrap above ₹999</p>
            </div>
            <button onClick={close} className="h-10 w-10 rounded-full border border-[#E8E0D5] grid place-items-center hover:bg-black hover:text-white transition">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-[#F5F1EB] grid place-items-center text-2xl">👜</div>
                <p className="font-display mt-6 text-xl">Your bag is empty</p>
                <p className="text-sm text-[#6B6660] mt-2">Add some favourites – we gift wrap for free.</p>
                <Link href="/shop" onClick={close} className="mt-6 inline-flex rounded-full bg-[#121212] px-6 py-3 text-xs tracking-widest uppercase text-white">Continue Shopping</Link>
              </div>
            ) : (
              items.map((it) => (
                <div key={`${it.product.id}-${it.color}`} className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F1EB]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={it.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <h4 className="text-[14px] font-medium leading-tight line-clamp-2">{it.product.name}</h4>
                      <button onClick={() => removeItem(it.product.id, it.color)} className="text-[#9C9893] hover:text-black">✕</button>
                    </div>
                    <p className="text-[11px] uppercase tracking-wide text-[#6B6660] mt-1">{it.product.brand} {it.color ? `• ${it.color}` : ""}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-[#E8E0D5] px-2 py-1">
                        <button onClick={() => updateQty(it.product.id, it.quantity - 1, it.color)} className="h-6 w-6 grid place-items-center rounded-full hover:bg-[#F5F1EB]">−</button>
                        <span className="min-w-6 text-center text-sm">{it.quantity}</span>
                        <button onClick={() => updateQty(it.product.id, it.quantity + 1, it.color)} className="h-6 w-6 grid place-items-center rounded-full hover:bg-[#F5F1EB]">+</button>
                      </div>
                      <span className="text-sm font-semibold">{formatINR(it.product.price * it.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-[#E8E0D5] bg-white p-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#6B6660]">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6660]">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
                {shipping !== 0 && <div className="text-[11px] font-bold text-[#E2452B]">Add {formatINR(999 - subtotal)} more for FREE shipping 🚚</div>}
                <div className="flex justify-between font-semibold pt-2 border-t border-dashed border-[#E8E0D5] text-[15px]"><span>Total</span><span>{formatINR(total)}</span></div>
              </div>
              <Link href="/checkout" onClick={close} className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#121212] text-white text-[13px] tracking-widest uppercase hover:bg-black transition">
                Checkout • {formatINR(total)}
              </Link>
              <p className="mt-3 text-center text-[11px] text-[#6B6660]">🔒 Secure checkout • UPI • Cards • COD</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

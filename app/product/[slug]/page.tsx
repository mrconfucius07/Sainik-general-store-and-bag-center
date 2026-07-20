"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatINR, discountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import SmartImage from "@/components/SmartImage";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  materials: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  dimensions: string;
  weight: string;
  sku?: string;
  reviews?: { id: string; author: string; avatar: string; rating: number; title: string; comment: string; date: string; verified: boolean }[];
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/products");
      const data: any[] = await res.json();
      const found = data.find((p: any) => p.slug === slug);
      if (found) {
        const prod = { ...found, id: String(found.id), originalPrice: found.originalPrice || undefined };
        setProduct(prod);
        setColor(prod.colors?.[0]?.name || "");
        setRelated(
          data.filter((p: any) => p.category === prod.category && p.slug !== slug && p.inStock).slice(0, 4)
            .map((p: any) => ({ ...p, id: String(p.id), originalPrice: p.originalPrice || undefined }))
        );
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-2 gap-10">
        <div className="shimmer rounded-[28px] aspect-[4/5]" />
        <div className="space-y-4 pt-6">
          <div className="shimmer h-5 w-40 rounded-full" />
          <div className="shimmer h-12 w-4/5 rounded-2xl" />
          <div className="shimmer h-6 w-32 rounded-full" />
          <div className="shimmer h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="mx-auto max-w-[1360px] px-6 py-24 text-center"><p className="font-display text-3xl">Product not found</p><Link href="/shop" className="mt-4 inline-block underline font-bold">← Go to shop</Link></div>;
  }

  const disc = discountPercent(product.price, product.originalPrice);

  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-[11px] font-bold uppercase tracking-widest text-[#6E6A60] mb-6 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link><span>/</span>
        <Link href="/shop" className="hover:text-black">Shop</Link><span>/</span>
        <Link href={`/shop?cat=${product.category}`} className="hover:text-black">{product.category}</Link><span>/</span>
        <span className="text-black normal-case tracking-normal">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[88px_1fr] gap-3 sm:gap-4">
          <div className="flex flex-col gap-3">
            {(product.images || []).map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`relative overflow-hidden rounded-xl border-2 aspect-[4/5] transition ${activeImg === i ? "border-[#0B3B2C]" : "border-[#E7E4DA] opacity-70 hover:opacity-100"}`}>
                <SmartImage src={img} alt={`${product.name} view ${i + 1}`} sizes="88px" />
              </button>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#F1EEE6] aspect-[4/5] border border-[#E7E4DA]">
            <SmartImage src={product.images?.[activeImg]} alt={product.name} sizes="(max-width: 1024px) 100vw, 45vw" />
            <div className="absolute left-4 top-4 flex gap-2">
              {disc && <span className="sticker rounded-xl px-3 py-1.5 font-display text-lg">{disc}% OFF</span>}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-1.5 sm:hidden">
              {product.images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)} aria-label={`Image ${i + 1}`} className={`h-1.5 rounded-full transition-all ${activeImg === i ? "w-6 bg-black" : "w-2.5 bg-white/70"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6E6A60]">{product.brand} · {product.subcategory || product.category}{product.sku ? ` · ${product.sku}` : ""}</div>
          <h1 className="font-display text-3xl sm:text-[40px] leading-[0.95] mt-3">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="text-[#F2A93B] text-base tracking-tight">{"★".repeat(Math.round(product.rating))}</span>
            <span className="font-black">{Number(product.rating).toFixed(1)}</span>
            <span className="text-[#6E6A60] font-bold">({product.reviewCount} ratings)</span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${product.inStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
              {product.inStock ? `● In stock · ${product.stock} left` : "Out of stock"}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span className="font-display text-4xl">{formatINR(product.price)}</span>
            {product.originalPrice && <span className="line-through text-[#B5B1A5] text-lg">{formatINR(product.originalPrice)}</span>}
            {disc && <span className="rounded-full bg-[#E2452B] text-white px-3 py-1 text-xs font-black">SAVE {formatINR((product.originalPrice || 0) - product.price)}</span>}
          </div>
          <p className="mt-1 text-[11px] text-[#6E6A60]">Inclusive of all taxes · Free gift wrap 🎁</p>

          <p className="mt-5 text-[15px] leading-relaxed text-[#45423B]">{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-[#E7E4DA] bg-white p-4">
              <div className="text-[11px] font-extrabold uppercase tracking-widest mb-3">Colour · <span className="text-[#0B3B2C]">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c.name} onClick={() => setColor(c.name)} className={`flex items-center gap-2 rounded-full border-2 px-3.5 py-2 text-sm font-bold transition active:scale-95 ${color === c.name ? "border-black bg-black text-white" : "border-[#E7E4DA] bg-white hover:border-black"}`}>
                    <span className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <div className="flex items-center gap-1 rounded-full border-2 border-[#E7E4DA] bg-white px-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-9 rounded-full hover:bg-[#F1EEE6] text-lg font-black">−</button>
              <span className="w-8 text-center font-black">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-10 w-9 rounded-full hover:bg-[#F1EEE6] text-lg font-black">+</button>
            </div>
            <button
              onClick={() => addItem(product as any, qty, color)}
              disabled={!product.inStock}
              className="flex-1 min-h-12 rounded-full bg-[#0B3B2C] text-white text-xs font-black uppercase tracking-[0.22em] hover:bg-black transition active:scale-[0.99] disabled:opacity-40 shadow-[4px_4px_0_#F2A93B]"
            >
              Add to Bag — {formatINR(product.price * qty)}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-[11px] font-bold">
            <div className="rounded-xl bg-white border-2 border-[#E7E4DA] p-3 text-center">🚚 Free ship ₹999+</div>
            <div className="rounded-xl bg-white border-2 border-[#E7E4DA] p-3 text-center">🎁 Free gift wrap</div>
            <div className="rounded-xl bg-white border-2 border-[#E7E4DA] p-3 text-center">↩️ 7-day exchange</div>
          </div>

          <div className="mt-8 border-t-2 border-dashed border-[#E7E4DA] pt-6">
            <h3 className="font-display text-2xl">Details &amp; specs</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[#6E6A60] whitespace-pre-line">{product.longDescription}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[["Material", product.materials], ["Dimensions", product.dimensions], ["Weight", product.weight], ["Stock", `${product.stock} units`]].map(([label, value]) => (
                <div key={label} className="rounded-xl border-2 border-[#E7E4DA] bg-white p-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E6A60]">{label}</div>
                  <div className="text-[13px] font-bold mt-1">{value || "—"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10 border-t-2 border-dashed border-[#E7E4DA] pt-6">
            <h3 className="font-display text-2xl flex items-center gap-2">
              Customer reviews <span className="text-sm font-body font-extrabold text-[#6E6A60] normal-case">({product.reviews?.length ?? 0} on record)</span>
            </h3>
            <div className="mt-5 space-y-4">
              {(product.reviews && product.reviews.length > 0) ? product.reviews.map(r => (
                <div key={r.id} className="rounded-2xl bg-white border-2 border-[#E7E4DA] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#0B3B2C] text-[#F2A93B] grid place-items-center text-xs font-black">{r.avatar}</div>
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2 flex-wrap">
                          {r.author}
                          {r.verified && <span className="text-[9px] bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5 font-black uppercase tracking-wider">✓ Verified buyer</span>}
                        </div>
                        <div className="text-[11px] text-[#6E6A60] font-bold">{r.date} · <span className="text-[#F2A93B]">{"★".repeat(r.rating)}</span></div>
                      </div>
                    </div>
                  </div>
                  {r.title && <div className="mt-3 font-extrabold text-[14px]">{r.title}</div>}
                  <p className="mt-1 text-[14px] text-[#45423B] leading-relaxed">{r.comment}</p>
                </div>
              )) : (
                <p className="text-sm text-[#6E6A60]">No written reviews yet — be the first after your purchase!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-6 flex items-center gap-3"><span className="inline-block h-7 w-2 bg-[#F2A93B] rounded-full" /> You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p as any} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

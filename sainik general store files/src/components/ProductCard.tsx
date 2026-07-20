"use client";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatINR, discountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import SmartImage from "@/components/SmartImage";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const disc = discountPercent(product.price, product.originalPrice);

  return (
    <div className="group relative flex flex-col animate-fade" style={{ animationDelay: `${Math.min(index, 7) * 70}ms` }}>
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-3xl bg-[#F1EEE6] aspect-[4/5] border border-[#E7E4DA]">
        <SmartImage src={product.images[0]} alt={product.name} className="transition-transform duration-700 group-hover:scale-[1.06]" sizes="(max-width: 768px) 50vw, 25vw" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5 items-start">
          {disc && <span className="sticker rounded-lg px-2.5 py-1 text-[11px] font-black">{disc}% OFF</span>}
          {product.bestseller && <span className="rounded-full bg-[#0B3B2C] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white">Bestseller</span>}
          {product.newArrival && <span className="rounded-full bg-white px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] shadow">New</span>}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
          <div className="flex gap-1">
            {(product.colors || []).slice(0, 3).map(c => (
              <span key={c.name} title={c.name} className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: c.hex }} />
            ))}
          </div>
          <span className="rounded-full bg-black/85 text-white backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest">View →</span>
        </div>
      </Link>

      <div className="pt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6E6A60]">{product.brand} · {product.subcategory || product.category}</div>
            <Link href={`/product/${product.slug}`} className="mt-1 block text-[15px] font-extrabold leading-snug group-hover:text-[#0B3B2C] transition line-clamp-2">
              {product.name}
            </Link>
          </div>
          <button
            onClick={() => addItem(product, 1, product.colors?.[0]?.name)}
            aria-label={`Add ${product.name} to bag`}
            className="h-9 w-9 shrink-0 rounded-full border-2 border-[#141714] grid place-items-center text-lg font-black hover:bg-[#F2A93B] hover:border-[#F2A93B] active:scale-90 transition"
          >
            +
          </button>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-xl">{formatINR(product.price)}</span>
          {product.originalPrice && <span className="text-sm line-through text-[#B5B1A5]">{formatINR(product.originalPrice)}</span>}
          <span className="ml-auto text-[11px] font-bold text-[#6E6A60]">
            <span className="text-[#F2A93B]">★</span> {product.rating} <span className="font-normal">({product.reviewCount})</span>
          </span>
        </div>
      </div>
    </div>
  );
}

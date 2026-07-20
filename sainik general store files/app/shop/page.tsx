"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  inStock: boolean;
  stock: number;
  tags: string[];
};

type Sort = "featured" | "price-low" | "price-high" | "rating" | "new";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState<Sort>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [brand, setBrand] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.map((p: any) => ({
        ...p,
        id: String(p.id),
        originalPrice: p.originalPrice || undefined,
      })));
      setLoading(false);
    }
    load();
  }, []);

  const brands = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.brand)))], [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "All") list = list.filter(p => p.category === cat);
    if (brand !== "All") list = list.filter(p => p.brand === brand);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "new": list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [cat, brand, priceRange, sort, query, products]);

  return (
    <div className="mx-auto max-w-[1360px] px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#6B6660]">Sainik General Store • {filtered.length} products</div>
          <h1 className="font-display text-[42px] leading-[0.9] mt-2">Shop all<br />essentials</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search bags, gifts, pen..." className="h-11 w-[280px] rounded-full border border-[#E8E0D5] bg-white pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">⌕</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-[92px] h-fit space-y-8 rounded-[22px] border border-[#E8E0D5] bg-white p-6">
          <div>
            <h4 className="text-[11px] uppercase tracking-widest mb-4">Collection</h4>
            <div className="space-y-2">
              {["All", "Bags", "Trolley", "Stationery", "Gifts", "Accessories"].map(c => (
                <button key={c} onClick={() => setCat(c)} className={`flex w-full justify-between rounded-full px-4 py-2 text-sm transition ${cat === c ? "bg-[#121212] text-white" : "bg-[#F5F1EB] hover:bg-[#EEE8DC]"}`}>
                  <span>{c}</span><span className="opacity-60 text-xs">{c === "All" ? products.length : products.filter(p => p.category === c).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest mb-4">Price • INR</h4>
            <input type="range" min={0} max={10000} step={500} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full accent-black" />
            <div className="mt-2 flex justify-between text-xs text-[#6B6660]"><span>₹{priceRange[0]}</span><span>up to ₹{priceRange[1]}</span></div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest mb-4">Brands</h4>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <button key={b} onClick={() => setBrand(b)} className={`rounded-full border px-3 py-1 text-xs ${brand === b ? "bg-black text-white border-black" : "border-[#E8E0D5] hover:border-black"}`}>{b}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-[13px] text-[#6B6660]">{filtered.length} items • Sorted by <span className="text-black font-medium">{sort}</span></div>
            <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="h-9 rounded-full border border-[#E8E0D5] bg-white px-4 text-sm">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="new">New Arrivals</option>
            </select>
          </div>

          {loading ? (
            <div className="py-20 text-center">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#E8E0D5] py-20 text-center"><p className="font-display text-xl">No products found</p><p className="text-sm text-[#6B6660] mt-2">Try changing filters or search</p></div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p as any} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

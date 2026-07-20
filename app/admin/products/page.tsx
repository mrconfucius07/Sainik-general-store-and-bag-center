"use client";
import { useEffect, useRef, useState } from "react";

type Product = {
  id?: number;
  sku: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  materials: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  inStock: boolean;
  stock: number;
  tags: string[];
  dimensions: string;
  weight: string;
};

const emptyProduct: Product = {
  sku: "", slug: "", name: "", description: "", longDescription: "", category: "Bags", subcategory: "",
  brand: "Sainik", price: 999, originalPrice: null, images: [], colors: [], materials: "",
  featured: false, bestseller: false, newArrival: false, inStock: true, stock: 50, tags: [], dimensions: "", weight: "",
};

const CATEGORIES = ["Bags", "Trolley", "Stationery", "Gifts", "Accessories"];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.price) return alert("Name and price are required");
    const payload = { ...editing };
    if (!payload.slug) payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!payload.sku) payload.sku = `SNK-${payload.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setEditing(null); await load(); }
    else alert("Save failed: " + (await res.json()).error);
  }

  async function remove(id: number) {
    if (!confirm("Delete this product permanently?")) return;
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  function addFiles(files: FileList | null) {
    if (!files || !editing) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setEditing(prev => prev ? { ...prev, images: [...prev.images, String(reader.result)] } : prev);
      };
      reader.readAsDataURL(file);
    });
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    (p.sku || "").toLowerCase().includes(filter.toLowerCase()) ||
    (p.brand || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-[#6E6A60] text-sm">Full control — add, edit, price, stock &amp; upload photos.</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyProduct }); setUrlInput(""); }} className="rounded-full bg-[#0B3B2C] text-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition">+ New Product</button>
      </div>

      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search by name, SKU or brand..." className="mb-4 w-full sm:w-[360px] rounded-full border border-[#E7E4DA] bg-white px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />

      {loading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E7E4DA] overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-[#FBFAF6] text-left text-[11px] uppercase tracking-widest">
              <tr>
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">SKU</th>
                <th className="p-4 font-bold">Price / Offer</th>
                <th className="p-4 font-bold text-center">Stock</th>
                <th className="p-4 font-bold">Flags</th>
                <th className="p-4 font-bold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-[#6E6A60]">No products found. Click “+ New Product” or import demo data from the Dashboard.</td></tr>}
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-[#F1EEE6] hover:bg-[#FBFAF6] transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="h-11 w-9 rounded-lg object-cover bg-[#F1EEE6]" />}
                      <div>
                        <div className="font-bold leading-tight">{p.name}</div>
                        <div className="text-xs text-[#6E6A60]">{p.brand} • {p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">{p.sku || "—"}</td>
                  <td className="p-4">
                    <span className="font-bold">₹{p.price}</span>
                    {p.originalPrice ? <span className="ml-1.5 line-through text-xs text-[#B5B1A5]">₹{p.originalPrice}</span> : null}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${!p.inStock ? "bg-gray-100 text-gray-500" : (p.stock ?? 0) < 15 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {!p.inStock ? "Hidden" : p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] uppercase tracking-wider font-bold text-[#6E6A60]">
                    {p.bestseller && <span className="mr-1 text-[#E2452B]">Best</span>}
                    {p.featured && <span className="mr-1 text-[#0B3B2C]">Feat</span>}
                    {p.newArrival && <span className="text-[#F2A93B]">New</span>}
                  </td>
                  <td className="p-4 text-right pr-6 whitespace-nowrap">
                    <button onClick={() => { setEditing({ ...emptyProduct, ...p, originalPrice: p.originalPrice ?? null }); setUrlInput(""); }} className="px-3.5 py-1.5 text-xs font-bold border border-[#E7E4DA] rounded-full mr-2 hover:bg-black hover:text-white transition">Edit</button>
                    <button onClick={() => remove(p.id!)} className="px-3.5 py-1.5 text-xs font-bold border border-red-200 rounded-full text-red-600 hover:bg-red-50 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] bg-black/50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl my-4 p-6 sm:p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl">{editing.id ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setEditing(null)} className="h-9 w-9 rounded-full border border-[#E7E4DA] grid place-items-center hover:bg-black hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="md:col-span-2">
                <label className="text-[11px] uppercase tracking-widest font-bold">Product Name *</label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">SKU</label>
                <input value={editing.sku} onChange={e => setEditing({ ...editing, sku: e.target.value })} placeholder="SNK-BAG-001 (auto if blank)" className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5 font-mono text-sm" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Brand</label>
                <input value={editing.brand} onChange={e => setEditing({ ...editing, brand: e.target.value })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Category *</label>
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5 bg-white">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Subcategory</label>
                <input value={editing.subcategory} onChange={e => setEditing({ ...editing, subcategory: e.target.value })} placeholder="School Bags" className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Selling Price (₹) *</label>
                <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Offer / MRP Price (₹)</label>
                <input type="number" value={editing.originalPrice ?? ""} onChange={e => setEditing({ ...editing, originalPrice: e.target.value ? parseInt(e.target.value) : null })} placeholder="Struck-through price" className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Stock Quantity</label>
                <input type="number" value={editing.stock} onChange={e => setEditing({ ...editing, stock: parseInt(e.target.value) || 0 })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold">Material</label>
                <input value={editing.materials} onChange={e => setEditing({ ...editing, materials: e.target.value })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] uppercase tracking-widest font-bold">Short Description</label>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5 h-16" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] uppercase tracking-widest font-bold">Full Description</label>
                <textarea value={editing.longDescription} onChange={e => setEditing({ ...editing, longDescription: e.target.value })} className="mt-1 w-full border border-[#E7E4DA] rounded-2xl px-4 py-2.5 h-24" />
              </div>

              <div className="md:col-span-2 rounded-2xl border border-dashed border-[#D8D4C8] bg-[#FBFAF6] p-4">
                <label className="text-[11px] uppercase tracking-widest font-bold">Product Images ({editing.images.length})</label>
                <div className="mt-3 flex flex-wrap gap-3">
                  {editing.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="h-20 w-16 rounded-xl object-cover border border-[#E7E4DA]" />
                      <button onClick={() => setEditing({ ...editing, images: editing.images.filter((_, x) => x !== i) })} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                    </div>
                  ))}
                  <button onClick={() => fileRef.current?.click()} className="h-20 w-16 rounded-xl border-2 border-dashed border-[#D8D4C8] grid place-items-center text-2xl text-[#B5B1A5] hover:border-[#0B3B2C] hover:text-[#0B3B2C] transition">+</button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => addFiles(e.target.files)} />
                <div className="mt-3 flex gap-2">
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="...or paste image URL" className="flex-1 border border-[#E7E4DA] rounded-full px-4 py-2 text-sm bg-white" />
                  <button onClick={() => { if (urlInput.trim()) { setEditing({ ...editing, images: [...editing.images, urlInput.trim()] }); setUrlInput(""); } }} className="rounded-full bg-[#0B3B2C] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Add URL</button>
                </div>
                <p className="mt-2 text-[11px] text-[#6E6A60]">Upload from your device (stored safely in the database) or paste URLs.</p>
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  ["inStock", "Visible / In Stock"],
                  ["featured", "Featured (homepage)"],
                  ["bestseller", "Bestseller badge"],
                  ["newArrival", "New Arrival badge"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 accent-[#0B3B2C]" checked={!!(editing as Record<string, unknown>)[key]} onChange={e => setEditing({ ...editing, [key]: e.target.checked } as Product)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-full border-2 border-[#E7E4DA] font-bold text-sm hover:border-black transition">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-[2] py-3 rounded-full bg-[#0B3B2C] text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-black transition disabled:opacity-60 active:scale-[0.99]">
                {saving ? "Saving..." : editing.id ? "Save Changes" : "Publish Product"}
              </button>
            </div>
            <p className="text-[11px] text-center text-[#6E6A60] mt-4">Changes go live on the store instantly.</p>
          </div>
        </div>
      )}
    </div>
  );
}

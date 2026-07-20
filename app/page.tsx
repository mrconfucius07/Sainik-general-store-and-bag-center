import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatINR, discountPercent, WHATSAPP_LINK } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import SmartImage from "@/components/SmartImage";

export const dynamic = "force-dynamic";

const toCard = (p: typeof products.$inferSelect) => ({
  id: String(p.id),
  slug: p.slug,
  name: p.name,
  description: p.description,
  longDescription: p.longDescription || p.description,
  category: p.category as never,
  subcategory: p.subcategory || "",
  brand: p.brand || "Sainik",
  price: p.price,
  originalPrice: p.originalPrice || undefined,
  images: p.images || [],
  colors: p.colors || [],
  materials: p.materials || "",
  rating: Number(p.rating) || 4.5,
  reviewCount: p.reviewCount || 0,
  featured: !!p.featured,
  bestseller: !!p.bestseller,
  newArrival: !!p.newArrival,
  inStock: !!p.inStock,
  stock: p.stock || 50,
  tags: p.tags || [],
  dimensions: p.dimensions || "",
  weight: p.weight || "",
  reviews: [],
  specifications: [],
});

const AISLES = [
  { cat: "Bags", emoji: "🎒", note: "School · College · Office" },
  { cat: "Trolley", emoji: "🧳", note: "Cabin · Check-in · Kids" },
  { cat: "Stationery", emoji: "✒️", note: "Pens · Diaries · Art" },
  { cat: "Gifts", emoji: "🎁", note: "Hampers · Festive · Corporate" },
  { cat: "Accessories", emoji: "👛", note: "Wallets · Tiffins · More" },
];

export default async function HomePage() {
  const all = await db.select().from(products);
  const bestsellers = all.filter(p => p.bestseller && p.inStock).slice(0, 4);
  const featured = all.filter(p => p.featured && p.inStock).slice(0, 8);
  const heroPick = all.find(p => p.featured && p.inStock) || all[0];

  return (
    <div className="pb-4">
      {/* ============ OPENING: store poster + product of the week ============ */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 pt-5">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-5">
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#0B3B2C] text-[#FBFAF6] dots-dark min-h-[520px] sm:min-h-[560px] flex flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F2A93B]/15 blur-3xl" aria-hidden />
            <div className="relative z-10 flex flex-wrap justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F2A93B] animate-pulse" /> Serving the neighbourhood since 2008
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/60">Open today · 10am – 9pm</span>
            </div>

            <div className="relative z-10 mt-10">
              <p className="font-extrabold uppercase tracking-[0.3em] text-[#F2A93B] text-xs mb-4">Bags · Trolleys · Gifts · Stationery</p>
              <h1 className="font-display text-[clamp(44px,7.5vw,92px)] leading-[0.88]">
                Every bag<br />
                carries a<br />
                <span className="text-[#F2A93B]">story.</span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[15px] sm:text-base leading-relaxed text-white/70">
                First-day school bags, first-flight trolleys, diaries for big ideas and hampers that say thank you — all under one roof, at one honest price.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex h-12 items-center rounded-full bg-[#F2A93B] px-7 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(0,0,0,0.45)] transition">
                  Shop the Collection
                </Link>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-full border-2 border-white/30 px-7 text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition">
                  💬 WhatsApp Us
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-[400px] border-t border-white/10 pt-6">
                <div><div className="font-display text-3xl text-[#F2A93B]">40%</div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">off school bags</div></div>
                <div><div className="font-display text-3xl text-[#F2A93B]">500+</div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">gift ideas</div></div>
                <div><div className="font-display text-3xl text-[#F2A93B]">₹0</div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">gift wrapping</div></div>
              </div>
            </div>
          </div>

          {/* Product of the week */}
          {heroPick && (
            <Link href={`/product/${heroPick.slug}`} className="group relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-[#E7E4DA] bg-[#F1EEE6] min-h-[280px] lg:min-h-0 block">
              <SmartImage src={heroPick.images[0]} alt={heroPick.name} className="transition-transform duration-700 group-hover:scale-[1.05]" sizes="(max-width: 1024px) 100vw, 35vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              {(() => { const d = discountPercent(heroPick.price, heroPick.originalPrice); return d ? (
                <span className="sticker absolute right-5 top-5 rounded-xl px-3 py-2 font-display text-lg animate-floaty">{d}% OFF</span>
              ) : null; })()}
              <div className="absolute left-5 top-5 rounded-full bg-black/70 backdrop-blur px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">⭐ Pick of the week</div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/70">{heroPick.brand} · {heroPick.subcategory || heroPick.category}</div>
                <div className="font-display text-2xl sm:text-[28px] leading-tight mt-1">{heroPick.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl text-[#F2A93B]">{formatINR(heroPick.price)}</span>
                  {heroPick.originalPrice && <span className="line-through text-white/60 text-sm">{formatINR(heroPick.originalPrice)}</span>}
                  <span className="ml-auto rounded-full bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-black group-hover:bg-[#F2A93B] transition">Grab it →</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ============ BRAND MARQUEE ============ */}
      <section className="mt-10 border-y-2 border-[#141714] bg-[#FBFAF6] py-3.5 overflow-hidden">
        <div className="flex w-[200%] animate-marquee">
          {[0, 1].map(k => (
            <div key={k} className="flex items-center gap-10 whitespace-nowrap px-5 font-display text-xl sm:text-2xl text-[#141714]" aria-hidden={k === 1}>
              {["Wildcraft", "Safari", "Skybags", "American Tourister", "Lavie", "Parker", "Classmate", "Milton", "Faber-Castell"].map(b => (
                <span key={b} className="flex items-center gap-10">{b}<span className="text-[#F2A93B]">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ AISLES ============ */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6 gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">Walk the aisles</h2>
          <Link href="/shop" className="hidden sm:inline text-xs font-black uppercase tracking-[0.2em] border-b-[3px] border-[#F2A93B] pb-1 hover:text-[#0B3B2C] transition">Everything →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {AISLES.map(a => {
            const count = all.filter(p => p.category === a.cat).length;
            return (
              <Link key={a.cat} href={`/shop?cat=${a.cat}`} className="group rounded-3xl border-2 border-[#E7E4DA] bg-white p-5 hover:border-[#0B3B2C] hover:shadow-[5px_5px_0_#0B3B2C] transition-all hover:-translate-y-1">
                <div className="text-4xl group-hover:scale-110 origin-left transition-transform">{a.emoji}</div>
                <div className="font-display text-xl mt-3 group-hover:text-[#0B3B2C] transition">{a.cat === "Trolley" ? "Trolley Bags" : a.cat}</div>
                <div className="text-[11px] font-bold text-[#6E6A60] mt-1">{a.note}</div>
                <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#E2452B]">{count} products →</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ BESTSELLERS ============ */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="font-display text-3xl sm:text-4xl flex items-center gap-3">
            <span className="inline-block h-8 w-2 bg-[#E2452B] rounded-full" /> Bestsellers
          </h2>
          <Link href="/shop" className="text-xs font-black uppercase tracking-[0.2em] border-b-[3px] border-[#F2A93B] pb-1">View all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.length > 0
            ? bestsellers.map((p, i) => <ProductCard key={p.id} product={toCard(p)} index={i} />)
            : <p className="col-span-full text-center py-12 text-[#6E6A60]">Stock is on the way — import demo products from <a className="underline font-bold" href="/admin">the admin panel</a>.</p>}
        </div>
      </section>

      {/* ============ OFFER BANNER ============ */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#F2A93B] px-7 sm:px-12 py-9 sm:py-10">
          <div className="absolute -right-8 -bottom-10 font-display text-[140px] sm:text-[200px] leading-none text-black/10 select-none" aria-hidden>₹</div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-black/60">Corporate &amp; wedding season</div>
              <h2 className="font-display text-3xl sm:text-5xl leading-[0.95] mt-2">Bulk gifting?<br />We do it better.</h2>
              <p className="mt-3 max-w-[52ch] text-sm sm:text-[15px] font-semibold text-black/70">120 hampers wrapped in one evening for a wedding last December. Diaries, pens &amp; hampers with your logo — name printing free at the store.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link href="/shop?cat=Gifts" className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B3B2C] px-8 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0_rgba(0,0,0,0.35)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(0,0,0,0.35)] transition">Get a bulk quote</Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-full border-2 border-black/70 px-8 text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-[#F2A93B] transition">WhatsApp Papa 📱</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HANDPICKED ============ */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="font-display text-3xl sm:text-4xl flex items-center gap-3">
            <span className="inline-block h-8 w-2 bg-[#F2A93B] rounded-full" /> Handpicked for you
          </h2>
          <span className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E6A60]">Curated weekly by the family</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.length > 0
            ? featured.map((p, i) => <ProductCard key={p.id} product={toCard(p)} index={i} />)
            : <p className="col-span-full text-center py-12 text-[#6E6A60]">New picks coming soon.</p>}
        </div>
      </section>

      {/* ============ TESTIMONIAL + TRUST ============ */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="lg:col-span-2 rounded-[28px] sm:rounded-[36px] bg-[#0B3B2C] text-white dots-dark p-7 sm:p-10">
            <div className="text-[#F2A93B] text-lg tracking-[0.3em]">★★★★★</div>
            <blockquote className="font-display text-2xl sm:text-3xl leading-tight mt-4">
              “120 wedding return gifts, each wrapped beautifully, ready in one evening. Guests are <span className="text-[#F2A93B]">still talking about it.</span>”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[#F2A93B] text-black grid place-items-center font-display">AK</div>
              <div>
                <div className="font-bold">Aditi &amp; Kabir</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Wedding order · Dec 2024</div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[["2 hrs", "bulk orders ready"], ["Free", "gift wrapping"], ["Same day", "city delivery"]].map(([big, small]) => (
                <div key={small} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="font-display text-xl text-[#F2A93B]">{big}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 mt-1">{small}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] sm:rounded-[36px] border-2 border-[#E7E4DA] bg-white p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#E2452B]">Why Sainik?</div>
              <ul className="mt-5 space-y-4">
                {[
                  ["🏷️", "Genuine brands", "Every item carries a real warranty card."],
                  ["🧵", "Name-slip stitching", "Free for every school bag we sell."],
                  ["🔁", "7-day easy exchange", "No drama, no questions, bhaiya promise."],
                  ["🧾", "GST billing", "Corporate & bulk invoices on request."],
                ].map(([icon, title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-extrabold text-sm">{title}</div>
                      <div className="text-xs text-[#6E6A60] mt-0.5">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/about" className="mt-6 inline-flex h-11 items-center justify-center rounded-full border-2 border-[#141714] text-xs font-black uppercase tracking-[0.2em] hover:bg-[#F2A93B] hover:border-[#F2A93B] transition">Our story →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

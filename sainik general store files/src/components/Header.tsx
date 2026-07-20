"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

const NAV = [
  { label: "Shop All", href: "/shop" },
  { label: "Bags", href: "/shop?cat=Bags" },
  { label: "Trolley", href: "/shop?cat=Trolley" },
  { label: "Stationery", href: "/shop?cat=Stationery" },
  { label: "Gifts", href: "/shop?cat=Gifts" },
];

export default function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Offer ticker */}
      <div className="w-full bg-[#0B3B2C] text-[#FBFAF6] text-[11px] font-bold tracking-[0.15em] uppercase py-2 overflow-hidden border-b-2 border-[#F2A93B]">
        <div className="flex w-[200%] animate-marquee">
          {[0, 1].map(k => (
            <div key={k} className="flex gap-12 whitespace-nowrap px-4" aria-hidden={k === 1}>
              <span><b className="text-[#F2A93B]">●</b> Free gift wrapping above ₹999</span>
              <span><b className="text-[#F2A93B]">●</b> School bags up to 40% off</span>
              <span><b className="text-[#F2A93B]">●</b> Same-day city delivery</span>
              <span><b className="text-[#F2A93B]">●</b> UPI • Cards • COD accepted</span>
              <span><b className="text-[#F2A93B]">●</b> Corporate &amp; bulk gifting — call +91 98765 43210</span>
            </div>
          ))}
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b transition-all ${scrolled ? "bg-[#FBFAF6]/95 backdrop-blur-md border-[#E7E4DA] shadow-[0_8px_30px_rgba(20,23,20,0.06)]" : "bg-[#FBFAF6] border-transparent"}`}>
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-10 w-10 rounded-xl bg-[#0B3B2C] text-[#F2A93B] grid place-items-center font-display text-xl shadow-[3px_3px_0_#F2A93B] group-hover:shadow-[3px_3px_0_#E2452B] transition-shadow">S</div>
            <div className="leading-none">
              <div className="font-display text-lg tracking-wide">SAINIK</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#6E6A60]">General Store &amp; Bag Center</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-extrabold uppercase tracking-widest">
            {NAV.map(n => (
              <Link key={n.label} href={n.href} className="relative py-1 hover:text-[#0B3B2C] transition after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-0 after:bg-[#F2A93B] after:transition-all hover:after:w-full">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={user ? "/account" : "/login"}
              className="hidden sm:inline-flex h-10 w-10 rounded-full border-2 border-[#E7E4DA] items-center justify-center hover:border-[#0B3B2C] hover:bg-[#0B3B2C] hover:text-white transition"
              title={user ? `My Account (${user.name})` : "Login"}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
            </Link>
            <button onClick={open} className="relative inline-flex h-10 items-center gap-2 rounded-full bg-[#0B3B2C] px-4 sm:px-5 text-white text-[11px] font-extrabold uppercase tracking-[0.18em] hover:bg-black transition active:scale-[0.97]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 2H2" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></svg>
              <span className="hidden sm:inline">Bag</span>
              {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#F2A93B] px-1 text-[11px] font-black text-black">{count}</span>}
            </button>
            <button onClick={() => setMobileOpen(v => !v)} aria-label="Menu" className="lg:hidden h-10 w-10 rounded-full border-2 border-[#E7E4DA] grid place-items-center hover:border-black transition">
              <div className="space-y-[5px]">
                <div className={`h-[2px] w-4 bg-[#141714] transition ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <div className={`h-[2px] w-4 bg-[#141714] transition ${mobileOpen ? "opacity-0" : ""}`} />
                <div className={`h-[2px] w-4 bg-[#141714] transition ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E7E4DA] bg-[#FBFAF6] px-6 py-6 space-y-4 animate-fade">
            {NAV.map(n => (
              <Link key={n.label} href={n.href} onClick={() => setMobileOpen(false)} className="block font-display text-2xl hover:text-[#0B3B2C]">{n.label}</Link>
            ))}
            <div className="border-t border-dashed border-[#E7E4DA] pt-4 flex gap-4 text-sm font-bold uppercase tracking-widest">
              <Link href={user ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="underline decoration-[#F2A93B] decoration-2 underline-offset-4">{user ? "My Account" : "Login / Sign Up"}</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

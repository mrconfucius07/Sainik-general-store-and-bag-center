import Link from "next/link";
import { WHATSAPP_LINK } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-[#0B3B2C] text-[#EFEDE5] mt-24 dots-dark">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-[#F2A93B] text-black grid place-items-center font-display text-xl">S</div>
            <div>
              <div className="font-display text-lg text-white">SAINIK</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/60">General Store &amp; Bag Center</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/70 max-w-[34ch]">
            Since 2008 — your neighbourhood store for bags, trolleys, stationery &amp; gifts that carry stories.
          </p>
          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
            <div className="font-bold text-[#F2A93B] uppercase text-[11px] tracking-widest mb-1">Store Hours</div>
            Mon – Sun · 10:00 am – 9:00 pm
          </div>
        </div>

        <div>
          <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase mb-5 text-[#F2A93B]">Shop</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/shop?cat=Bags" className="hover:text-[#F2A93B] transition">School &amp; College Bags</Link></li>
            <li><Link href="/shop?cat=Trolley" className="hover:text-[#F2A93B] transition">Trolley Bags &amp; Luggage</Link></li>
            <li><Link href="/shop?cat=Gifts" className="hover:text-[#F2A93B] transition">Gift Hampers</Link></li>
            <li><Link href="/shop?cat=Stationery" className="hover:text-[#F2A93B] transition">Stationery &amp; Diaries</Link></li>
            <li><Link href="/shop?cat=Accessories" className="hover:text-[#F2A93B] transition">Wallets &amp; Accessories</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase mb-5 text-[#F2A93B]">Company</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-[#F2A93B] transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#F2A93B] transition">Contact Us</Link></li>
            <li><Link href="/returns" className="hover:text-[#F2A93B] transition">Return &amp; Refund Policy</Link></li>
            <li><Link href="/privacy" className="hover:text-[#F2A93B] transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#F2A93B] transition">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase mb-5 text-[#F2A93B]">Visit / Reach Us</div>
          <p className="text-sm leading-relaxed text-white/70">
            Near Main Bus Stand, Opp. SBI Bank,<br />Sainik Market Road — 123456
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <a href="tel:+919876543210" className="block font-bold text-[#F2A93B] hover:underline">📞 +91 98765 43210</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block font-bold text-[#25D366] hover:underline">💬 WhatsApp us anytime</a>
            <a href="mailto:sainikbagcenter@gmail.com" className="block text-white/80 hover:underline">✉️ sainikbagcenter@gmail.com</a>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1">UPI</span>
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1">Cards</span>
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1">COD</span>
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1">Razorpay Secure</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-white/50">
          <span>© {new Date().getFullYear()} Sainik General Store &amp; Bag Center · Made with ❤️ in India</span>
          <Link href="/admin/login" className="hover:text-[#F2A93B] transition">Owner Login</Link>
        </div>
      </div>
    </footer>
  );
}

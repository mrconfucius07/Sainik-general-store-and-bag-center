import { notFound } from "next/navigation";
import Link from "next/link";

const PAGES: Record<string, { title: string; updated: string; sections: { h: string; body: string[] }[] }> = {
  about: {
    title: "About Us",
    updated: "A shop with a story since 2008",
    sections: [
      { h: "One shop, a thousand firsts", body: ["Sainik General Store & Bag Center started in 2008 with a single shelf of school bags near the Main Bus Stand. Today we stock 500+ products across bags, trolleys, stationery, gifts and accessories — but the promise hasn’t changed: genuine brands, honest prices, and advice that puts your need above our sale.", "We are a family-run store. Papa still sits at the counter, checks every zipper on every trolley before it goes on the shelf, and refuses to stock anything he wouldn’t give his own grandchildren."] },
      { h: "What we stand for", body: ["Genuine products with real warranty cards — no first copies, ever. Free name-slip stitching on every school bag. Free gift wrapping, always. Corporate and bulk gifting handled personally, with GST billing. And a 7-day exchange policy with zero drama."] },
      { h: "Visit us", body: ["Near Main Bus Stand, Opp. SBI Bank, Sainik Market Road. Open Monday to Sunday, 10 am to 9 pm. Chai is on us if you mention this page."] },
    ],
  },
  returns: {
    title: "Return & Refund Policy",
    updated: "Last updated: January 2025",
    sections: [
      { h: "7-day easy exchange", body: ["Unused products in original packing with tags and bill can be exchanged within 7 days of purchase/delivery. Bring the product to the store or WhatsApp us a photo — we’ll arrange pickup within the city."] },
      { h: "Refunds", body: ["If a replacement isn’t available, refunds are processed to the original payment method within 5–7 working days. COD orders are refunded via UPI/bank transfer. Shipping charges are non-refundable unless the product arrived damaged or wrong."] },
      { h: "Damaged / wrong item", body: ["Please record a quick unboxing video for orders above ₹2,000. If your item arrives damaged or incorrect, report within 48 hours with photos and we will replace it free of cost — shipping on us."] },
      { h: "Non-returnable items", body: ["Gift hampers with opened food items, personalised/embossed products (name-printed pens, monogrammed wallets), and inner-wear category items cannot be returned for hygiene reasons."] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: January 2025",
    sections: [
      { h: "What we collect", body: ["When you create an account or place an order we store your name, email, phone and delivery address. Payments are processed by Razorpay — your card or UPI details never touch our servers."] },
      { h: "How we use it", body: ["To deliver your orders, send order updates on WhatsApp/email, and remember your bag across visits. We do not sell or rent your data. Ever."] },
      { h: "Cookies & storage", body: ["We use a secure session cookie to keep you logged in and browser storage to remember your shopping bag. Clearing browser data simply logs you out and empties the bag."] },
      { h: "Your rights", body: ["Email sainikbagcenter@gmail.com anytime to view, correct or delete your account and personal data. We respond within 48 hours."] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "Last updated: January 2025",
    sections: [
      { h: "Orders & pricing", body: ["All prices are in Indian Rupees and inclusive of GST where applicable. We reserve the right to cancel orders arising from pricing errors or stock unavailability, with a full refund.", "Cash-on-Delivery orders are confirmed by phone. If we can’t reach you within 24 hours, the order may be cancelled."] },
      { h: "Delivery", body: ["City deliveries typically arrive same/next day; elsewhere 2–5 working days via our courier partners. Risk in the products passes to you on delivery."] },
      { h: "Warranties", body: ["Brand warranties (Wildcraft, Safari, American Tourister, etc.) are honoured by the respective brand service centres. We help you with the paperwork — bring the bill and warranty card."] },
      { h: "Accounts", body: ["You are responsible for keeping your password confidential. Notify us immediately of any unauthorised use of your account."] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map(slug => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-[860px] px-4 sm:px-6 py-12">
      <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#E2452B]">Sainik General Store</div>
      <h1 className="font-display text-4xl sm:text-5xl mt-3">{page.title}</h1>
      <p className="text-sm text-[#6E6A60] mt-2 mb-10">{page.updated}</p>

      <div className="space-y-8">
        {page.sections.map(s => (
          <section key={s.h} className="rounded-[24px] border-2 border-[#E7E4DA] bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl sm:text-2xl text-[#0B3B2C]">{s.h}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-[15px] leading-relaxed text-[#45423B]">{p}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-[24px] bg-[#0B3B2C] text-white dots-dark p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-display text-xl">Questions? Talk to a human.</div>
        <div className="flex gap-3">
          <Link href="/contact" className="rounded-full bg-[#F2A93B] text-black px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em]">Contact Us</Link>
          <Link href="/shop" className="rounded-full border-2 border-white/30 px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em]">Back to Shop</Link>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { WHATSAPP_LINK } from "@/lib/utils";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) setForm({ name: "", phone: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-12">
      <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#E2452B]">We reply fast</div>
      <h1 className="font-display text-4xl sm:text-5xl mt-3">Contact us</h1>
      <p className="text-[#6E6A60] mt-3 max-w-[56ch]">Bulk order? Gift idea? Warranty help? Message us — Papa or Bhaiya will get back within the hour during store time.</p>

      <div className="mt-10 grid lg:grid-cols-[1fr_0.8fr] gap-6">
        <form onSubmit={submit} className="rounded-[28px] border-2 border-[#E7E4DA] bg-white p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest">Your name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aditi Sharma" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-widest">Message *</label>
            <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} placeholder="I need 25 diaries with our company logo by Friday..." className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
          </div>
          <button disabled={status === "sending"} className="w-full min-h-12 rounded-full bg-[#0B3B2C] text-white text-xs font-black uppercase tracking-[0.22em] hover:bg-black transition disabled:opacity-60">
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
          {status === "sent" && <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">✓ Message received! We’ll reply within the hour (10am–9pm).</div>}
          {status === "error" && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">Something went wrong — please WhatsApp us instead.</div>}
        </form>

        <div className="space-y-4">
          <div className="rounded-[28px] bg-[#0B3B2C] text-white dots-dark p-7">
            <div className="font-display text-xl text-[#F2A93B]">The Store</div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">Near Main Bus Stand, Opp. SBI Bank,<br />Sainik Market Road — 123456</p>
            <div className="mt-4 text-sm"><span className="text-white/60">Hours:</span> <b>Mon–Sun · 10am–9pm</b></div>
          </div>
          <a href="tel:+919876543210" className="block rounded-[24px] border-2 border-[#E7E4DA] bg-white p-6 hover:border-[#0B3B2C] transition">
            <div className="text-2xl">📞</div>
            <div className="font-display text-lg mt-2">+91 98765 43210</div>
            <div className="text-xs text-[#6E6A60] mt-1">Tap to call — bulk orders &amp; quotes</div>
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block rounded-[24px] bg-[#25D366] p-6 text-black hover:scale-[1.01] transition">
            <div className="text-2xl">💬</div>
            <div className="font-display text-lg mt-2">WhatsApp us</div>
            <div className="text-xs font-bold mt-1">Send photos of what you need — fastest way!</div>
          </a>
        </div>
      </div>
    </div>
  );
}

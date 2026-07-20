"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState("");
  const [devLink, setDevLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setDone(data.message || "Request received");
    if (data.devLink) setDevLink(data.devLink);
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F1EEE6] px-6">
      <div className="w-full max-w-[420px]">
        <h1 className="font-display text-3xl">Reset admin password</h1>
        <p className="text-sm text-[#6E6A60] mt-2 mb-6">We’ll email you a secure link (valid for 1 hour).</p>

        <form onSubmit={submit} className="bg-white border border-[#E7E4DA] rounded-3xl p-8 space-y-4">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin email" className="w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
          <button disabled={loading} className="w-full h-12 rounded-full bg-[#0B3B2C] text-white text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-60">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {done && <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">{done}</div>}
          {devLink && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 break-all">
              <b>Dev mode (SMTP not configured):</b> use this link directly — <a className="underline font-bold" href={devLink}>{devLink}</a>
            </div>
          )}
          <p className="text-center text-sm"><Link href="/admin/login" className="underline">← Back to login</Link></p>
        </form>
      </div>
    </div>
  );
}

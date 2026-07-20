"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Signup failed");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[440px] px-6 py-14">
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.25em] text-[#F2A93B] font-bold">Join the family</div>
        <h1 className="font-display text-4xl mt-2">Create your account</h1>
        <p className="text-sm text-[#6E6A60] mt-2">Order history, tracking & member-only offers.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-[#E7E4DA] rounded-3xl p-8 space-y-5">
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Full name</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aditi Sharma" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Email</label>
          <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Phone (for delivery updates)</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Password (6+ characters)</label>
          <input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        <button disabled={loading} className="w-full h-12 rounded-full bg-[#0B3B2C] text-white text-[13px] uppercase tracking-[0.2em] font-bold hover:bg-black transition active:scale-[0.98] disabled:opacity-60">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-center text-sm text-[#6E6A60]">
          Already a member? <Link href="/login" className="font-bold text-[#0B3B2C] underline decoration-[#F2A93B] decoration-2 underline-offset-4">Login</Link>
        </p>
      </form>
    </div>
  );
}

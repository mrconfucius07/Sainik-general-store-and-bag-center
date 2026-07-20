"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Invalid credentials");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#0B3B2C] px-6 py-12" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-[#F2A93B] text-black items-center justify-center text-3xl font-display shadow-[4px_4px_0_rgba(0,0,0,0.4)]">S</div>
          <h1 className="font-display text-3xl text-white mt-5">Owner Dashboard</h1>
          <p className="text-white/60 mt-1 text-xs tracking-[0.25em] uppercase">Sainik General Store &amp; Bag Center</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest font-bold">Admin Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@sainikstore.com" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest font-bold">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
            </div>
          </div>
          {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button disabled={loading} className="mt-6 w-full h-12 rounded-full bg-[#0B3B2C] text-white text-[13px] uppercase tracking-[0.2em] font-bold hover:bg-black transition active:scale-[0.98] disabled:opacity-60">
            {loading ? "Checking..." : "Sign In"}
          </button>
          <div className="mt-5 text-center">
            <Link href="/admin/forgot-password" className="text-sm text-[#6E6A60] underline decoration-[#F2A93B] decoration-2 underline-offset-4 hover:text-black">Forgot password?</Link>
          </div>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/50">
          First time? Default: admin@sainikstore.com / sainik2025 (set via ADMIN_EMAIL &amp; ADMIN_PASSWORD in .env)
        </p>
      </div>
    </div>
  );
}

"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const next = useSearchParams().get("next");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Login failed");
    router.push(data.user.role === "admin" ? "/admin" : next || "/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[440px] px-6 py-14">
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.25em] text-[#F2A93B] font-bold">Welcome back</div>
        <h1 className="font-display text-4xl mt-2">Login to your account</h1>
        <p className="text-sm text-[#6E6A60] mt-2">Track orders, save addresses, checkout faster.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-[#E7E4DA] rounded-3xl p-8 space-y-5">
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        <button disabled={loading} className="w-full h-12 rounded-full bg-[#0B3B2C] text-white text-[13px] uppercase tracking-[0.2em] font-bold hover:bg-black transition active:scale-[0.98] disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="text-center text-sm text-[#6E6A60]">
          New here? <Link href="/signup" className="font-bold text-[#0B3B2C] underline decoration-[#F2A93B] decoration-2 underline-offset-4">Create an account</Link>
        </p>
      </form>

      <div className="mt-6 rounded-2xl border border-dashed border-[#E7E4DA] p-4 text-center text-xs text-[#6E6A60]">
        Store owner? <Link href="/admin/login" className="font-bold underline">Go to Admin login →</Link>
      </div>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}

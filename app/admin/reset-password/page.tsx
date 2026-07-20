"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setMsg({ ok: false, text: data.error || "Reset failed" });
    setMsg({ ok: true, text: "Password updated! Redirecting to login..." });
    setTimeout(() => router.push("/admin/login"), 1500);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F1EEE6] px-6">
      <div className="w-full max-w-[420px]">
        <h1 className="font-display text-3xl">Choose a new password</h1>
        <form onSubmit={submit} className="mt-6 bg-white border border-[#E7E4DA] rounded-3xl p-8 space-y-4">
          {!token && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">Missing reset token. Please request a new link.</div>}
          <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="New password (6+ characters)" className="w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
          <button disabled={loading || !token} className="w-full h-12 rounded-full bg-[#0B3B2C] text-white text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-60">
            {loading ? "Updating..." : "Update Password"}
          </button>
          {msg && <div className={`rounded-xl px-4 py-3 text-sm border ${msg.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>{msg.text}</div>}
          <p className="text-center text-sm"><Link href="/admin/login" className="underline">← Back to login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <ResetForm />
    </Suspense>
  );
}

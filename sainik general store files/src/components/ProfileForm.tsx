"use client";
import { useState } from "react";

export default function ProfileForm({ user }: { user: { name: string; email: string; phone: string | null } }) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", password: "" });
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMsg(res.ok ? "✓ Profile updated" : "Update failed");
    if (res.ok) setForm(f => ({ ...f, password: "" }));
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <form onSubmit={save} className="bg-white border border-[#E7E4DA] rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">Profile Details</h3>
        <span className="text-[11px] uppercase tracking-widest text-[#6E6A60]">{user.email}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest font-bold">Phone</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] uppercase tracking-widest font-bold">New password (leave blank to keep)</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="mt-1 w-full rounded-2xl border border-[#E7E4DA] bg-[#FBFAF6] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B2C]" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-[#0B3B2C] text-white px-7 py-2.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black active:scale-[0.97] transition">Save Changes</button>
        {msg && <span className="text-sm text-emerald-700 font-medium">{msg}</span>}
      </div>
    </form>
  );
}

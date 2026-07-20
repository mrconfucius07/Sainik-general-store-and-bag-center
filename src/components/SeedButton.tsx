"use client";
import { useState } from "react";

export default function SeedButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        const res = await fetch("/api/admin/seed", { method: "POST" });
        setBusy(false);
        if (res.ok) {
          const d = await res.json();
          alert(`Done! ${d.added} new products imported.`);
          window.location.reload();
        } else {
          alert("Seeding failed — are you logged in as admin?");
        }
      }}
      disabled={busy}
      className="rounded-full border-2 border-[#0B3B2C] px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-bold text-[#0B3B2C] hover:bg-[#0B3B2C] hover:text-white transition disabled:opacity-50"
    >
      {busy ? "Importing..." : "⚡ Import Demo Products"}
    </button>
  );
}

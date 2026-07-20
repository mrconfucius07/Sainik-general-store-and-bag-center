"use client";
import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="px-3 sm:px-4 py-1.5 rounded-full bg-[#E2452B] text-white text-xs tracking-widest uppercase font-bold hover:bg-red-600 transition whitespace-nowrap"
    >
      Logout
    </button>
  );
}

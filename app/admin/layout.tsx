import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import AdminLogout from "@/components/AdminLogout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F1EEE6]">
      <div className="border-b bg-[#0B3B2C] text-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded bg-[#F2A93B] text-black grid place-items-center font-display">S</div>
            <div className="leading-tight min-w-0">
              <div className="font-bold tracking-tight truncate">Sainik Admin</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60 truncate">{user.email}</div>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 text-sm overflow-x-auto">
            <Link href="/admin" className="px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap hover:bg-white/10 transition">Dashboard</Link>
            <Link href="/admin/products" className="px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap hover:bg-white/10 transition">Products</Link>
            <Link href="/admin/orders" className="px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap hover:bg-white/10 transition">Orders</Link>
            <Link href="/" className="px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap text-white/70 hover:text-white transition">View Store →</Link>
            <AdminLogout />
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}

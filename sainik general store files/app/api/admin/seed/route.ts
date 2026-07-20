import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { seedAdmin, seedProducts } from "@/lib/seed";

export async function POST() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await seedAdmin();
  const added = await seedProducts();
  return NextResponse.json({ success: true, added });
}

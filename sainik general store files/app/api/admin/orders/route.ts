import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json(allOrders);
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
  }
  const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, Number(id))).returning();
  return NextResponse.json(updated);
}

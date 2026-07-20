import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import { shippingFeeFor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;

  if (action === "razorpay-order") {
    const { items, shippingMethod = "standard" } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const ids = items.map((i: { productId: number }) => Number(i.productId));
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(rows.map(r => [r.id, r]));
    let subtotal = 0;
    for (const i of items) {
      const p = byId.get(Number(i.productId));
      if (!p) return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 409 });
      subtotal += p.price * Math.max(1, Number(i.quantity) || 1);
    }
    const total = subtotal + shippingFeeFor(subtotal, shippingMethod);
    try {
      const rzp = await createRazorpayOrder(total, `rcpt_${Date.now()}`);
      return NextResponse.json({ ...rzp, total });
    } catch (e) {
      return NextResponse.json({ error: "Could not start payment. Please try COD or retry." }, { status: 502 });
    }
  }

  if (action === "verify") {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const valid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return NextResponse.json({ valid });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

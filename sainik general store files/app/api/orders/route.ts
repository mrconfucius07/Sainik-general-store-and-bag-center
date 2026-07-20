import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { shippingFeeFor, makeOrderNo } from "@/lib/utils";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { notifyNewOrder } from "@/lib/notify";

export const dynamic = "force-dynamic";

/** Creates an order. Prices are always recomputed server-side from the database. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingAddress, shippingMethod = "standard", paymentMethod = "cod", razorpay, giftNote, email, fullName, phone } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!email || !fullName || !shippingAddress?.line1 || !shippingAddress?.pincode) {
      return NextResponse.json({ error: "Delivery details are incomplete" }, { status: 400 });
    }

    // Server-side pricing — never trust client totals
    const ids = items.map((i: { productId: number }) => Number(i.productId));
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(rows.map(r => [r.id, r]));

    let subtotal = 0;
    const orderItems = items.map((i: { productId: number; quantity: number; color?: string }) => {
      const p = byId.get(Number(i.productId));
      if (!p) throw new Error(`Product ${i.productId} not found`);
      const qty = Math.max(1, Math.min(99, Number(i.quantity) || 1));
      subtotal += p.price * qty;
      return { productId: p.id, name: p.name, sku: p.sku || undefined, price: p.price, quantity: qty, color: i.color, image: p.images?.[0] || "" };
    });

    const shippingFee = shippingFeeFor(subtotal, shippingMethod);
    const total = subtotal + shippingFee;

    // Verify payment for prepaid orders
    let paymentStatus = paymentMethod === "cod" ? "pending" : "failed";
    let razorpayOrderId: string | null = null;
    let razorpayPaymentId: string | null = null;
    if (paymentMethod === "prepaid") {
      if (!razorpay?.orderId || !razorpay?.paymentId || !razorpay?.signature) {
        return NextResponse.json({ error: "Payment details missing" }, { status: 400 });
      }
      const valid = verifyRazorpaySignature(razorpay.orderId, razorpay.paymentId, razorpay.signature);
      if (!valid) return NextResponse.json({ error: "Payment signature verification failed" }, { status: 402 });
      paymentStatus = "paid";
      razorpayOrderId = razorpay.orderId;
      razorpayPaymentId = razorpay.paymentId;
    }

    const user = await getCurrentUser();
    const orderNo = makeOrderNo();

    const [order] = await db
      .insert(orders)
      .values({
        orderNo,
        userId: user?.id ?? null,
        email: String(email).toLowerCase().trim(),
        fullName,
        phone: phone || user?.phone || null,
        items: orderItems,
        subtotal,
        shippingFee,
        total,
        shippingMethod,
        status: paymentMethod === "prepaid" ? "confirmed" : "pending",
        paymentMethod,
        paymentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        giftNote: giftNote || null,
        shippingAddress,
      })
      .returning();

    // Decrement stock (never below 0)
    for (const it of orderItems) {
      await db
        .update(products)
        .set({ stock: sql`greatest(0, ${products.stock} - ${it.quantity})` })
        .where(eq(products.id, it.productId));
    }

    // Fire owner notifications (email + WhatsApp + in-admin log) — never blocks checkout
    notifyNewOrder(order).catch(e => console.error("notify failed", e));

    return NextResponse.json({ success: true, order });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to place order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

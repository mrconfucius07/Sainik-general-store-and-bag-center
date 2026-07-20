import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  const allReviews = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  const byProduct = new Map<number, typeof allReviews>();
  for (const r of allReviews) {
    const list = byProduct.get(r.productId) || [];
    list.push(r);
    byProduct.set(r.productId, list);
  }
  return NextResponse.json(
    rows.map(r => ({
      ...r,
      reviews: (byProduct.get(r.id) || []).map(rv => ({
        id: String(rv.id),
        author: rv.author,
        avatar: rv.avatar || rv.author.slice(0, 2).toUpperCase(),
        rating: rv.rating,
        title: rv.title || "",
        comment: rv.comment,
        date: rv.createdAt ? new Date(rv.createdAt).toISOString().slice(0, 10) : "",
        verified: !!rv.verified,
      })),
    }))
  );
}

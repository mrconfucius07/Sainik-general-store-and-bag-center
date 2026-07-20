import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.name || !body.slug || !body.price) {
    return NextResponse.json({ error: "Name, slug and price are required" }, { status: 400 });
  }
  const [newProduct] = await db
    .insert(products)
    .values({
      sku: body.sku || `SNK-${Date.now().toString(36).toUpperCase()}`,
      slug: body.slug,
      name: body.name,
      description: body.description || body.name,
      longDescription: body.longDescription || body.description || "",
      category: body.category || "Bags",
      subcategory: body.subcategory || "",
      brand: body.brand || "Sainik",
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      images: Array.isArray(body.images) ? body.images : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      materials: body.materials || "",
      featured: !!body.featured,
      bestseller: !!body.bestseller,
      newArrival: !!body.newArrival,
      inStock: body.inStock !== false,
      stock: Number(body.stock) || 0,
      tags: Array.isArray(body.tags) ? body.tags : [],
      dimensions: body.dimensions || "",
      weight: body.weight || "",
    })
    .returning();
  return NextResponse.json(newProduct);
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const [updated] = await db
    .update(products)
    .set({
      sku: body.sku,
      name: body.name,
      description: body.description,
      longDescription: body.longDescription,
      category: body.category,
      subcategory: body.subcategory,
      brand: body.brand,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      images: body.images,
      colors: body.colors,
      materials: body.materials,
      featured: !!body.featured,
      bestseller: !!body.bestseller,
      newArrival: !!body.newArrival,
      inStock: !!body.inStock,
      stock: Number(body.stock) || 0,
      tags: body.tags,
      dimensions: body.dimensions,
      weight: body.weight,
    })
    .where(eq(products.id, Number(body.id)))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await db.delete(products).where(eq(products.id, Number(id)));
  return NextResponse.json({ success: true });
}

import { db } from "@/db";
import { users, products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { products as staticProducts } from "@/lib/products";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@sainikstore.com";
  const password = process.env.ADMIN_PASSWORD || "sainik2025";
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({
      name: "Store Owner",
      email,
      passwordHash: await hashPassword(password),
      role: "admin",
    });
    console.log(`✓ Admin created: ${email}`);
  }
}

export async function seedProducts() {
  let added = 0;
  for (const p of staticProducts) {
    const exists = await db.select({ id: products.id }).from(products).where(eq(products.slug, p.slug)).limit(1);
    if (exists.length > 0) continue;
    const sku = `SNK-${p.category.slice(0, 3).toUpperCase()}-${p.id.padStart(3, "0")}`;
    const [row] = await db
      .insert(products)
      .values({
        sku,
        slug: p.slug,
        name: p.name,
        description: p.description,
        longDescription: p.longDescription,
        category: p.category,
        subcategory: p.subcategory,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        images: p.images,
        colors: p.colors,
        materials: p.materials,
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: p.featured,
        bestseller: p.bestseller,
        newArrival: p.newArrival,
        inStock: p.inStock,
        stock: p.stock,
        tags: p.tags,
        dimensions: p.dimensions,
        weight: p.weight,
      })
      .returning();
    added++;
    for (const r of p.reviews) {
      await db.insert(reviews).values({
        productId: row.id,
        author: r.author,
        avatar: r.avatar,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verified: r.verified,
      });
    }
  }
  return added;
}

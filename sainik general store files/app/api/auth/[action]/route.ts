import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, destroySession, getCurrentUser } from "@/lib/auth";

const safe = (u: { id: number; name: string; email: string; phone: string | null; role: string }) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
});

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  if (action === "signup") {
    const { name, email, phone, password } = body;
    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: "Name, email and a password of 6+ characters are required" }, { status: 400 });
    }
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "An account with this email already exists. Please login." }, { status: 409 });
    const [user] = await db
      .insert(users)
      .values({ name, email: email.toLowerCase().trim(), phone: phone || null, passwordHash: await hashPassword(password), role: "customer" })
      .returning();
    await createSession(user.id);
    return NextResponse.json({ user: safe(user) });
  }

  if (action === "login") {
    const { email, password } = body;
    const [user] = await db.select().from(users).where(eq(users.email, String(email || "").toLowerCase().trim())).limit(1);
    if (!user || !(await verifyPassword(String(password || ""), user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ user: safe(user) });
  }

  if (action === "logout") {
    await destroySession();
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    const { name, phone, password } = body;
    const patch: Record<string, unknown> = {};
    if (name) patch.name = name;
    if (phone !== undefined) patch.phone = phone || null;
    if (password) {
      if (password.length < 6) return NextResponse.json({ error: "Password must be 6+ characters" }, { status: 400 });
      patch.passwordHash = await hashPassword(password);
    }
    const [updated] = await db.update(users).set(patch).where(eq(users.id, user.id)).returning();
    return NextResponse.json({ user: safe(updated) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

export async function GET(_req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (action === "me") {
    const user = await getCurrentUser();
    return NextResponse.json({ user: user ? safe(user) : null });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

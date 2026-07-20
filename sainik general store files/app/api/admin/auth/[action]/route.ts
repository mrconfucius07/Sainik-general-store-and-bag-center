import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyPassword, hashPassword, createSession, destroySession } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  if (action === "login") {
    const { email, password } = body;
    const [user] = await db.select().from(users).where(eq(users.email, String(email || "").toLowerCase().trim())).limit(1);
    if (!user || user.role !== "admin" || !(await verifyPassword(String(password || ""), user.passwordHash))) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  if (action === "logout") {
    await destroySession();
    return NextResponse.json({ ok: true });
  }

  if (action === "forgot") {
    const email = String(body.email || "").toLowerCase().trim();
    const [user] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, "admin"))).limit(1);
    let devLink: string | undefined;
    if (user) {
      const token = crypto.randomBytes(24).toString("hex");
      await db.insert(passwordResetTokens).values({ token, email, expiresAt: new Date(Date.now() + 60 * 60 * 1000) });
      const link = `${process.env.SITE_URL || "http://localhost:3000"}/admin/reset-password?token=${token}`;
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: "Reset your Sainik Admin password",
            html: `<p>Click below to reset your admin password (valid 1 hour):</p><p><a href="${link}">${link}</a></p>`,
          });
        } catch (e) {
          console.error("reset email failed", e);
        }
      } else if (process.env.NODE_ENV !== "production") {
        devLink = link; // shown only in dev when email is not configured
      }
    }
    return NextResponse.json({ ok: true, message: "If that admin email exists, a reset link has been sent.", devLink });
  }

  if (action === "reset") {
    const { token, password } = body;
    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid token or password too short" }, { status: 400 });
    }
    const [row] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
    if (!row || row.used || row.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset link expired or already used" }, { status: 400 });
    }
    const [user] = await db.select().from(users).where(eq(users.email, row.email)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    await db.update(users).set({ passwordHash: await hashPassword(password) }).where(eq(users.id, user.id));
    await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, row.id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}

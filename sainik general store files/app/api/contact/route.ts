import { NextResponse } from "next/server";
import { notifyContact } from "@/lib/notify";

export async function POST(req: Request) {
  const { name, phone, message } = await req.json().catch(() => ({}));
  if (!name || !message) return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  await notifyContact(String(name), String(phone || ""), String(message));
  return NextResponse.json({ ok: true });
}

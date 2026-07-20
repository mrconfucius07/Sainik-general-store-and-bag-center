import { db } from "@/db";
import { notifications } from "@/db/schema";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "orders@sainikstore.com";
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER || "";

function emailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function log(kind: string, channel: string, sentTo: string, subject: string, body: string, status: string) {
  try {
    await db.insert(notifications).values({ kind, channel, sentTo, subject, body, status });
  } catch (e) {
    console.error("notify log failed", e);
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<"sent" | "failed"> {
  if (!emailConfigured()) return "failed";
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Sainik Store" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return "sent";
  } catch (e) {
    console.error("email failed", e);
    return "failed";
  }
}

async function sendWhatsApp(message: string): Promise<"sent" | "failed"> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId || !ADMIN_WHATSAPP) return "failed";
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: ADMIN_WHATSAPP,
        type: "text",
        text: { body: message },
      }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/** Fired when a new order is placed: notifies the owner by email + WhatsApp and logs everything. */
export async function notifyNewOrder(order: {
  orderNo: string | null;
  fullName: string;
  phone?: string | null;
  email: string;
  total: number;
  paymentMethod: string | null;
  items: { name: string; quantity: number; price: number; color?: string }[];
}) {
  const orderNo = order.orderNo || "NEW-ORDER";
  const subject = `🛍️ New order ${orderNo} — ₹${order.total} (${String(order.paymentMethod).toUpperCase()})`;
  const itemLines = order.items
    .map((it) => `<li>${it.name}${it.color ? ` (${it.color})` : ""} × ${it.quantity} — ₹${it.price * it.quantity}</li>`)
    .join("");
  const html = `
    <h2>New order ${orderNo}</h2>
    <p><b>${order.fullName}</b> • ${order.email} • ${order.phone || "no phone"}</p>
    <ul>${itemLines}</ul>
    <p><b>Total: ₹${order.total}</b> • Payment: ${String(order.paymentMethod).toUpperCase()}</p>
    <p>Login to <a href="/admin/orders">admin panel</a> to process it.</p>`;
  const plain = `New order ${orderNo}\n${order.fullName} (${order.phone || ""})\n${order.items.map((i) => `- ${i.name} x${i.quantity} = Rs.${i.price * i.quantity}`).join("\n")}\nTotal Rs.${order.total} • ${String(order.paymentMethod).toUpperCase()}`;

  const emailStatus = emailConfigured() ? await sendEmail(ADMIN_EMAIL, subject, html) : "skipped";
  await log("order_email", "email", ADMIN_EMAIL, subject, plain, emailStatus);

  const waStatus = await sendWhatsApp(plain);
  await log("order_whatsapp", "whatsapp", ADMIN_WHATSAPP || "not-configured", subject, plain, waStatus);
}

/** Fired from the Contact Us page. */
export async function notifyContact(name: string, phone: string, message: string) {
  const subject = `💬 Website enquiry — ${name}`;
  const body = `${name} (${phone}) wrote:\n${message}`;
  const emailStatus = emailConfigured() ? await sendEmail(ADMIN_EMAIL, subject, `<p>${body.replace(/\n/g, "<br/>")}</p>`) : "skipped";
  await log("contact", "email", ADMIN_EMAIL, subject, body, emailStatus);
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(price: number, original?: number | null) {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}

export const FREE_SHIPPING_THRESHOLD = 999;

/** Rule-based shipping: standard free above ₹999 (else ₹79), express flat ₹149. */
export function shippingFeeFor(subtotal: number, method: "standard" | "express" = "standard") {
  if (method === "express") return 149;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 79;
}

export function makeOrderNo() {
  return "SNK-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Sainik Store! I need help with bags/gifts 🛍️")}`;

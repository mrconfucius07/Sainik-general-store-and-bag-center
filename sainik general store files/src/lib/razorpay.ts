import crypto from "crypto";

const keyId = () => process.env.RAZORPAY_KEY_ID;
const secret = () => process.env.RAZORPAY_KEY_SECRET;

export function razorpayConfigured() {
  return !!(keyId() && secret());
}

export function clientKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId() || "";
}

/** Creates a Razorpay order server-side. Falls back to a clearly-marked test mode when keys are absent. */
export async function createRazorpayOrder(amountRupees: number, receipt: string) {
  if (!razorpayConfigured()) {
    return {
      testMode: true,
      id: "order_test_" + crypto.randomBytes(8).toString("hex"),
      amount: amountRupees * 100,
      currency: "INR",
      keyId: clientKeyId(),
    };
  }
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${keyId()}:${secret()}`).toString("base64"),
    },
    body: JSON.stringify({ amount: amountRupees * 100, currency: "INR", receipt }),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order creation failed: ${res.status}`);
  }
  const data = await res.json();
  return { ...data, testMode: false, keyId: clientKeyId() };
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  if (!razorpayConfigured()) {
    return signature === "test_signature"; // demo mode
  }
  const expected = crypto.createHmac("sha256", secret()!).update(`${orderId}|${paymentId}`).digest("hex");
  return expected === signature;
}

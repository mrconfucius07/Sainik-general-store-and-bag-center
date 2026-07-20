# 🏪 Sainik Store — Owner Guide

## Login

1. Open **/admin** (or “Owner Login” in the website footer)
2. Email: `admin@sainikstore.com` · Password: `sainik2025`
   *(set your own via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` and re-run `npx tsx scripts/seed.ts`)*
3. Forgot password? Use **/admin/forgot-password** — a reset link is emailed (SMTP must be configured; in dev the link is shown on screen).

## Dashboard (/admin)
- Live stats: products, orders, revenue, low-stock alerts
- **Notification Log** — every email/WhatsApp alert sent for each order (status: sent / skipped / failed)
- **⚡ Import Demo Products** — one-click sample catalogue

## Products (/admin/products)
- **New Product** button: Name, SKU (auto-generated if blank), Brand, Category, Subcategory, Selling Price, Offer/MRP Price (shown struck-through + % OFF sticker), Stock, Material, Short + Full description
- **Images**: upload multiple photos from your device (stored in the database — survives redeploys) or paste URLs
- Flags: In Stock / Featured (homepage) / Bestseller / New Arrival badges
- Edit & Delete anytime — changes are live instantly

## Orders (/admin/orders)
- Status pipeline: **Pending → Confirmed → Shipped → Delivered** (or Cancelled)
- Filter tabs per status, full order detail modal (items, address, gift note, payment info)
- Prepaid (Razorpay) orders arrive as **Confirmed**; COD orders arrive as **Pending** for you to verify by phone

## New-order alerts
Configure in `.env` (see DEPLOYMENT.md):
- **Email**: any SMTP (Zoho, Gmail app password, Brevo) → alert to `ADMIN_NOTIFY_EMAIL`
- **WhatsApp**: Meta WhatsApp Cloud API → alert to `ADMIN_WHATSAPP_NUMBER`
- Even without keys, every order is recorded in the Dashboard Notification Log

## Customers
- Sign up at `/signup`, track orders at `/account` (profile + order timeline)
- Checkout supports Razorpay (UPI, GPay, PhonePe, Paytm, Cards, Netbanking) and COD
- Shipping: free above ₹999 (else ₹79), express same-day ₹149

## Changing your password
Add `ADMIN_PASSWORD=yourNewPassword` to `.env`, run `npx tsx scripts/seed.ts` (only creates the admin if it doesn't exist — to change an existing password, use the forgot-password flow or delete the user row and re-seed).

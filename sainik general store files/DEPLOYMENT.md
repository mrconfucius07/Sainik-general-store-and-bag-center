# 🚀 Deploy Sainik Store to Vercel (Production Guide)

## What you have

A complete production-ready Next.js 16 + TypeScript + PostgreSQL (Drizzle ORM) e-commerce store:

- Customer auth (signup/login/logout) + My Account with order tracking
- Admin panel at `/admin` (email + hashed password, forgot-password flow)
- Products persisted in PostgreSQL — **data survives redeploys** (it lives in the DB, not the filesystem)
- Razorpay payments (UPI, GPay, PhonePe, Paytm, cards, netbanking) + COD
- Order management with 5 statuses, stock auto-decrement, SKU support
- Owner email + WhatsApp notifications on every order
- Policy pages, WhatsApp chat button, mobile-first responsive design

---

## Step 1 — Get a hosted Postgres (recommended: Supabase)

1. Go to https://supabase.com → New project (free tier is fine)
2. Open **Project Settings → Database → Connection pooling**
3. Copy the **Transaction pooler** connection string (port `654`? use the pooler URI)

Any Postgres works: Supabase, Neon, Railway, Aiven, RDS.

## Step 2 — Create Vercel project

1. Push this folder to a GitHub repo
2. https://vercel.com → New Project → import the repo (framework auto-detected: Next.js)

## Step 3 — Add environment variables (Vercel → Project → Settings → Environment Variables)

Copy from `.env.example`. Minimum required for launch:

```
DATABASE_URL=<your supabase/postgres connection string>
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=<strong password>
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

Then add when ready to go live with payments/notifications:

```
RAZORPAY_KEY_ID=...            # Razorpay Dashboard → Settings → API Keys (use Live keys at launch)
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
SMTP_HOST=smtp.zoho.in         # any SMTP: Zoho/Gmail-app-password/Brevo
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=orders@yourstore.com
ADMIN_NOTIFY_EMAIL=you@yourstore.com
WHATSAPP_TOKEN=...             # Meta for Developers → WhatsApp Cloud API
WHATSAPP_PHONE_ID=...
ADMIN_WHATSAPP_NUMBER=91XXXXXXXXXX
```

> **Without Razorpay keys** the store runs in a clearly-labelled demo payment mode. Without SMTP/WhatsApp keys, orders are still logged to the admin Notification Log — nothing is lost.

## Step 4 — Create tables + seed

Run once from your laptop (or any machine with the DATABASE_URL):

```bash
npm install
npx drizzle-kit push      # creates all tables
npx tsx scripts/seed.ts   # creates your admin account + demo products
```

## Step 5 — Deploy

Vercel auto-deploys on every `git push`. Redeploys never touch your data.

---

## Owner cheat sheet

| Task | Where |
|---|---|
| Login to admin | `/admin/login` |
| Add/edit products, upload photos | `/admin/products` |
| Update order status | `/admin/orders` |
| See revenue / low stock / notification log | `/admin` (dashboard) |
| Forgot admin password | `/admin/forgot-password` |
| Customer accounts | `/signup`, `/account` |

## Local development

```bash
npm install
npx drizzle-kit push
npx tsx scripts/seed.ts
npm run dev
```

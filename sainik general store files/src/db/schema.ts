import { pgTable, serial, text, integer, boolean, timestamp, jsonb, varchar, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("customer"), // customer | admin
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 100 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 200 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 60 }).unique(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 300 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  images: jsonb("images").$type<string[]>().notNull(),
  colors: jsonb("colors").$type<{ name: string; hex: string }[]>(),
  materials: varchar("materials", { length: 200 }),
  rating: doublePrecision("rating").default(4.5),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  bestseller: boolean("bestseller").default(false),
  newArrival: boolean("new_arrival").default(false),
  inStock: boolean("in_stock").default(true),
  stock: integer("stock").default(50),
  tags: jsonb("tags").$type<string[]>(),
  dimensions: varchar("dimensions", { length: 100 }),
  weight: varchar("weight", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  author: varchar("author", { length: 150 }).notNull(),
  avatar: text("avatar"),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }),
  comment: text("comment").notNull(),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNo: varchar("order_no", { length: 30 }).unique(),
  userId: integer("user_id").references(() => users.id),
  email: varchar("email", { length: 200 }).notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  items: jsonb("items").$type<{ productId: number; name: string; price: number; quantity: number; color?: string; image: string; sku?: string }[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").default(0),
  total: integer("total").notNull(),
  shippingMethod: varchar("shipping_method", { length: 30 }).default("standard"),
  status: varchar("status", { length: 30 }).default("pending"), // pending | confirmed | shipped | delivered | cancelled
  paymentMethod: varchar("payment_method", { length: 30 }).default("cod"), // cod | prepaid
  paymentStatus: varchar("payment_status", { length: 30 }).default("pending"), // pending | paid | failed
  razorpayOrderId: varchar("razorpay_order_id", { length: 100 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 100 }),
  giftNote: text("gift_note"),
  shippingAddress: jsonb("shipping_address").$type<{ line1: string; city: string; state: string; pincode: string }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  kind: varchar("kind", { length: 40 }).notNull(), // order_email | order_whatsapp | contact
  channel: varchar("channel", { length: 20 }).notNull(), // email | whatsapp
  sentTo: varchar("sent_to", { length: 200 }).notNull(),
  subject: varchar("subject", { length: 300 }),
  body: text("body"),
  status: varchar("status", { length: 20 }).default("logged"), // sent | failed | skipped | logged
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

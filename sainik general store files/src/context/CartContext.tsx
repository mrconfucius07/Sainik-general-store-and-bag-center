"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
  color?: string;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: Product, qty?: number, color?: string) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQty: (productId: string, qty: number, color?: string) => void;
  clear: () => void;
};

const CartCtx = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sainik-cart-v2");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("sainik-cart-v2", JSON.stringify(items));
  }, [items, hydrated]);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.quantity, 0), [items]);

  const addItem = (product: Product, qty = 1, color?: string) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.product.id === product.id && p.color === color);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty, color, image: product.images[0] }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, color?: string) => {
    setItems(prev => prev.filter(p => !(p.product.id === productId && p.color === color)));
  };

  const updateQty = (productId: string, qty: number, color?: string) => {
    if (qty <= 0) return removeItem(productId, color);
    setItems(prev => prev.map(p => (p.product.id === productId && p.color === color ? { ...p, quantity: qty } : p)));
  };

  const clear = () => setItems([]);

  return (
    <CartCtx.Provider value={{ items, count, subtotal, isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false), addItem, removeItem, updateQty, clear }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

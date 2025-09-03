// CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "cart:v1";

// Example default product
const DEFAULT_CART = [
  {
    id: 0,
    label: "DROPS RB",
    price: 45,
    title: "Ibogenics DROPS RB (60 ml)",
    bullets: [
      "Botanical food supplement",
      "Refined Blend (RB)",
      "Vegan • Gluten-free • Natural",
    ],
    description:
      "Refined Blend for smooth, even effects—built for consistency day to day.",
    image: "/RB.png",  // make sure this exists in /public or import it
    thumb: "/RB.png",
    note: "Popular",
    qty: 1,
  },
];

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? safeParse(raw, null) : null;

    // Seed if nothing stored or empty
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(CART_KEY, JSON.stringify(DEFAULT_CART));
      return DEFAULT_CART;
    }
    return parsed;
  });

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY && e.newValue) {
        setItems(safeParse(e.newValue, []));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // cart operations
  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const setQty = (id, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: q } : p))
    );
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, p) => sum + (p.price ?? 0) * p.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, setQty, removeItem, clear, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

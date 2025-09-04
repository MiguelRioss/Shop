// CartContext.jsx (only the changed/added bits shown)
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "cart:v1";

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
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(CART_KEY, JSON.stringify([]));   // start empty in prod
      return [];
    }
    return parsed;
  });

  // NEW: track what was just added for the toast
  const [lastAdded, setLastAdded] = useState(null); // { product, qty, at: number } | null

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY && e.newValue) {
        setItems(safeParse(e.newValue, []));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
    // signal the toast
    setLastAdded({ product, qty, at: Date.now() });
  };

  const setQty = (id, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, p) => sum + (p.price ?? 0) * p.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, setQty, removeItem, clear, subtotal, lastAdded, setLastAdded }}
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

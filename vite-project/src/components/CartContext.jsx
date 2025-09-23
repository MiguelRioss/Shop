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

/** Parse a price value into a number (handles "€19,90", "19.90", "19,90", 19.9, etc.) */
function parsePrice(p) {
  if (typeof p === "number" && Number.isFinite(p)) return p;
  if (p == null) return 0;
  const s = String(p)
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/\u00A0/g, "");

  const cleaned = s.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/** Normalizes stored item shape: numeric price and sane qty
 *  It prefers priceInEuros if present, otherwise falls back to price
 */
function normalizeItem(p) {
  const sourcePrice = p?.priceInEuros ?? p?.price;
  return {
    ...p,
    price: parsePrice(sourcePrice),
    qty: Math.max(1, Number(p?.qty) || 1),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CART_KEY) : null;
    const parsed = raw ? safeParse(raw, null) : null;

    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      if (typeof window !== "undefined") localStorage.setItem(CART_KEY, JSON.stringify([]));
      return [];
    }

    // normalize previously stored items (coerce price->number and qty->number)
    return parsed.map(normalizeItem);
  });

  // track what was just added for the toast
  const [lastAdded, setLastAdded] = useState(null); // { product, qty, at: number } | null

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      // ignore quota/localStorage errors gracefully
    }
  }, [items]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY && e.newValue) {
        const parsed = safeParse(e.newValue, []);
        setItems(Array.isArray(parsed) ? parsed.map(normalizeItem) : []);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /**
   * addItem(product, qty)
   * - prefers product.priceInEuros, falls back to product.price
   * - stores items with numeric `price` and numeric `qty`
   */
  const addItem = (product, qty = 1) => {
    if (!product || product.id == null) {
      console.warn("addItem called without product or product.id");
      return;
    }

    const priceSource = product?.priceInEuros ?? product?.price;
    const priceNum = parsePrice(priceSource);
    // store price as numeric `price` for easy subtotal math while keeping original fields
    const productToStore = { ...product, price: priceNum };

    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === productToStore.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = {
          ...next[i],
          qty: Math.max(1, Number(next[i].qty) || 1) + Math.max(1, Number(qty) || 1),
          price: productToStore.price,
        };
        return next;
      }
      return [...prev, { ...productToStore, qty: Math.max(1, Number(qty) || 1) }];
    });

    setLastAdded({ product: { ...productToStore }, qty: Math.max(1, Number(qty) || 1), at: Date.now() });
  };

  const setQty = (id, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, p) => {
        const priceNum = parsePrice(p?.price);
        const q = Math.max(1, Number(p?.qty) || 1);
        return sum + priceNum * q;
      }, 0),
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

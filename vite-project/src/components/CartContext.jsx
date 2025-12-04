import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "cart:v1";
const CART_DISCOUNT_KEY = "cart:discount:v1";

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

function parsePrice(p) {
  if (typeof p === "number" && Number.isFinite(p)) return p;
  if (p == null) return 0;
  const s = String(p).replace(/\s/g, "").replace(/€/g, "").replace(/\u00A0/g, "");
  const cleaned = s.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

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
    return parsed.map(normalizeItem);
  });

  // Discount state (persisted)
  const [discount, setDiscount] = useState(() => {
    if (typeof window === "undefined") return null;
    return safeParse(localStorage.getItem(CART_DISCOUNT_KEY), null);
  });

  // Track last added for toast, etc.
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  useEffect(() => {
    try {
      if (discount) {
        localStorage.setItem(CART_DISCOUNT_KEY, JSON.stringify(discount));
      } else {
        localStorage.removeItem(CART_DISCOUNT_KEY);
      }
    } catch {}
  }, [discount]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY && e.newValue) {
        const parsed = safeParse(e.newValue, []);
        setItems(Array.isArray(parsed) ? parsed.map(normalizeItem) : []);
      }
      if (e.key === CART_DISCOUNT_KEY) {
        setDiscount(e.newValue ? safeParse(e.newValue, null) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = (product, qty = 1) => {
    if (!product || product.id == null) {
      console.warn("addItem called without product or product.id");
      return;
    }
    const priceSource = product?.priceInEuros ?? product?.price;
    const priceNum = parsePrice(priceSource);
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

  const clear = () => {
    setItems([]);
    setDiscount(null); // optional: also clear discount
  };

  // ---- Totals ----
  const subtotal = useMemo(
    () =>
      items.reduce((sum, p) => {
        const priceNum = parsePrice(p?.price);
        const q = Math.max(1, Number(p?.qty) || 1);
        return sum + priceNum * q;
      }, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!discount || subtotal <= 0) return 0;
    if (discount.type === "percent") {
      const pct = Math.max(0, Math.min(100, Number(discount.value)));
      return (subtotal * pct) / 100;
    }
    if (discount.type === "fixed") {
      return Math.max(0, Math.min(subtotal, parsePrice(discount.value)));
    }
    return 0;
  }, [discount, subtotal]);

  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  // ---- Convenience flags & getters ----
  // True only if a discount exists AND reduces the price
  const hasDiscount = useMemo(
    () => !!discount && discountAmount > 0,
    [discount, discountAmount]
  );

  // Human-friendly label or code (optional helper)
  const activeDiscountLabel = useMemo(
    () => (discount ? (discount.label || discount.code || null) : null),
    [discount]
  );

  // Raw value you might want to show (e.g., "10%" or "€50") (optional helper)
  const discountValueText = useMemo(() => {
    if (!discount) return null;
    if (discount.type === "percent") return `${Number(discount.value)}%`;
    if (discount.type === "fixed") return `€${parsePrice(discount.value).toFixed(2)}`;
    return null;
  }, [discount]);

  // ---- Public helpers ----
  const applyDiscount = ({ type, value, label, code, meta } = {}) => {
    if (type !== "percent" && type !== "fixed") {
      console.warn("applyDiscount: invalid type");
      return;
    }
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) {
      console.warn("applyDiscount: invalid value");
      return;
    }
    setDiscount({ type, value: v, label: label ?? null, code: code ?? null, meta: meta ?? null });
  };

  const clearDiscount = () => setDiscount(null);

  /**
   * applyCode(code, validate)
   * validate: async (code, items, subtotal) => { type, value, label } | null
   */
  const applyCode = async (code, validate) => {
    if (typeof validate !== "function") {
      console.warn("applyCode requires a validate(code, items, subtotal) function");
      return { ok: false, reason: "no-validator" };
    }
    const result = await validate(code, items, subtotal);
    if (!result) return { ok: false, reason: "invalid" };
    applyDiscount({ ...result, code });
    return { ok: true };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        setQty,
        removeItem,
        clear,
        subtotal,
        discount,
        discountAmount,
        total,
        applyDiscount,
        clearDiscount,
        applyCode,
        lastAdded,
        setLastAdded,
        // NEW flags/helpers
        hasDiscount,
        activeDiscountLabel,
        discountValueText,
      }}
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

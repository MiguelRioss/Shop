// components/CartToast.jsx
import React from "react";
import { useCart } from "./CartContext.jsx";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartToast() {
  const { lastAdded, setLastAdded } = useCart();
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);

    // reset timer on each new add
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      // delay clearing the payload until after fade-out
      setTimeout(() => setLastAdded(null), 200);
    }, 5600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastAdded, setLastAdded]);

  if (!lastAdded) return null;

  const { product, qty } = lastAdded;

  return (
    <div
      className={`fixed bottom-4 right-4 z-[90] transform transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="w-80 rounded-2xl border border-black/10 bg-white shadow-xl">
        <div className="flex items-start gap-3 p-3">
          <img
            src={product?.thumb || product?.image}
            alt={product?.title || product?.label || "Product"}
            className="h-12 w-12 rounded-lg object-cover border border-black/5"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-black">
              Added to cart
            </p>
            <p className="truncate text-sm text-black/70">
              {product?.title || product?.label} × {qty}
            </p>
          </div>
          <button
            aria-label="Close"
            className="rounded-md p-1 text-black/60 hover:bg-black/5"
            onClick={() => {
              setVisible(false);
              setTimeout(() => setLastAdded(null), 200);
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-t border-black/10 p-2">
          <Link
            to="/cart"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            onClick={() => setLastAdded(null)}
          >
            View cart
          </Link>
          <button
            className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5"
            onClick={() => setLastAdded(null)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

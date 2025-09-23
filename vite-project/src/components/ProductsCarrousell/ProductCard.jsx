import React from "react";
import { useCart } from "../../components/CartContext.jsx";

/**
 * ProductCard (layout unchanged — only formats price display)
 */
export default function ProductCard({
  id,
  image,
  price,           // old prop (string or number)
  priceInEuros,    // optional (preferred if present)
  title,
  description,
  onBuy = null, // if provided, it will be called; otherwise we call addItem(product, 1)
}) {
  const { addItem } = useCart();

  const product = {
    id,
    image,
    // keep original values — cart will normalize when adding
    price,
    priceInEuros,
    title,
    description,
  };

  const handleBuy = () => {
    if (typeof addItem === "function") {
      addItem(product, 1);
    } else {
      console.warn("addItem not available from useCart()");
    }
  };

  // -------------------------
  // Price parsing & formatting
  // -------------------------
  // parse string-ish prices into a number (19.9)
  const parsePrice = (p) => {
    if (typeof p === "number" && Number.isFinite(p)) return p;
    if (p == null) return 0;
    // remove spaces & non-numeric except comma/dot/minus, then normalize comma->dot
    const s = String(p).replace(/\s/g, "").replace(/€/g, "").replace(/\u00A0/g, "");
    const cleaned = s.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // format to localized euro string (pt-PT -> "19,90 €")
  const formatMoney = (valueNumber) => {
    try {
      return new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }).format(valueNumber);
    } catch {
      // fallback simple formatting
      return `€${(Number(valueNumber) || 0).toFixed(2)}`;
    }
  };

  // decide source and produce formatted price
  const rawSource = priceInEuros ?? price;
  const numericPrice = parsePrice(rawSource);
  const formattedPrice = formatMoney(numericPrice);

  // -------------------------
  // render (layout unchanged)
  // -------------------------
  return (
    <article className="w-64 sm:w-72 md:w-80 lg:w-96 bg-dark rounded-2xl shadow-sm overflow-hidden border border-gray-100 mx-auto">
      {/* image area: larger and uses object-contain so the whole photo appears */}
      <div className="relative bg-white flex items-center justify-center p-4">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="max-w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 object-contain"
        />

        {/* wishlist heart */}
        <button
          aria-label="Add to wishlist"
          type="button"
          className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 p-2 rounded-full shadow-sm border border-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="p-5 text-center">
        {/* formatted price shown here (no layout changes) */}
        <div className="text-lg font-semibold mb-2">{formattedPrice}</div>

        <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>

        <p className="text-sm text-gray-500 mb-4 max-h-20 overflow-hidden">
          {description}
        </p>

        <button
          onClick={handleBuy}
          className="w-full inline-block p-3 mb-3 rounded-full bg-black text-white font-semibold transition-transform active:scale-95"
        >
          Buy Now
        </button>

         <button
          onClick={/*TODO* Creat each page with the same information as ProductShow CASE AS FOR EACH ITEM*/() => {}}
          className="w-full inline-block p-3 rounded-full border-2 text-black font-semibold transition-transform active:scale-95"
        >
          Learn More
        </button>
      </div>
    </article>
  );
}

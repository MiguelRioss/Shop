import React from "react";
import { useCart } from "../../components/CartContext.jsx";
import { Link } from "react-router-dom";
import Button from "../UtilsComponent/Button.jsx";
/**
 * ProductCard (layout unchanged — only formats price display)
 */
export default function ProductCard({
  id,
  image,
  price, // old prop (string or number)
  priceInEuros, // optional (preferred if present)
  title,
  description,
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
    const s = String(p)
      .replace(/\s/g, "")
      .replace(/€/g, "")
      .replace(/\u00A0/g, "");
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
    <article
      className="
    w-[clamp(15rem,20vw,18rem)]
    min-h-[clamp(34rem,58vh,40rem)]
    bg-white rounded-2xl shadow-lg overflow-hidden mx-auto
    border border-[var(--brand-from)]
    flex flex-col
  "
    >
      {/* Image band */}
      <div className="relative bg-white flex items-center justify-center p-10 h-[clamp(12rem,20vh,14rem)] shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-center flex flex-1 flex-col">
        {/* PRICE + TITLE: fixed min height so descriptions line up */}
        <div className="space-y-2 min-h-[5.75rem] md:min-h-[6.25rem]">
          <div className="text-lg font-semibold">{formattedPrice}</div>
          <h3 className="text-base font-medium text-gray-900 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* DESCRIPTION: consistent lines/height */}
        <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-3 min-h-[3.5rem]">
          {description}
        </p>

        {/* ACTIONS pinned to the bottom */}
        <div className="mt-auto space-y-3">
          <Button
            onClick={handleBuy}
            className="w-full h-12 justify-center text-base font-semibold active:scale-95"
          >
            Buy Now
          </Button>
          <Link
            to={`/products/${product.id}`}
            className="w-full h-12 inline-flex items-center justify-center rounded-full border-2 text-black font-semibold transition-transform active:scale-95"
            onClick={() => setOpen(false)}
          >
            Learn More
          </Link>
        </div>
      </div>
    </article>
  );
}


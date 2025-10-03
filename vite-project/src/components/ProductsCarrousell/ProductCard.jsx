import React from "react";
import { useCart } from "../../components/CartContext.jsx";
import { Link } from "react-router-dom";
import Button from "../UtilsComponent/Button.jsx";

export default function ProductCard({
  id,
  image,
  price,
  priceInEuros,
  title,
  description,
  fewTag,
  soldOut,
}) {
  const { addItem } = useCart();
  const product = { id, image, price, priceInEuros, title, description };
  // Debug log
  console.log("ProductCard props:", {
    id,
    title,
    fewTag,
    soldOut,
  });
  const handleBuy = () =>
    typeof addItem === "function" ? addItem(product, 1) : null;

  // --- price helpers ---
  const parsePrice = (p) => {
    if (typeof p === "number" && Number.isFinite(p)) return p;
    if (p == null) return 0;
    const s = String(p)
      .replace(/\s/g, "")
      .replace(/€/g, "")
      .replace(/\u00A0/g, "");
    const cleaned = s.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };
  const formatMoney = (n) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(Number(n) || 0);

  const formattedPrice = formatMoney(parsePrice(priceInEuros ?? price));

  return (
    <article
      className="
        product-card-root box-border flex-none
        w-[260px] md:w-[280px] h-[520px]
        bg-white rounded-2xl shadow-lg overflow-hidden
        border border-[var(--brand-from)] flex flex-col mx-auto
      "
    >
      <div
        className="
          relative flex items-center justify-center h-60
          shrink-0 overflow-hidden rounded-t-2xl
          [--tint:#eef2ff]
          bg-[radial-gradient(80%_80%_at_50%_25%,var(--tint)_0%,transparent_70%)]
        "
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="relative z-10 w-full h-full p-2 object-contain"
        />

        {/* --- Stock Status Tag --- */}
        {soldOut ? (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Sold Out
          </span>
        ) : fewTag ? (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
            Last Few Remaining
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-6 text-center flex-1 flex flex-col">
        {/* Price + Title */}
        <div className="space-y-1 h-[74px]">
          <div className="text-base md:text-lg font-semibold tracking-tight whitespace-nowrap">
            {formattedPrice}
          </div>
          <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-gray-500 mt-2 mb-3 line-clamp-3 h-[60px]">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-auto space-y-2">
          {soldOut ? (
            <button
              disabled
              className="w-full h-10 md:h-11 justify-center text-sm md:text-base font-semibold rounded-full bg-gray-300 text-gray-600 cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <Button
              onClick={handleBuy}
              className="w-full h-10 md:h-11 justify-center text-sm md:text-base font-semibold active:scale-95"
            >
              Buy Now
            </Button>
          )}
          <Link
            to={`/products/${product.id}`}
            className="w-full h-10 md:h-11 inline-flex items-center justify-center rounded-full border-2 border-[var(--brand-from)] text-[var(--brand-from)] bg-white font-semibold transition-colors transition-transform hover:bg-[var(--brand)] hover:text-white active:scale-95"
            onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
          >
            Learn More
          </Link>
        </div>
      </div>
    </article>
  );
}

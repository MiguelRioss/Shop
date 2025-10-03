// src/components/Products/ProductSquareCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../UtilsComponent/Button.jsx";
import { useCart } from "../../components/CartContext.jsx";

export default function ProductSquareCard({
  id,
  image,
  title,
  description,
  priceInEuros,
  fewTag,
  soldOut,
}) {
  const { addItem } = useCart();
  const product = { id, image, title, description, priceInEuros };

  // Format price
  const formatMoney = (n) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(Number(n) || 0);

  return (
    <article
      key={id}
      className="
        relative aspect-square rounded-2xl border border-gray-200
        bg-white shadow overflow-hidden p-3 grid
      "
      style={{ gridTemplateRows: "1fr auto auto auto" }}
    >
      {/* Image wrapper */}
      <div className="min-h-0 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="
            max-h-full max-w-full object-contain
            transform scale-110 -translate-y-1
          "
        />

        {/* Stock Tags */}
        {soldOut ? (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Sold Out
          </span>
        ) : fewTag ? (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
            Few Remaining
          </span>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-center text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-1 text-center text-xs sm:text-sm text-gray-500 line-clamp-2">
        {description}
      </p>

      {/* Price */}
      <h4 className="mt-1 text-center text-md sm:text-base font-semibold text-gray-900">
        {formatMoney(priceInEuros)}
      </h4>

      {/* Actions */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {soldOut ? (
          <button
            disabled
            className="w-full h-10 justify-center text-xs sm:text-sm font-semibold rounded-full bg-gray-300 text-gray-600 cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : (
          <Button
            className="w-full h-10 justify-center text-xs sm:text-sm font-semibold"
            onClick={() => addItem && addItem(product, 1)}
          >
            Buy Now
          </Button>
        )}

        <Link
          to={`/products/${id}`}
          className="
            w-full h-10 inline-flex items-center justify-center rounded-full
            border-2 border-[var(--brand-from)] text-[var(--brand-from)]
            bg-white font-semibold text-xs sm:text-sm transition-colors
            hover:bg-[var(--brand)] hover:text-white
          "
          onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
        >
          Learn More
        </Link>
      </div>
    </article>
  );
}

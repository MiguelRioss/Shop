import React from "react";

/**
 * ProductCard (updated to show full photo)
 */
export default function ProductCard({
  image,
  price = "",
  title = "",
  description = "",
  onBuy = () => {},
}) {
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
        <div className="text-lg font-semibold mb-2">{price}</div>

        <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>

        <p className="text-sm text-gray-500 mb-4 max-h-20 overflow-hidden">
          {description}
        </p>

        <button
          onClick={onBuy}
          className="w-full inline-block py-3 rounded-full bg-black text-white font-semibold transition-transform active:scale-95"
        >
          Comprar agora
        </button>
      </div>
    </article>
  );
}

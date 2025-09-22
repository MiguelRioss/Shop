// ProductCard.jsx
import React from "react";

/** helper: formats numbers or numeric strings into Euro currency */
function formatPrice(raw) {
  if (raw == null || raw === "") return "—";
  if (typeof raw === "string" && /[€£$]/.test(raw)) return raw;
  const cleaned = String(raw).trim().replace(/\s+/g, "").replace(",", ".");
  const num = Number(cleaned.replace(/[^\d.-]/g, ""));
  if (Number.isNaN(num)) return String(raw);
  const isInteger = Number.isInteger(num);
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
  }).format(num);
}

/**
 * ProductCard
 * Props:
 *  - image, price, title, description, onBuy
 *  - liked (bool)
 *  - contentButtonGap: CSS gap between content and buttons (default "0.25rem")
 */
export default function ProductCard({
  image,
  price,
  title = "Flor de 10–OH Lemon Haze Premium Strong 50%, 3g",
  description,
  onBuy = () => {},
  liked = false,
  contentButtonGap = "0.25rem",
}) {
  return (
    <article
      style={{ ["--content-to-buttons-gap"]: contentButtonGap }}
      className="
        w-48
        sm:w-56
        md:w-[360px]
        p-2 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex-shrink-0
        flex flex-col
        h-[480px]
        sm:h-[480px]
        md:h-[520px]
      "
    >
      <style>{`
        .pc-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc-desc {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc-buttons {
          margin-top: var(--content-to-buttons-gap);
        }
      `}</style>

      <div className="relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="
            w-full
            h-32
            sm:h-40
            md:h-56
            object-contain block
          "
          draggable={false}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between p-3 text-center">
        <div>
          <div className="text-lg font-medium mb-2">{formatPrice(price)}</div>

          <h3 className="text-sm leading-6 font-semibold text-gray-800 mb-2 pc-title">
            {title}
          </h3>

          <div className="text-sm text-gray-500 mb-3 pc-desc">{description}</div>
        </div>

        <div className="pc-buttons space-y-2">
          <button
            onClick={onBuy}
            className="inline-block w-full rounded-full py-2 px-4 bg-black text-white font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            Comprar agora
          </button>

          <button
            onClick={onBuy}
            className="inline-block w-full rounded-full py-2 px-4 border border-gray-200 text-gray-800 font-semibold shadow-sm hover:bg-gray-50 transition"
          >
            Saber mais
          </button>
        </div>
      </div>
    </article>
  );
}

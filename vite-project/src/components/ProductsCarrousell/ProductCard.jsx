import React from "react";

// helper: formats numbers or numeric strings into Euro currency
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
 *  - contentButtonGap: string CSS size controlling gap between text and buttons
 *
 * Responsive sizing:
 *  - base (mobile) = smaller card
 *  - sm (small tablets) = medium card
 *  - md (desktop) = your desired desktop size (unchanged)
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
        /* widths: base (mobile) smaller -> sm medium -> md desktop desired */
        w-48        /* base: 11rem = 176px (smaller mobile width) */
        sm:w-56     /* small tablets: 14rem = 224px */
        md:w-[360px]/* desktop: 360px (your desired size) */
        p-2 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex-shrink-0
        flex flex-col
        /* heights: smaller on mobile, bigger toward desktop */
        h-[480px]   /* base mobile height */
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

      {/* image area (fixed height scaled by breakpoint) */}
      <div className="relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="
            w-full
            h-32   /* mobile: 128px */
            sm:h-40/* small tablet: 160px */
            md:h-56/* desktop: 224px (keeps bottle visible) */
            object-contain block
          "
          draggable={false}
        />
      </div>

      {/* content area */}
      <div className="flex-1 flex flex-col justify-between p-3 text-center">
        <div>
          <div className="text-lg font-medium mb-2">{formatPrice(price)}</div>

          <h3 className="text-sm leading-6 font-semibold text-gray-800 mb-2 pc-title">
            {title}
          </h3>

          <div className="text-sm text-gray-500 mb-3 pc-desc">{description}</div>
        </div>

        {/* buttons: the top margin is controlled by the CSS variable above */}
        <div className="pc-buttons space-y-2">
          <button
            onClick={onBuy}
            className="inline-block w-full rounded-full py-2 px-4 bg-black text-white font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            Buy Now
          </button>

          <button
            onClick={onBuy}
            className="inline-block w-full rounded-full py-2 px-4 border border-gray-200 text-gray-800 font-semibold shadow-sm hover:bg-gray-50 transition"
          >
            Learn More
          </button>
        </div>
      </div>
    </article>
  );
}

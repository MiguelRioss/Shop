import { useCart } from "../components/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/UtilsComponent/Button.jsx";
import SelectField from "../components/UtilsComponent/SelectField.jsx";
import { useState } from "react";
import { validateAndApplyPromo } from "../services/promoClientServices.mjs";

export default function Cart() {
  const {
    items,
    setQty,
    removeItem,
    subtotal,
    discount,
    discountAmount,
    total, // subtotal - discount (no shipping)
    applyCode,
    hasDiscount, // boolean (from CartContext)
    clearDiscount, // optional, if you want to remove a code
  } = useCart();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const fmt = (n) => `\u20AC${(n ?? 0).toFixed(2)}`;
  const navigate = useNavigate();
  
async function handleApply() {
  const raw = code.trim();
  if (!raw) {
    setError("Please enter a discount code.");
    return;
  }

  const res = await validateAndApplyPromo(raw, applyCode);
  console.log(res)
  if (!res.ok) {
    setError(res.reason === "EMPTY" ? "Please enter a discount code." : "Invalid or expired code.");
  } else {
    setError("");
  }
}
  return (
    <section className="bg-[#fcfcf6] min-h-screen py-8 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
          Shopping Cart
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">
          Estimated shipping time: 10-15 business days.
        </p>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 sm:p-6">
            <a
              href="/"
              className="text-sm text-gray-500 mb-4 sm:mb-6 inline-block"
            >
              &#8592; Continue Shopping
            </a>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Your Cart
            </h2>

            {items.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4 sm:space-y-6">
                {items.map((item) => {
                  const unit = item.price ?? 0;
                  const title =
                    item.title ?? item.name ?? item.label ?? "Product";
                  const desc = item.description;
                  const lineTotal = unit * (item.qty ?? 1);
                  const imgSrc = item.image;

                  return (
                    <li
                      key={item.id}
                      className="border-b last:border-none pb-4 sm:pb-6"
                    >
                      {/* MOBILE: stack, DESKTOP: row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex gap-3 sm:gap-4 sm:flex-1 sm:items-start">
                          {/* image */}
                          {imgSrc ? (
                            <div className="shrink-0">
                              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <img
                                  src={imgSrc}
                                  alt={title}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-lg bg-gray-100" />
                          )}

                          {/* text */}
                          <div className="flex-1 min-w-0 sm:max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-gray-900 truncate">
                                {title}
                              </h3>
                              {item.note && (
                                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                  {item.note}
                                </span>
                              )}
                            </div>
                            {desc && (
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed break-words">
                                {desc}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              Unit: {fmt(unit)}
                            </p>
                          </div>
                        </div>

                        {/* controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:flex-shrink-0 sm:w-[220px] sm:pl-4 sm:self-start">
                          {/* Quantity */}
                          <SelectField
                            id={`qty-${item.id}`}
                            name={`qty-${item.id}`}
                            label="Quantity"
                            hideLabel
                            value={item.qty}
                            onChange={(e) =>
                              setQty(item.id, parseInt(e.target.value, 10))
                            }
                            options={Array.from({ length: 4 }, (_, i) => i + 1)}
                            className="w-20 text-center"
                          />

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-red-600 p-2 rounded-lg"
                            aria-label={`Remove ${title}`}
                            title="Remove item"
                          >
                            &times;
                          </button>

                          {/* Line total */}
                          <p className="font-semibold min-w-[84px] text-right">
                            {fmt(lineTotal)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <aside className="bg-white rounded-xl shadow p-3 h-fit lg:sticky lg:top-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Order Summary
            </h2>

            {/* SUBTOTAL + DISCOUNT */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>

            {hasDiscount && discountAmount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span className="text-gray-600">Discount</span>
                <span>-{fmt(discountAmount)}</span>
              </div>
            )}

            <hr className="my-3 border-gray-200" />

            <div className="flex justify-between mb-2 text-lg font-semibold">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            {/* DISCOUNT / PROMO CODE SQUARE */}
            <div className="mt-4 mb-4 sm:mb-6 border border-gray-200 rounded-lg p-3 sm:p-4">
              <label
                htmlFor="discountCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Discount Code
              </label>

              <div className="flex gap-2">
                <input
                  id="discountCode"
                  type="text"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
                {!hasDiscount ? (
                  <button
                    onClick={handleApply}
                    style={{
                      background:
                        "linear-gradient(to right, var(--brand-from), var(--brand-to))",
                    }}
                    className="px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      clearDiscount?.();
                      setError("");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
                  >
                    Remove
                  </button>
                )}
              </div>

              {hasDiscount && discount && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ Applied: {discount.label || discount.code}{" "}
                  {discount.type === "percent"
                    ? `(-${discount.value}% off)`
                    : `(-€${Number(discount.value).toFixed(2)})`}
                </p>
              )}
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <Button
              className="w-full mt-4 py-3 sm:py-3.5 text-base font-semibold"
              style={{
                background:
                  "linear-gradient(to right, var(--brand-from), var(--brand-to))",
              }}
              onClick={() => navigate("/checkout")}
              disabled={!items?.length}
            >
              Checkout
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}

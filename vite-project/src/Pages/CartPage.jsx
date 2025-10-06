import { useCart } from "../components/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/UtilsComponent/Button.jsx";

export default function Cart() {
  const { items, setQty, removeItem, subtotal } = useCart();
  const fmt = (n) => `\u20AC${(n ?? 0).toFixed(2)}`;
  const navigate = useNavigate();
  console.log(items);
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
                        <div className="flex gap-3 sm:gap-4 sm:flex-1">
                          {/* image */}
                          {imgSrc ? (
                            <div
                              className="w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 lg:w-36 lg:h-40 
                  rounded-lg overflow-hidden bg-gray-100 
                  flex items-center justify-center"
                            >
                              <img
                                src={imgSrc}
                                alt={title}
                                className="
        w-full h-full object-contain
        transform scale-125 -translate-y-2
      "
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 lg:w-36 lg:h-40 rounded-lg bg-gray-100" />
                          )}

                          {/* text */}
                          <div className="min-w-0">
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
                              <p className="text-sm text-gray-500 mt-0.5 line-clamp-3 sm:line-clamp-none">
                                {desc}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              Unit: {fmt(unit)}
                            </p>
                          </div>
                        </div>

                        {/* controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:flex-shrink-0 sm:min-w-[200px] sm:pl-4 sm:self-start">
                          {/* Quantity (bigger tap area on mobile) */}
                          <label className="sr-only" htmlFor={`qty-${item.id}`}>
                            Quantity
                          </label>
                          <select
                            id={`qty-${item.id}`}
                            value={item.qty}
                            onChange={(e) =>
                              setQty(item.id, parseInt(e.target.value, 10))
                            }
                            className="border rounded-lg px-3 py-2 sm:py-1 text-sm sm:w-20 sm:text-center"
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                              (n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              )
                            )}
                          </select>

                          {/* Remove (touch-friendly) */}
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
          <aside className="bg-white rounded-xl shadow p-4 sm:p-6 h-fit lg:sticky lg:top-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            <Button
              className="w-full mt-4 py-3 sm:py-3.5 text-base font-semibold"
              style={{
                background:
                  "linear-gradient(to right, var(--brand-from), var(--brand-to))",
              }}
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}

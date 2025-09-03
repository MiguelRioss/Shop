import React from "react";
import { useCart } from "../components/CartContext.jsx";
import RB from '/RB.png'

export default function Cart() {
  const { items, setQty, removeItem, subtotal } = useCart();

  const fmt = (n) => `€${(n ?? 0).toFixed(2)}`;

  return (
    <section className="bg-[#fcfcf6] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HERO TITLE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Estimated shipping time: 10–15 business days.</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <a href="/" className="text-sm text-gray-500 mb-6 inline-block">← Continue Shopping</a>
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

            {items.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const unit = item.price ?? 0;
                  const lineTotal = unit * (item.qty ?? 1);
                  const title = item.title ?? item.name ?? item.label ?? "Product";
                  const imgSrc =  item.image; // prefer thumb if present
                  const desc = item.description;

                  return (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gray-100" />
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{title}</h3>
                            {item.note && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                {item.note}
                              </span>
                            )}
                          </div>

                          {desc && <p className="text-sm text-gray-500">{desc}</p>}

                      

                          <p className="text-sm text-gray-500 mt-1">Unit: {fmt(unit)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity */}
                        <select
                          value={item.qty}
                          onChange={(e) => setQty(item.id, parseInt(e.target.value, 10))}
                          className="border rounded-lg px-3 py-1"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          🗑
                        </button>

                        {/* Line total */}
                        <p className="font-medium min-w-[90px] text-right">{fmt(lineTotal)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{fmt(subtotal)}</span>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg mt-6">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

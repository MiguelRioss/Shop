import React from "react";

import { Link } from "react-router-dom";

/**
 * CheckoutSummary component
 * Displays cart items, subtotal, shipping, and total
 *
 * Props:
 * - items: array of cart products
 * - subtotal: number
 * - shippingCost: number
 * - fmt: formatter function (e.g. €)
 */
export default function CheckoutSummary({ items = [], subtotal = 0, shippingCost = 0, fmt }) {
  const total = subtotal + shippingCost;

  return (
    <aside className="bg-white rounded-xl shadow p-6 h-fit">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {!items?.length ? (
        <p className="text-gray-600">
          Your cart is empty.{" "}
          <Link className="underline" to="/">
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          {/* Items List */}
          <ul className="space-y-4 mb-4">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                {p.thumb || p.image ? (
                  <img
                    src={p.thumb || p.image}
                    alt={p.title}
                    className="w-12 h-12 rounded-lg object-contain border"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100" />
                )}

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    Qty {p.qty} × Unit {fmt(p.price)}
                  </p>
                </div>

                <div className="text-sm font-semibold">
                  {fmt((p.price ?? 0) * p.qty)}
                </div>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{fmt(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

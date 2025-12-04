export default function ProductSummary({
  items,
  subtotal = 0,
  discount,            // object or null
  discountAmount = 0,  // number
  hasDiscount = false, // boolean
  shippingCost = 0,
  total,               // (subtotal - discount) + shipping
  fmt,
}) {
  return (
    <aside className="bg-white rounded-xl shadow p-4 sm:p-6 h-fit lg:sticky lg:top-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Order Summary
      </h2>

      {/* Line items preview (optional) */}
      {items?.length ? (
        <div className="space-y-3 mb-4">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {it.title || it.name || "Product"}{" "}
                <span className="text-gray-500">× {it.qty}</span>
              </span>
              <span className="text-gray-900">
                {fmt((it.price ?? 0) * (it.qty ?? 1))}
              </span>
            </div>
          ))}
          <hr className="my-2 border-gray-200" />
        </div>
      ) : null}

      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold">{fmt(subtotal)}</span>
      </div>

      {hasDiscount && discountAmount > 0 && (
        <div className="flex justify-between mb-2 text-green-700">
          <span className="text-gray-600">
            Discount{discount?.label || discount?.code ? ` — ${discount.label || discount.code}` : ""}
          </span>
          <span>-{fmt(discountAmount)}</span>
        </div>
      )}

      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Shipping</span>
        <span className="font-semibold">{fmt(shippingCost)}</span>
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="flex justify-between mb-2 text-lg font-semibold">
        <span>Total</span>
        <span>{fmt(total ?? (subtotal - discountAmount + shippingCost))}</span>
      </div>
    </aside>
  );
}

import React, { useState, useMemo } from "react";

export default function Cart() {
  // Local cart state (you can later hydrate this from sessionStorage)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sensate",
      description: "Kit: 1 Sensate Plus Pack",
      price: 349,              // unit price
      qty: 1,
      image: "/sensate.png",   // ensure this exists in /public
    },
  ]);

  // Update quantity
  const handleQtyChange = (id, qty) => {
    const newQty = Math.max(1, Number(qty) || 1);
    setCartItems(items =>
      items.map(it => (it.id === id ? { ...it, qty: newQty } : it))
    );
  };

  // Remove item
  const handleRemove = (id) => {
    setCartItems(items => items.filter(it => it.id !== id));
  };

  // Calculate subtotal
  const subtotal = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cartItems]
  );

  const fmt = (n) => `€${n.toFixed(2)}`;

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

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const lineTotal = item.price * item.qty;
                  return (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          <p className="text-sm text-gray-500">Unit: {fmt(item.price)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity */}
                        <select
                          value={item.qty}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="border rounded-lg px-3 py-1"
                        >
                          {[...Array(10)].map((_, i) => {
                            const n = i + 1;
                            return <option key={n} value={n}>{n}</option>;
                          })}
                        </select>

                        {/* Delete */}
                        <button
                          onClick={() => handleRemove(item.id)}
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

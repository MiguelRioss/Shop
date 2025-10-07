// src/pages/CheckoutPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import Button from "../components/UtilsComponent/Button.jsx";

const STRIPE_ENDPOINT =
  "https://api-backend-mesodose-2.onrender.com/api/checkout-sessions";

const countries = [
  { code: "", name: "Choose..." },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CR", name: "Costa Rica" },
  { code: "DE", name: "Germany" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "PT", name: "Portugal" },
  { code: "ZA", name: "South Africa" },
  { code: "UY", name: "Uruguay" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();

  React.useEffect(() => {
    if (!items?.length) {
      // navigate("/cart");
    }
  }, [items]);

  const [form, setForm] = React.useState({
    // customer
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    // shipping
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "",
    // billing
    billingSame: true,
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingPostcode: "",
    billingCountry: "",
  });

  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const fmt = (n) => `\u20AC${(n ?? 0).toFixed(2)}`;
  const total = subtotal;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const requireField = (cond, key, msg, bag) => {
    if (cond && !String(form[key] || "").trim()) bag[key] = msg;
  };

  const validate = () => {
    const e = {};
    // customer
    requireField(true, "fullName", "Required", e);
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    requireField(true, "phone", "Required", e);
    // shipping
    requireField(true, "address1", "Required", e);
    requireField(true, "city", "Required", e);
    requireField(true, "postcode", "Required", e);
    if (!form.country) e.country = "Required";
    // billing (only when different)
    if (!form.billingSame) {
      requireField(true, "billingAddress1", "Required", e);
      requireField(true, "billingCity", "Required", e);
      requireField(true, "billingPostcode", "Required", e);
      if (!form.billingCountry) e.billingCountry = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items?.length || !validate()) return;

    setSubmitting(true);
    try {
      // ---------------------------
      // 1. Prepare shipping + billing
      // ---------------------------
      const shippingAddress = {
        line1: form.address1,
        line2: form.address2,
        city: form.city,
        postal_code: form.postcode,
        country: form.country,
      };

      const billingAddress = form.billingSame
        ? shippingAddress
        : {
            line1: form.billingAddress1,
            line2: form.billingAddress2,
            city: form.billingCity,
            postal_code: form.billingPostcode,
            country: form.billingCountry,
          };

      // ---------------------------
      // 2. Build payload for backend
      // ---------------------------
      const payload = {
        items: items.map((p) => ({ id: p.id, qty: p.qty })),
        customer: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
        },
        address: shippingAddress, // shipping
        billingAddress, // explicit billing
        billingSameAsShipping: form.billingSame, // flag
        clientReferenceId: `cart_${Date.now()}`,
      };

      // ---------------------------
      // 3. Log before sending (for testing)
      // ---------------------------
      console.log("🧾 Checkout payload preview:", payload);

      // ---------------------------
      // 4. Send to backend
      // ---------------------------
      const res = await fetch(STRIPE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ---------------------------
      // 5. Handle response + redirect
      // ---------------------------
      if (data?.url) {
        console.log("✅ Payload confirmed. Redirecting to Stripe in 500 ms...");
        // Small delay to ensure console flush
        setTimeout(() => {
          window.location.href = data.url;
        }, 2500);
        return;
      }

      alert(data?.error || "Payment error. Please try again.");
    } catch (err) {
      console.error("❌ Checkout submit error:", err);
      alert("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#fcfcf6] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">
          Please review your order and enter your details to create the order.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow p-6 space-y-8"
            >
              {/* Customer details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Customer details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full name *
                    </label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.fullName ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="Jane Doe"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.email ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="jane@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.phone ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="928269577"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes (optional)
                    </label>
                    <input
                      name="notes"
                      value={form.notes}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="Delivery notes, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address line 1 *
                    </label>
                    <input
                      name="address1"
                      value={form.address1}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.address1 ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="Rua Exemplo 12"
                    />
                    {errors.address1 && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.address1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address line 2 (optional)
                    </label>
                    <input
                      name="address2"
                      value={form.address2}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="Apt / Floor / Unit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.city ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="Lisboa"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postcode *
                    </label>
                    <input
                      name="postcode"
                      value={form.postcode}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.postcode ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="1000-000"
                    />
                    {errors.postcode && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.postcode}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country *
                    </label>

                    <div className="flex items-baseline mb-2 text-sm">
                      <p className="text-gray-500 m-0">
                        If you don't see your location listed, send us a quick
                        message and we'll try to sort it out.
                      </p>
                      <Link
                        to="../contact"
                        className="ml-2 text-md font-bold leading-none underline"
                      >
                        Contact Us Here
                      </Link>
                    </div>

                    <select
                      name="country"
                      value={form.country}
                      onChange={onChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                        errors.country ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    {errors.country && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing same as shipping toggle */}
              <div className="border rounded-lg p-4">
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="billingSame"
                    checked={form.billingSame}
                    onChange={onChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-800">
                    Billing address is the same as shipping
                  </span>
                </label>
              </div>

              {/* Billing address (shown only if different) */}
              {!form.billingSame && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Billing address
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address line 1 *
                      </label>
                      <input
                        name="billingAddress1"
                        value={form.billingAddress1}
                        onChange={onChange}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                          errors.billingAddress1
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="Rua Exemplo 12"
                      />
                      {errors.billingAddress1 && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.billingAddress1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address line 2 (optional)
                      </label>
                      <input
                        name="billingAddress2"
                        value={form.billingAddress2}
                        onChange={onChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="Apt / Floor / Unit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        name="billingCity"
                        value={form.billingCity}
                        onChange={onChange}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                          errors.billingCity
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="Lisboa"
                      />
                      {errors.billingCity && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.billingCity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Postcode *
                      </label>
                      <input
                        name="billingPostcode"
                        value={form.billingPostcode}
                        onChange={onChange}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                          errors.billingPostcode
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="1000-000"
                      />
                      {errors.billingPostcode && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.billingPostcode}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Country *
                      </label>
                      <select
                        name="billingCountry"
                        value={form.billingCountry}
                        onChange={onChange}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
                          errors.billingCountry
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.billingCountry && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.billingCountry}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={submitting || !items?.length}
                  className={`px-5 py-3 rounded-lg text-base font-semibold disabled:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed ${
                    submitting || !items?.length
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  style={
                    submitting || !items?.length
                      ? undefined
                      : {
                          background:
                            "linear-gradient(to right, var(--brand-from), var(--brand-to))",
                        }
                  }
                >
                  {submitting ? "Creating..." : "Create Order"}
                </Button>
                <Link
                  to="/cart"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Back to cart
                </Link>
              </div>
            </form>
          </div>

          {/* RIGHT: order recap */}
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
                        <p className="text-sm font-medium text-gray-900">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty {p.qty} x Unit {fmt(p.price)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        {fmt((p.price ?? 0) * p.qty)}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2">
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

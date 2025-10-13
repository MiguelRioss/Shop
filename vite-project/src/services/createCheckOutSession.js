/**
 * createCheckoutSession.js
 * ------------------------
 * Handles preparing shipping + billing data and sending payload
 * to Stripe backend endpoint. Returns JSON response.
 */

export async function createCheckoutSession({
  items = [],
  form = {},
  shippingCostCents = 0,
  endpoint = "https://api-backend-mesodose-2.onrender.com/api/checkout-sessions",
}) {
  // 1️⃣ Prepare shipping + billing
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

  // 2️⃣ Build payload for backend
  const payload = {
    items: items.map((p) => ({ id: p.id, qty: p.qty })),
    customer: {
      name: form.fullName,
      email: form.email,
      phone: `${form.dialCode} ${form.phone}`.trim(),
      notes: form.notes,
    },
    address: shippingAddress,
    billingAddress,
    billingSameAsShipping: form.billingSame,
    clientReferenceId: `cart_${Date.now()}`,
    shippingCostCents,
  };

  console.log("🧾 Checkout payload preview:", payload);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Checkout API error:", data?.error || res.statusText);
      return { success: false, error: data?.error || "Checkout failed" };
    }

    return { success: true, data };
  } catch (err) {
    console.error("❌ Checkout session creation failed:", err);
    return { success: false, error: err.message };
  }
}

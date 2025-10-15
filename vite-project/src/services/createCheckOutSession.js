/**
 * createCheckoutSession.js
 * Handles preparing shipping + billing data and sending payload
 * to the checkout backend endpoint. Returns JSON response.
 */

import apiURLresolve from "./apiURLresolve";

export async function createCheckoutSession({
  items = [],
  form = {},
  shippingCostCents = 0,
}) {

  
  const endpoint = `${apiURLresolve()}/api/checkout-sessions`
  // Build shipping address payload
  const shippingAddress = {
    line1: form.address1,
    line2: form.address2,
    city: form.city,
    postal_code: form.postcode,
    country: form.country,
  };

  // Use shipping address for billing when flagged as same
  const billingAddress = form.billingSame
    ? shippingAddress
    : {
        line1: form.billingAddress1,
        line2: form.billingAddress2,
        city: form.billingCity,
        postal_code: form.billingPostcode,
        country: form.billingCountry,
      };

  // Compose checkout payload for backend
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

  console.log("Checkout payload preview:", payload);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Checkout API error:", data?.error || res.statusText);
      return { success: false, error: data?.error || "Checkout failed" };
    }

    const url =
      data?.url ||
      data?.checkoutUrl ||
      data?.session?.url ||
      data?.sessionUrl ||
      null;

    if (!url) {
      console.error("Checkout API missing redirect URL:", data);
      return {
        success: false,
        error: "Checkout failed: no redirect URL returned.",
        data,
      };
    }

    return { success: true, url, data };
  } catch (err) {
    console.error("Checkout session creation failed:", err);
    return { success: false, error: err.message };
  }
}


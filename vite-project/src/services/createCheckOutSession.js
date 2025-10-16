/**
 * createCheckoutSession.js
 * Handles preparing shipping + billing data and sending payload
 * to the checkout backend endpoint. Returns JSON response.
 */

import apiURLresolve from "./apiURLresolve";

// src/services/createCheckoutSession.js
export async function createCheckoutSession({ items = [], form = {}, shippingCostCents = 0 }) {
  const endpoint = `${apiURLresolve()}/api/checkout-sessions`;

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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw { status: 500, message: "Invalid JSON response from server" };
  }

  if (!res.ok) {
    throw { status: res.status, message: data.message || "Checkout failed." };
  }

  const url = data?.url || data?.session?.url;
  if (!url) {
    throw { status: 500, message: "No checkout URL returned from server." };
  }

  return { url };
}



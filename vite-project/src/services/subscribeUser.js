/**
 * subscribeUser.js
 * -----------------
 * Reusable helper for newsletter subscriptions.
 * Safely sends user data to backend endpoint.
 */

export async function subscribeUser({
  email,
  fullName,
  dialCode = "",
  phone = "",
  endpoint = "http://localhost:3000/api/subscribe",
}) {
  if (!email) {
    console.warn("⚠️ Missing email for subscription");
    return { success: false, message: "Missing email" };
  }

  console.log("Newsletter subscription requested", { email, fullName, phone });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        fullName,
        phone: dialCode && phone ? `${dialCode} ${phone}` : phone,
      }),
    });

    if (!res.ok) {
      console.error("❌ Subscription failed:", res.status);
      return { success: false, message: `Error ${res.status}` };
    }

    console.log("✅ User subscribed successfully");
    return { success: true };
  } catch (err) {
    console.error("Subscription API error:", err);
    return { success: false, message: err.message };
  }
}

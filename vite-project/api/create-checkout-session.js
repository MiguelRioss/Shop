import Stripe from "stripe";

// ⚠️ For testing only — do NOT commit this to GitHub if public
const stripe = new Stripe("sk_test_51S0iBhBjCoDp1ugvPU77tC8rOey2EB6XR1tOfU0YTCq13OhizlkLaXs97A8GdxT3MBNIe70mgHzx5eZPiHJ4nu0b00pVs9UUkl", {
  apiVersion: "2024-06-20",
});
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://iboga-shop.vercel.app",
];

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items, orderId, customer } = req.body || {};
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: "Missing items" });

    const line_items = items.map(p => ({
      quantity: Math.max(1, Number(p.qty || 1)),
      price_data: {
        currency: "eur",
        unit_amount: Math.round(Number(p.price || 0) * 100),
        product_data: { name: String(p.title || "Item") },
      },
    }));

    const baseUrl = `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: orderId || `ORD-${Date.now()}`,
      customer_email: customer?.email || undefined,
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      shipping_address_collection: { allowed_countries: ["PT","ES","FR","DE","NL","IT","IE","GB"] },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: {
        name: customer?.fullName || "",
        phone: customer?.phone || "",
        notes: customer?.notes || "",
      },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || "Stripe error" });
  }
}

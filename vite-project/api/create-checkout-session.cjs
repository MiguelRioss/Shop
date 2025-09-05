// api/create-checkout-session.js
const Stripe = require("stripe");

// ⚠️ TEST ONLY: hardcoded test key. Move to env var before pushing public.
const SECRET = "sk_test_51S0iBhBjCoDp1ugvPU77tC8rOey2EB6XR1tOfU0YTCq13OhizlkLaXs97A8GdxT3MBNIe70mgHzx5eZPiHJ4nu0b00pVs9UUkl"; // <-- your sk_test_...
const stripe = new Stripe(SECRET, { apiVersion: "2024-06-20" });

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://iboga-shop.vercel.app",
];

// Read JSON body safely (works on Vercel serverless)
function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  // CORS (allow browsers from allowed origins; allow Postman with no Origin)
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Non-browser clients like Postman/curl: allow
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(207).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", got: req.method });

  try {
    if (!SECRET || !SECRET.startsWith("sk_")) {
      return res.status(500).json({ error: "Stripe secret key not configured" });
    }

    const { items, orderId, customer } = await readJson(req);

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing items" });
    }

    const line_items = items.map((p) => ({
      quantity: Math.max(1, Number(p.qty || 1)),
      price_data: {
        currency: "eur",
        unit_amount: Math.round(Number(p.price || 0) * 100),
        product_data: { name: String(p.title || "Item") },
      },
    }));

    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const proto = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${proto}://${host}`;

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

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("API error:", err);
    return res.status(400).json({ error: err.message || "Stripe error" });
  }
};

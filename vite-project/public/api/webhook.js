import Stripe from "stripe";
import * as admin from "firebase-admin";

// --- HARDCODED SECRETS (⚠️ testing only) ---
const STRIPE_WEBHOOK_SECRET = "whsec_QwPjmbdHCIuZCZasNhfxAuldwJB0fQrP"; // from Dashboard TEST webhook
const STRIPE_API_VERSION = "2024-06-20";

// From Firebase service account JSON
const serviceAccount = {
  projectId: "your-project-id",
  clientEmail: "firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com",
  privateKey: `-----BEGIN PRIVATE KEY-----
YOUR-PRIVATE-KEY-CONTENT
-----END PRIVATE KEY-----\n`,
};
const FIREBASE_DB_URL = "https://storageproducts-bbe30-default-rtdb.europe-west1.firebasedatabase.app/";

// --- Stripe init ---
const stripe = new Stripe("sk_test_51S0iBXPjytaoBek73jooh4FSq8smPNgOHaK1R5OhQSe9JhDJKGw2ChgroYJla64CwZwUfDlROW8ThhFmLMJe0nvA00d1VDlYUk", { // optional, webhook verification doesn’t need SK
  apiVersion: STRIPE_API_VERSION,
});

// --- Firebase init ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DB_URL,
  });
}
const rtdb = admin.database();

// Helper: read raw body for signature verification
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  let event;
  try {
    const raw = await readRawBody(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Invalid signature: ${err.message}`);
  }

  // --- Handle checkout completed ---
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const cd = s.customer_details || {};
    const addr = cd.address || {};

    const payload = {
      written_at: new Date().toISOString(),
      event_id: event.id,
      event_type: event.type,
      session_id: s.id || null,
      amount_total: s.amount_total ?? null,
      currency: s.currency ?? null,
      email: cd.email ?? null,
      name: cd.name ?? null,
      address: {
        country: addr.country ?? null,
        city: addr.city ?? null,
        line1: addr.line1 ?? null,
        postal_code: addr.postal_code ?? null,
      },
      metadata: s.metadata || {},
    };

    await rtdb.ref(`orders/${event.id}`).set(payload);
    console.log("Stored order:", event.id);
  }

  return res.status(200).send("ok");
}

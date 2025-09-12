import Stripe from "stripe";
import * as admin from "firebase-admin";

// ---------- STRIPE (TEST) ----------
const STRIPE_SECRET_KEY =
  "sk_test_51S0iBXPjytaoBek73jooh4FSq8smPNgOHaK1R5OhQSe9JhDJKGw2ChgroYJla64CwZwUfDlROW8ThhFmLMJe0nvA00d1VDlYUk";
const STRIPE_WEBHOOK_SECRET =
  "whsec_QwPjmbdHCIuZCZasNhfxAuldwJB0fQrP"; // from Dashboard, TEST endpoint
const STRIPE_API_VERSION = "2024-06-20";

// Using the SK here is optional; it's not required just to verify the webhook.
// We include it so you can expand (e.g., retrieve objects) if needed.
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });

// ---------- FIREBASE (Realtime Database) ----------
const FIREBASE_DB_URL =
  "https://storageproducts-bbe30-default-rtdb.europe-west1.firebasedatabase.app";

// Fill from your downloaded service account JSON:
const serviceAccount = {
  projectId: "storageproducts-bbe30",
  clientEmail: "firebase-adminsdk-fbsvc@storageproducts-bbe30.iam.gserviceaccount.com",
  privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQB89AZ+rozl6b
Sk4yn7NaPklOdsr1cW/1d+IhMzMJLd+Rd2xSFpdzFpaaAGfDsN/Ds93bv2OkeyiF
rGHiVeFqTlmtfnbLtjV1b2EdLSf16/afyZq9OkhgyqTl4dwYfc+TtQj/fld0wkON
... (rest of your key here, line by line) ...
-----END PRIVATE KEY-----\n`
};


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      // If you paste the key exactly as in the JSON, it already has newlines.
      // If Vercel ever escapes them (\\n), this replace will restore real newlines.
      privateKey: (serviceAccount.privateKey || "").replace(/\\n/g, "\n"),
    }),
    databaseURL: FIREBASE_DB_URL,
  });
}
const rtdb = admin.database();

// Read raw body (required for Stripe signature verification)
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

  // Handle successful Checkout
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

    // Idempotent write using event_id
    await rtdb.ref(`orders/${event.id}`).set(payload);
    console.log("Stored order:", event.id);
  }

  return res.status(200).send("ok");
}

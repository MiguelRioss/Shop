// ...imports and inits stay the same...

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Non-POST request to /api/webhook");
    return res.status(405).send("Method Not Allowed");
  }

  let event;
  try {
    const raw = await readRawBody(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET);
    console.log("Verified Stripe signature. event.id:", event.id, "type:", event.type);
  } catch (err) {
    console.error("Signature verification failed:", err.message);
    return res.status(400).send(`Invalid signature: ${err.message}`);
  }

  try {
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

      console.log("Writing to Firebase at path:", `orders/${event.id}`);
      await rtdb.ref(`orders/${event.id}`).set(payload);
      console.log("Stored order OK:", event.id);
    } else {
      console.log("Ignoring event type:", event.type);
    }

    return res.status(200).send("ok");
  } catch (e) {
    console.error("Handler error:", e);
    return res.status(500).send("internal error");
  }
}

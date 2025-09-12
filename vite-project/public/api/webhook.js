// api/webhook.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

// --- Stripe ---
const stripe = new Stripe(process.env.STRIPE_API_VERSION || '2024-06-20', {
  apiVersion: '2024-06-20',
});
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!; // whsec_... (from Dashboard)

// --- Firebase Admin (service account via env vars) ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: (process.env.FB_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FB_DATABASE_URL, // https://<project>-default-rtdb.<region>.firebasedatabase.app
  });
}
const rtdb = admin.database();

// Helper to read raw body (needed for Stripe signature verification)
async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    const sig = req.headers['stripe-signature'] as string;
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    return res.status(400).send(`Invalid signature: ${err.message}`);
  }

  // Handle paid orders (you can expand to other event types if needed)
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const cd = s.customer_details || ({} as any);
    const addr = (cd.address || {}) as any;

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
      metadata: s.metadata ?? {},
    };

    // Idempotent write using event id as key
    await rtdb.ref(`orders/${event.id}`).set(payload);
  }

  return res.status(200).send('ok');
}

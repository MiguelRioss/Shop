import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";


function centsToEUR(cents) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" })
    .format((Number(cents) || 0) / 100);
}

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = React.useState(!!sessionId);
  const [order, setOrder] = React.useState(null);
  const [error, setError] = React.useState("");

  async function fetchOrder() {
    if (!sessionId) return;
    setLoading(true);
    setError("");
    try {
      const q = query(ref(db, "orders"), orderByChild("session_id"), equalTo(sessionId));
      const snap = await get(q);
      if (snap.exists()) {
        // orders are keyed by event id; equalTo returns a map
        const first = Object.values(snap.val())[0];
        setOrder(first);
      } else {
        setOrder(null);
      }
    } catch (e) {
      setError(e.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (sessionId) fetchOrder();
  }, [sessionId]);

  return (
    <div className="page">
      <h1 style={{ marginBottom: 12 }}>Payment successful 🎉</h1>

      {sessionId && (
        <p className="muted" style={{ marginTop: -6, marginBottom: 16 }}>
          Session ID: <code>{sessionId}</code>
        </p>
      )}

      {error && (
        <div className="card" style={{ padding: 12, borderLeft: "4px solid #e11d48", marginBottom: 16 }}>
          <strong style={{ color: "#e11d48" }}>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: 16 }}>We’re confirming your payment…</div>
      ) : order ? (
        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Order summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "8px 16px" }}>
            <div className="muted">Name</div>
            <div>{order.name || order.metadata?.fullName || "—"}</div>

            <div className="muted">Email</div>
            <div>{order.email || "—"}</div>

            <div className="muted">Total</div>
            <div>{centsToEUR(order.amount_total)}</div>

            <div className="muted">Address</div>
            <div>
              {[order?.address?.line1, order?.address?.postal_code, order?.address?.city, order?.address?.country]
                .filter(Boolean)
                .join(", ") || "—"}
            </div>
          </div>

          <div style={{ marginTop: 16 }} className="muted">
            A confirmation email was sent to you. We’ll notify you when your order ships.
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 16 }}>
          <p>
            Payment succeeded and Stripe showed you the success page. We’re still finalizing your order in our system.
            This usually takes a few seconds.
          </p>
          {sessionId && (
            <button className="btn" onClick={fetchOrder} style={{ marginTop: 8 }}>
              Refresh
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Link to="/" className="btn">Continue shopping</Link>
        <Link to="/support" className="btn" style={{ background: "#111", color: "#fff" }}>
          Need help?
        </Link>
      </div>
    </div>
  );
}

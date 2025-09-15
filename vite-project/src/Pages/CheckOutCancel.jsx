import React from "react";
import { Link } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <div className="page">
      <h1 style={{ marginBottom: 12 }}>Payment canceled</h1>

      <div className="card" style={{ padding: 16 }}>
        <p>Your payment was canceled before completion. No charges were made.</p>
        <p className="muted" style={{ marginTop: 6 }}>
          You can return to your cart, review your details, and try again anytime.
        </p>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Link to="/cart" className="btn">Back to cart</Link>
          <Link to="/" className="btn">Home</Link>
        </div>
      </div>
    </div>
  );
}
